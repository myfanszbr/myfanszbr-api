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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const reaction_service_1 = require("../../reaction/services/reaction.service");
const lodash_1 = require("lodash");
const services_2 = require("../../file/services");
const constants_1 = require("../../reaction/constants");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const services_3 = require("../../token-transaction/services");
const constants_2 = require("../../token-transaction/constants");
const dtos_1 = require("../../performer/dtos");
const constants_3 = require("../../../kernel/constants");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const moment = require("moment");
const contants_1 = require("../../storage/contants");
const dtos_2 = require("../dtos");
const providers_1 = require("../providers");
const photo_service_1 = require("./photo.service");
const constants_4 = require("../constants");
let GalleryService = class GalleryService {
    constructor(subscriptionService, performerService, reactionService, photoService, tokenTransactionService, tokenTransactionSearchService, galleryModel, photoModel, fileService, queueEventService) {
        this.subscriptionService = subscriptionService;
        this.performerService = performerService;
        this.reactionService = reactionService;
        this.photoService = photoService;
        this.tokenTransactionService = tokenTransactionService;
        this.tokenTransactionSearchService = tokenTransactionSearchService;
        this.galleryModel = galleryModel;
        this.photoModel = photoModel;
        this.fileService = fileService;
        this.queueEventService = queueEventService;
    }
    async create(payload, creator) {
        if (payload.performerId) {
            const performer = await this.performerService.findById(payload.performerId);
            if (!performer) {
                throw new kernel_1.EntityNotFoundException('Performer not found!');
            }
        }
        const model = new this.galleryModel(payload);
        model.slug = kernel_1.StringHelper.createAlias(payload.title);
        const slugCheck = await this.galleryModel.countDocuments({
            slug: model.slug
        });
        if (slugCheck) {
            model.slug = `${model.slug}-${kernel_1.StringHelper.randomString(8)}`;
        }
        model.createdAt = new Date();
        model.updatedAt = new Date();
        if (creator) {
            if (!model.performerId) {
                model.performerId = creator._id;
            }
            model.createdBy = creator._id;
            model.updatedBy = creator._id;
        }
        await model.save();
        return dtos_2.GalleryDto.fromModel(model);
    }
    async update(id, payload, creator) {
        const gallery = await this.galleryModel.findById(id);
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException('Gallery not found!');
        }
        let { slug } = gallery;
        if (payload.title !== gallery.title) {
            slug = kernel_1.StringHelper.createAlias(payload.title);
            const slugCheck = await this.galleryModel.countDocuments({
                slug,
                _id: { $ne: gallery._id }
            });
            if (slugCheck) {
                slug = `${slug}-${new Date().getTime()}`;
            }
        }
        (0, lodash_1.merge)(gallery, payload);
        gallery.updatedAt = new Date();
        if (creator) {
            gallery.updatedBy = creator._id;
        }
        gallery.slug = slug;
        await gallery.save();
        return dtos_2.GalleryDto.fromModel(gallery);
    }
    async find(query) {
        return this.galleryModel.find(query);
    }
    async findByIds(ids) {
        const galleries = await this.galleryModel.find({
            _id: {
                $in: ids
            }
        });
        return galleries.map((g) => new dtos_2.GalleryDto(g));
    }
    async findById(id) {
        const gallery = await this.galleryModel.findOne({ _id: id });
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        return new dtos_2.GalleryDto(gallery);
    }
    async mapArrayInfo(data, user, jwToken) {
        const performerIds = data.map((d) => d.performerId);
        const galleries = data.map((g) => new dtos_2.GalleryDto(g));
        const coverPhotoIds = data.map((d) => d.coverPhotoId);
        const galleryIds = data.map((d) => d._id);
        const [performers, coverPhotos, reactions, subscriptions, transactions] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            coverPhotoIds.length
                ? this.photoModel
                    .find({ _id: { $in: coverPhotoIds } })
                    .lean()
                    .exec()
                : [],
            (user === null || user === void 0 ? void 0 : user._id) ? this.reactionService.findByQuery({
                objectType: constants_1.REACTION_TYPE.GALLERY, objectId: { $in: galleryIds }, createdBy: user._id
            }) : [],
            (user === null || user === void 0 ? void 0 : user._id) ? this.subscriptionService.findSubscriptionList({
                userId: user._id, performerId: { $in: performerIds }, expiredAt: { $gt: new Date() }
            }) : [],
            (user === null || user === void 0 ? void 0 : user._id) ? this.tokenTransactionSearchService.findByQuery({
                sourceId: user._id,
                targetId: { $in: galleryIds },
                target: constants_2.PURCHASE_ITEM_TARTGET_TYPE.GALLERY,
                status: constants_2.PURCHASE_ITEM_STATUS.SUCCESS
            }) : []
        ]);
        const fileIds = coverPhotos.map((c) => c.fileId);
        const files = await this.fileService.findByIds(fileIds);
        galleries.forEach((g) => {
            const performer = performers.find((p) => p._id.toString() === g.performerId.toString());
            g.performer = performer ? new dtos_1.PerformerDto(performer).toPublicDetailsResponse() : null;
            const bookmarked = reactions.find((l) => l.objectId.toString() === g._id.toString() && l.action === constants_1.REACTION.BOOKMARK);
            g.isBookMarked = !!bookmarked;
            if (g.coverPhotoId) {
                const coverPhoto = coverPhotos.find((c) => c._id.toString() === g.coverPhotoId.toString());
                if (coverPhoto) {
                    const file = files.find((f) => f._id.toString() === coverPhoto.fileId.toString());
                    if (file) {
                        let fileUrl = file.getUrl(true);
                        if (file.server !== contants_1.Storage.S3) {
                            fileUrl = `${fileUrl}?photoId=${g.coverPhotoId._id}&token=${jwToken}`;
                        }
                        g.coverPhoto = {
                            url: fileUrl,
                            thumbnails: file.getThumbnails()
                        };
                    }
                }
            }
            const isSubscribed = subscriptions.find((s) => `${s.performerId}` === `${g.performerId}`);
            g.isSubscribed = !user ? false : !!((isSubscribed || (`${user._id}` === `${g.performerId}`) || (user.roles && user.roles.includes('admin'))));
            const bought = transactions.find((transaction) => `${transaction.targetId}` === `${g._id}`);
            g.isBought = !user ? false : !!((bought || (`${user._id}` === `${g.performerId}`) || (user.roles && user.roles.includes('admin'))));
        });
        return galleries;
    }
    async details(id, user) {
        const query = (0, string_helper_1.isObjectId)(id) ? { _id: id } : { slug: id };
        const gallery = await this.galleryModel.findOne(query);
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_2.GalleryDto(gallery);
        if (gallery.performerId) {
            const performer = await this.performerService.findById(gallery.performerId);
            dto.performer = performer ? new dtos_1.PerformerDto(performer).toPublicDetailsResponse() : null;
        }
        if (gallery.coverPhotoId) {
            const coverPhoto = await this.photoModel.findById(gallery.coverPhotoId);
            if (coverPhoto) {
                const file = await this.fileService.findById(coverPhoto.fileId);
                dto.coverPhoto = file ? {
                    url: file.getUrl(),
                    thumbnails: file.getThumbnails()
                } : null;
            }
        }
        const bookmark = user && await this.reactionService.checkExisting(dto._id, user._id, constants_1.REACTION.BOOKMARK, constants_1.REACTION_TYPE.GALLERY);
        dto.isBookMarked = !!bookmark;
        const subscription = user && await this.subscriptionService.findOneSubscription({
            performerId: dto.performerId,
            userId: user._id
        });
        dto.isSubscribed = !!(subscription && moment().isBefore(subscription.expiredAt));
        const isBought = user && await this.tokenTransactionService.checkBought(gallery, constants_2.PurchaseItemType.GALLERY, user);
        dto.isBought = !!isBought;
        if ((user && user.roles && user.roles.includes('admin')) || (`${user === null || user === void 0 ? void 0 : user._id}` === `${gallery === null || gallery === void 0 ? void 0 : gallery.performerId}`)) {
            dto.isBought = true;
            dto.isSubscribed = true;
        }
        if (subscription && subscription.usedFreeSubscription) {
            dto.performer.isFreeSubscription = false;
        }
        if (`${user === null || user === void 0 ? void 0 : user._id}` !== `${gallery === null || gallery === void 0 ? void 0 : gallery.performerId}`) {
            await this.galleryModel.updateOne({ _id: gallery._id }, { $inc: { 'stats.views': 1 } });
        }
        return dto;
    }
    async updatePhotoStats(id, num = 1) {
        return this.galleryModel.findOneAndUpdate({ _id: id }, {
            $inc: { numOfItems: num }
        });
    }
    async downloadZipPhotos(galleryId, user) {
        const gallery = await this.galleryModel.findOne({ _id: galleryId });
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!gallery.isSale) {
            const isSubscribed = await this.subscriptionService.checkSubscribed(gallery.performerId, user._id);
            if (!isSubscribed)
                throw new common_1.HttpException('Please subscribe model before downloading', 403);
        }
        if (gallery.isSale) {
            const isBought = await this.tokenTransactionService.checkBought(gallery, constants_2.PurchaseItemType.GALLERY, user);
            if (!isBought)
                throw new common_1.HttpException('Please unlock gallery before downloading', 403);
        }
        const photos = await this.photoModel.find({ galleryId });
        const fileIds = photos.map((d) => d.fileId);
        const files = await this.fileService.findByIds(fileIds);
        return files.map((f) => ({ path: f.getUrl(), name: f.name }));
    }
    async adminSearch(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    title: { $regex: regexp }
                }
            ];
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day').toDate(),
                $lt: moment(req.toDate).endOf('day').toDate()
            };
        }
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.galleryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.galleryModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const galleries = data.map((g) => new dtos_2.GalleryDto(g));
        const coverPhotoIds = data.map((d) => d.coverPhotoId);
        const [performers, coverPhotos] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            coverPhotoIds.length
                ? this.photoModel
                    .find({ _id: { $in: coverPhotoIds } })
                    .lean()
                    .exec()
                : []
        ]);
        const fileIds = coverPhotos.map((c) => c.fileId);
        const files = await this.fileService.findByIds(fileIds);
        galleries.forEach((g) => {
            const performer = performers.find((p) => p._id.toString() === g.performerId.toString());
            if (performer) {
                g.performer = new dtos_1.PerformerDto(performer).toPublicDetailsResponse();
            }
            if (g.coverPhotoId) {
                const coverPhoto = coverPhotos.find((c) => c._id.toString() === g.coverPhotoId.toString());
                if (coverPhoto) {
                    const file = files.find((f) => f._id.toString() === coverPhoto.fileId.toString());
                    if (file) {
                        g.coverPhoto = {
                            url: file.getUrl(),
                            thumbnails: file.getThumbnails()
                        };
                    }
                }
            }
        });
        return {
            data: galleries,
            total
        };
    }
    async performerSearch(req, user) {
        const query = {
            performerId: user._id
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                }
            ];
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day').toDate(),
                $lt: moment(req.toDate).endOf('day').toDate()
            };
        }
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.galleryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.galleryModel.countDocuments(query)
        ]);
        const galleries = data.map((g) => new dtos_2.GalleryDto(g));
        const coverPhotoIds = data.map((d) => d.coverPhotoId);
        const [coverPhotos] = await Promise.all([
            coverPhotoIds.length
                ? this.photoModel
                    .find({ _id: { $in: coverPhotoIds } })
                    .lean()
                    .exec()
                : []
        ]);
        const fileIds = coverPhotos.map((c) => c.fileId);
        const files = await this.fileService.findByIds(fileIds);
        galleries.forEach((g) => {
            if (g.coverPhotoId) {
                const coverPhoto = coverPhotos.find((c) => c._id.toString() === g.coverPhotoId.toString());
                if (coverPhoto) {
                    const file = files.find((f) => f._id.toString() === coverPhoto.fileId.toString());
                    if (file) {
                        g.coverPhoto = {
                            url: file.getUrl(),
                            thumbnails: file.getThumbnails()
                        };
                    }
                }
            }
        });
        return {
            data: galleries,
            total
        };
    }
    async userSearch(req, user, jwToken) {
        const query = {
            status: constants_3.STATUS.ACTIVE,
            numOfItems: { $gt: 0 }
        };
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                }
            ];
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day').toDate(),
                $lt: moment(req.toDate).endOf('day').toDate()
            };
        }
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.excludedId) {
            query._id = { $ne: req.excludedId };
        }
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.galleryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.galleryModel.countDocuments(query)
        ]);
        const galleries = await this.mapArrayInfo(data, user, jwToken);
        return {
            data: galleries,
            total
        };
    }
    async updateCover(galleryId, photoId) {
        await this.galleryModel.updateOne({ _id: galleryId }, {
            coverPhotoId: photoId
        });
        return true;
    }
    async delete(id) {
        const gallery = await this.galleryModel.findById(id);
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.galleryModel.deleteOne({ _id: gallery._id });
        await this.photoService.deleteByGallery(gallery._id);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.DELETED_ASSETS_CHANNEL,
            eventName: constants_3.EVENT.DELETED,
            data: new dtos_2.GalleryDto(gallery)
        }));
        return true;
    }
    async updateCommentStats(id, num = 1) {
        await this.galleryModel.updateOne({ _id: id }, {
            $inc: { 'stats.comments': num }
        });
    }
    async updateLikeStats(id, num = 1) {
        await this.galleryModel.updateOne({ _id: id }, {
            $inc: { 'stats.likes': num }
        });
    }
    async updateBookmarkStats(id, num = 1) {
        await this.galleryModel.updateOne({ _id: id }, {
            $inc: { 'stats.bookmarks': num }
        });
    }
};
GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => reaction_service_1.ReactionService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => photo_service_1.PhotoService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.TokenTransactionService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.TokenTransactionSearchService))),
    __param(6, (0, common_1.Inject)(providers_1.PERFORMER_GALLERY_MODEL_PROVIDER)),
    __param(7, (0, common_1.Inject)(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        services_1.PerformerService,
        reaction_service_1.ReactionService,
        photo_service_1.PhotoService,
        services_3.TokenTransactionService,
        services_3.TokenTransactionSearchService,
        mongoose_1.Model,
        mongoose_1.Model,
        services_2.FileService,
        kernel_1.QueueEventService])
], GalleryService);
exports.GalleryService = GalleryService;
//# sourceMappingURL=gallery.service.js.map