"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const services_1 = require("../../performer-assets/services");
const services_2 = require("../../feed/services");
const lodash_1 = require("lodash");
const dtos_1 = require("../../feed/dtos");
const dtos_2 = require("../../performer-assets/dtos");
const services_3 = require("../../file/services");
const follow_service_1 = require("../../follow/services/follow.service");
const reaction_provider_1 = require("../providers/reaction.provider");
const reaction_dto_1 = require("../dtos/reaction.dto");
const services_4 = require("../../user/services");
const services_5 = require("../../performer/services");
const constants_2 = require("../constants");
let ReactionService = class ReactionService {
    constructor(followService, performerService, galleryService, productService, videoService, videoSearchService, userService, feedService, fileService, reactionModel, queueEventService) {
        this.followService = followService;
        this.performerService = performerService;
        this.galleryService = galleryService;
        this.productService = productService;
        this.videoService = videoService;
        this.videoSearchService = videoSearchService;
        this.userService = userService;
        this.feedService = feedService;
        this.fileService = fileService;
        this.reactionModel = reactionModel;
        this.queueEventService = queueEventService;
    }
    async findOneQuery(query) {
        return this.reactionModel.findOne(query).lean();
    }
    async findByQuery(query) {
        return this.reactionModel.find(query).lean();
    }
    async create(data, user) {
        const reaction = Object.assign({}, data);
        const existReact = await this.reactionModel.findOne({
            objectType: reaction.objectType,
            objectId: reaction.objectId,
            createdBy: user._id,
            action: reaction.action
        });
        if (existReact) {
            return existReact;
        }
        reaction.createdBy = user._id;
        reaction.createdAt = new Date();
        reaction.updatedAt = new Date();
        const newreaction = await this.reactionModel.create(reaction);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.REACTION_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new reaction_dto_1.ReactionDto(newreaction)
        }));
        return newreaction;
    }
    async remove(payload, user) {
        const reaction = await this.reactionModel.findOne({
            objectType: payload.objectType,
            objectId: payload.objectId,
            createdBy: user._id,
            action: payload.action
        });
        if (!reaction) {
            return false;
        }
        await this.reactionModel.deleteOne({ _id: reaction._id });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.REACTION_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new reaction_dto_1.ReactionDto(reaction)
        }));
        return true;
    }
    async search(req) {
        const query = {};
        if (req.objectId) {
            query.objectId = req.objectId;
        }
        const sort = {
            createdAt: -1
        };
        const [data, total] = await Promise.all([
            this.reactionModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.reactionModel.countDocuments(query)
        ]);
        const reactions = data.map((d) => new reaction_dto_1.ReactionDto(d));
        const UIds = data.map((d) => d.createdBy);
        const [users, performers] = await Promise.all([
            UIds.length ? this.userService.findByIds(UIds) : [],
            UIds.length ? this.performerService.findByIds(UIds) : []
        ]);
        reactions.forEach((reaction) => {
            const performer = performers.find((p) => p._id.toString() === reaction.createdBy.toString());
            const user = users.find((u) => u._id.toString() === reaction.createdBy.toString());
            reaction.creator = performer || user;
        });
        return {
            data: reactions,
            total
        };
    }
    async getListProduct(req, user) {
        const query = {
            objectType: constants_2.REACTION_TYPE.PRODUCT,
            action: constants_2.REACTION.BOOKMARK,
            createdBy: user._id
        };
        if (req.createdBy)
            query.createdBy = req.createdBy;
        if (req.action)
            query.action = req.action;
        const sort = {
            [req.sortBy || 'createdAt']: req.sort === 'desc' ? -1 : 1
        };
        const [items, total] = await Promise.all([
            this.reactionModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.reactionModel.countDocuments(query)
        ]);
        const productIds = (0, lodash_1.uniq)(items.map((i) => i.objectId));
        const products = productIds.length > 0 ? await this.productService.findByIds(productIds) : [];
        const fileIds = products.map((p) => p.imageId);
        const images = fileIds.length ? await this.fileService.findByIds(fileIds) : [];
        const reactions = items.map((v) => new reaction_dto_1.ReactionDto(v));
        reactions.forEach((item) => {
            const product = products.find((p) => `${p._id}` === `${item.objectId}`);
            if (product) {
                const p = new dtos_2.ProductDto(product);
                const image = images.find((f) => f._id.toString() === p.imageId.toString());
                p.image = image ? image.getUrl() : null;
                item.objectInfo = p;
            }
        });
        return {
            data: reactions,
            total
        };
    }
    async getListVideo(req, user) {
        const query = {
            objectType: constants_2.REACTION_TYPE.VIDEO,
            action: constants_2.REACTION.BOOKMARK,
            createdBy: user._id
        };
        if (req.createdBy)
            query.createdBy = req.createdBy;
        if (req.action)
            query.action = req.action;
        const sort = {
            [req.sortBy || 'createdAt']: req.sort === 'desc' ? -1 : 1
        };
        const [items, total] = await Promise.all([
            this.reactionModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.reactionModel.countDocuments(query)
        ]);
        const videoIds = (0, lodash_1.uniq)(items.map((i) => i.objectId));
        const videos = videoIds.length > 0 ? await this.videoService.findByIds(videoIds) : [];
        const mapVideos = await this.videoSearchService.mapArrayInfo(videos, user);
        const reactions = items.map((v) => new reaction_dto_1.ReactionDto(v));
        reactions.forEach((r) => {
            const item = r;
            const video = mapVideos.find((v) => `${v._id}` === `${item.objectId}`);
            item.objectInfo = video;
            return item;
        });
        return {
            data: reactions,
            total
        };
    }
    async getListGallery(req, user, jwToken) {
        const query = {
            objectType: constants_2.REACTION_TYPE.GALLERY,
            action: constants_2.REACTION.BOOKMARK,
            createdBy: user._id
        };
        if (req.createdBy)
            query.createdBy = req.createdBy;
        if (req.action)
            query.action = req.action;
        const sort = {
            [req.sortBy || 'createdAt']: req.sort === 'desc' ? -1 : 1
        };
        const [items, total] = await Promise.all([
            this.reactionModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.reactionModel.countDocuments(query)
        ]);
        const galleryIds = (0, lodash_1.uniq)(items.map((i) => i.objectId));
        const galleries = galleryIds.length > 0 ? await this.galleryService.findByIds(galleryIds) : [];
        const mapGalleries = await this.galleryService.mapArrayInfo(galleries, user, jwToken);
        const reactions = items.map((v) => new reaction_dto_1.ReactionDto(v));
        reactions.forEach((r) => {
            const item = r;
            const gallery = mapGalleries.find((p) => `${p._id}` === `${item.objectId}`);
            item.objectInfo = gallery;
            return item;
        });
        return {
            data: reactions,
            total
        };
    }
    async getListPerformer(req, user) {
        const query = {
            objectType: constants_2.REACTION_TYPE.PERFORMER,
            action: constants_2.REACTION.BOOKMARK,
            createdBy: user._id
        };
        if (req.createdBy)
            query.createdBy = req.createdBy;
        if (req.action)
            query.action = req.action;
        const sort = {
            [req.sortBy || 'createdAt']: req.sort === 'desc' ? -1 : 1
        };
        const [items, total] = await Promise.all([
            this.reactionModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.reactionModel.countDocuments(query)
        ]);
        const performerIds = (0, lodash_1.uniq)(items.map((i) => i.objectId));
        const [performers, follows] = await Promise.all([
            this.performerService.findByIds(performerIds),
            this.followService.find({
                followingId: { $in: performerIds },
                followerId: user._id
            })
        ]);
        const reactions = items.map((v) => new reaction_dto_1.ReactionDto(v));
        reactions.forEach((item) => {
            const performer = performers.find((p) => `${p._id}` === `${item.objectId}`);
            const followed = follows.find((f) => `${f.followingId}` === `${item.objectId}`);
            performer.isFollowed = !!followed;
            item.objectInfo = performer ? performer.toSearchResponse() : null;
        });
        return {
            data: reactions,
            total
        };
    }
    async getListFeeds(req, user, jwToken) {
        const query = {
            objectType: constants_2.REACTION_TYPE.FEED,
            action: constants_2.REACTION.BOOKMARK,
            createdBy: user._id
        };
        if (req.createdBy)
            query.createdBy = req.createdBy;
        if (req.action)
            query.action = req.action;
        if (req.objectType) {
            query.objectType = req.objectType;
        }
        const sort = {
            [req.sortBy || 'createdAt']: req.sort === 'desc' ? -1 : 1
        };
        const [items, total] = await Promise.all([
            this.reactionModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(req.limit)
                .skip(req.offset),
            this.reactionModel.countDocuments(query)
        ]);
        const feedIds = (0, lodash_1.uniq)(items.map((i) => i.objectId));
        const feeds = await this.feedService.findByIds(feedIds);
        const mapFeeds = await this.feedService.populateFeedData(feeds, user, jwToken);
        const reactions = items.map((v) => new reaction_dto_1.ReactionDto(v));
        reactions.forEach((item) => {
            const feed = mapFeeds.find((p) => `${p._id}` === `${item.objectId}`);
            item.objectInfo = feed ? new dtos_1.FeedDto(feed) : null;
        });
        return {
            data: reactions,
            total
        };
    }
    async checkExisting(objectId, userId, action, objectType) {
        return this.reactionModel.countDocuments({
            objectId, createdBy: userId, action, objectType
        });
    }
};
ReactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => follow_service_1.FollowService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_5.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.GalleryService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.ProductService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.VideoService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.VideoSearchService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_4.UserService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.FeedService))),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.FileService))),
    __param(9, (0, common_1.Inject)(reaction_provider_1.REACT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [follow_service_1.FollowService,
        services_5.PerformerService,
        services_1.GalleryService,
        services_1.ProductService,
        services_1.VideoService,
        services_1.VideoSearchService,
        services_4.UserService,
        services_2.FeedService,
        services_3.FileService,
        mongoose_1.Model,
        kernel_1.QueueEventService])
], ReactionService);
exports.ReactionService = ReactionService;
//# sourceMappingURL=reaction.service.js.map