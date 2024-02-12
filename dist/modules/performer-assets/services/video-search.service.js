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
exports.VideoSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const services_1 = require("../../token-transaction/services");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const services_2 = require("../../performer/services");
const services_3 = require("../../file/services");
const dtos_1 = require("../../performer/dtos");
const constants_1 = require("../../../kernel/constants");
const lodash_1 = require("lodash");
const constants_2 = require("../../token-transaction/constants");
const moment = require("moment");
const dtos_2 = require("../dtos");
const providers_1 = require("../providers");
let VideoSearchService = class VideoSearchService {
    constructor(tokenTransactionSearchService, performerService, subscriptionService, videoModel, fileService) {
        this.tokenTransactionSearchService = tokenTransactionSearchService;
        this.performerService = performerService;
        this.subscriptionService = subscriptionService;
        this.videoModel = videoModel;
        this.fileService = fileService;
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
        if (req.isSale)
            query.isSale = req.isSale === 'true';
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.videoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.videoModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const fileIds = [];
        data.forEach((v) => {
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
            v.teaserId && fileIds.push(v.teaserId);
        });
        const [performers, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const videos = data.map((v) => new dtos_2.VideoDto(v));
        videos.forEach((v) => {
            const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = new dtos_1.PerformerDto(performer).toResponse();
            }
            if (v.thumbnailId) {
                const thumbnail = files.find((f) => f._id.toString() === v.thumbnailId.toString());
                if (thumbnail) {
                    v.thumbnail = {
                        name: thumbnail.name,
                        url: thumbnail.getUrl(),
                        thumbnails: thumbnail.getThumbnails()
                    };
                }
            }
            if (v.fileId) {
                const video = files.find((f) => f._id.toString() === v.fileId.toString());
                if (video) {
                    v.video = {
                        name: video.name,
                        url: null,
                        thumbnails: video.getThumbnails(),
                        duration: video.duration
                    };
                }
            }
            if (v.teaserId) {
                const teaser = files.find((f) => f._id.toString() === v.teaserId.toString());
                if (teaser) {
                    v.teaser = {
                        name: teaser.name,
                        url: null,
                        thumbnails: teaser.getThumbnails(),
                        duration: teaser.duration
                    };
                }
            }
        });
        return {
            data: videos,
            total
        };
    }
    async performerSearch(req, performer) {
        const query = {
            performerId: performer._id
        };
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
        if (req.isSale)
            query.isSale = req.isSale === 'true';
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.videoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.videoModel.countDocuments(query)
        ]);
        const fileIds = [];
        data.forEach((v) => {
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
            v.teaserId && fileIds.push(v.teaserId);
        });
        const [files] = await Promise.all([
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const videos = data.map((v) => new dtos_2.VideoDto(v));
        videos.forEach((v) => {
            if (v.thumbnailId) {
                const thumbnail = files.find((f) => f._id.toString() === v.thumbnailId.toString());
                if (thumbnail) {
                    v.thumbnail = {
                        name: thumbnail.name,
                        url: thumbnail.getUrl(),
                        thumbnails: thumbnail.getThumbnails()
                    };
                }
            }
            if (v.teaserId) {
                const teaser = files.find((f) => f._id.toString() === v.teaserId.toString());
                if (teaser) {
                    v.teaser = {
                        name: teaser.name,
                        url: null,
                        thumbnails: teaser.getThumbnails()
                    };
                }
            }
            if (v.fileId) {
                const video = files.find((f) => f._id.toString() === v.fileId.toString());
                if (video) {
                    v.video = {
                        name: video.name,
                        url: null,
                        thumbnails: video.getThumbnails(),
                        duration: video.duration
                    };
                }
            }
        });
        return {
            data: videos,
            total
        };
    }
    async userSearch(req, user) {
        const query = {
            status: constants_1.STATUS.ACTIVE
        };
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
        if (req.isSale)
            query.isSale = req.isSale === 'true';
        if (req.excludedId)
            query._id = { $ne: req.excludedId };
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.videoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.videoModel.countDocuments(query)
        ]);
        const videos = await this.mapArrayInfo(data, user);
        return {
            data: videos,
            total
        };
    }
    async mapArrayInfo(data, user) {
        const fileIds = [];
        data.forEach((v) => {
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
            v.teaserId && fileIds.push(v.teaserId);
        });
        const performerIds = (0, lodash_1.uniq)(data.map((d) => d.performerId));
        const videoIds = data.map((d) => d._id);
        const [files, subscriptions, transactions] = await Promise.all([
            fileIds.length ? this.fileService.findByIds(fileIds) : [],
            (user === null || user === void 0 ? void 0 : user._id) ? this.subscriptionService.findSubscriptionList({
                userId: user._id,
                performerId: { $in: performerIds },
                expiredAt: { $gt: new Date() }
            }) : [],
            (user === null || user === void 0 ? void 0 : user._id) ? this.tokenTransactionSearchService.findByQuery({
                sourceId: user._id,
                targetId: { $in: videoIds },
                target: constants_2.PURCHASE_ITEM_TARTGET_TYPE.VIDEO,
                status: constants_2.PURCHASE_ITEM_STATUS.SUCCESS
            }) : []
        ]);
        const videos = data.map((v) => new dtos_2.VideoDto(v));
        videos.forEach((vid) => {
            const v = vid;
            if (v.thumbnailId) {
                const thumbnail = files.find((f) => f._id.toString() === v.thumbnailId.toString());
                if (thumbnail) {
                    v.thumbnail = {
                        url: thumbnail.getUrl(),
                        thumbnails: thumbnail.getThumbnails()
                    };
                }
            }
            if (v.teaserId) {
                const teaser = files.find((f) => f._id.toString() === v.teaserId.toString());
                if (teaser) {
                    v.teaser = {
                        url: null,
                        thumbnails: teaser.getThumbnails(),
                        duration: teaser.duration
                    };
                }
            }
            if (v.fileId) {
                const video = files.find((f) => f._id.toString() === v.fileId.toString());
                if (video) {
                    v.video = {
                        url: null,
                        thumbnails: video.getThumbnails(),
                        duration: video.duration
                    };
                }
            }
            const isSubscribed = subscriptions.find((s) => `${s.performerId}` === `${v.performerId}`);
            v.isSubscribed = !user ? false : !!((isSubscribed || (`${user._id}` === `${v.performerId}`) || (user.roles && user.roles.includes('admin'))));
            const bought = transactions.find((transaction) => `${transaction.targetId}` === `${v._id}`);
            v.isBought = !user ? false : !!((bought || (`${user._id}` === `${v.performerId}`) || (user.roles && user.roles.includes('admin'))));
            return v;
        });
        return videos;
    }
};
VideoSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.TokenTransactionSearchService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(3, (0, common_1.Inject)(providers_1.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.TokenTransactionSearchService,
        services_2.PerformerService,
        subscription_service_1.SubscriptionService,
        mongoose_1.Model,
        services_3.FileService])
], VideoSearchService);
exports.VideoSearchService = VideoSearchService;
//# sourceMappingURL=video-search.service.js.map