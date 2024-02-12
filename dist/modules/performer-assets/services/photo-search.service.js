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
exports.PhotoSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const lodash_1 = require("lodash");
const services_1 = require("../../performer/services");
const services_2 = require("../../file/services");
const dtos_1 = require("../../performer/dtos");
const constants_1 = require("../../../kernel/constants");
const services_3 = require("../../token-transaction/services");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const constants_2 = require("../../token-transaction/constants");
const contants_1 = require("../../storage/contants");
const providers_1 = require("../providers");
const dtos_2 = require("../dtos");
const gallery_service_1 = require("./gallery.service");
let PhotoSearchService = class PhotoSearchService {
    constructor(tokenTransactionSearchService, subscriptionService, performerService, photoModel, galleryService, fileService) {
        this.tokenTransactionSearchService = tokenTransactionSearchService;
        this.subscriptionService = subscriptionService;
        this.performerService = performerService;
        this.photoModel = photoModel;
        this.galleryService = galleryService;
        this.fileService = fileService;
    }
    async adminSearch(req, jwToken) {
        const query = {};
        if (req.q)
            query.title = { $regex: req.q };
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.galleryId)
            query.galleryId = req.galleryId;
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.photoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.photoModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const galleryIds = data.map((d) => d.galleryId);
        const fileIds = data.map((d) => d.fileId);
        const photos = data.map((v) => new dtos_2.PhotoDto(v));
        const [performers, galleries, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            galleryIds.length ? this.galleryService.findByIds(galleryIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        photos.forEach((v) => {
            const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = new dtos_1.PerformerDto(performer).toResponse();
            }
            if (v.galleryId) {
                const gallery = galleries.find((p) => p._id.toString() === v.galleryId.toString());
                if (gallery)
                    v.gallery = gallery;
            }
            const file = files.find((f) => f._id.toString() === v.fileId.toString());
            if (file) {
                let fileUrl = file.getUrl(true);
                if (file.server !== contants_1.Storage.S3) {
                    fileUrl = `${fileUrl}?photoId=${v._id}&token=${jwToken}`;
                }
                v.photo = {
                    size: file.size,
                    thumbnails: file.getThumbnails(),
                    url: fileUrl,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                };
            }
        });
        return {
            data: photos,
            total
        };
    }
    async performerSearch(req, user, jwToken) {
        const query = {
            performerId: user._id
        };
        if (req.q)
            query.title = { $regex: req.q };
        if (req.galleryId)
            query.galleryId = req.galleryId;
        if (req.status)
            query.status = req.status;
        const [data, total] = await Promise.all([
            this.photoModel
                .find(query)
                .lean()
                .sort('-createdAt')
                .limit(req.limit)
                .skip(req.offset),
            this.photoModel.countDocuments(query)
        ]);
        const performerIds = data.map((d) => d.performerId);
        const fileIds = data.map((d) => d.fileId);
        const photos = data.map((v) => new dtos_2.PhotoDto(v));
        const [performers, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        photos.forEach((v) => {
            const performer = performers.find((p) => p._id.toString() === v.performerId.toString());
            if (performer) {
                v.performer = new dtos_1.PerformerDto(performer).toResponse();
            }
            const file = files.find((f) => f._id.toString() === v.fileId.toString());
            if (file) {
                let fileUrl = file.getUrl(`${v.performerId}` === `${user._id}`);
                if (file.server !== contants_1.Storage.S3) {
                    fileUrl = `${fileUrl}?photoId=${v._id}&token=${jwToken}`;
                }
                v.photo = {
                    size: file.size,
                    thumbnails: file.getThumbnails(),
                    url: fileUrl,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                };
            }
        });
        return {
            data: photos,
            total
        };
    }
    async searchPhotos(req, user, jwToken) {
        const query = {
            processing: false,
            status: constants_1.STATUS.ACTIVE
        };
        if (req.galleryId)
            query.galleryId = req.galleryId;
        const sort = { createdAt: -1 };
        const [data, total] = await Promise.all([
            this.photoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.photoModel.countDocuments(query)
        ]);
        const fileIds = data.map((d) => d.fileId);
        const photos = data.map((v) => new dtos_2.PhotoDto(v));
        const performerIds = (0, lodash_1.uniq)(data.map((v) => v.performerId));
        const galleryIds = data.filter((d) => d.galleryId).map((p) => p.galleryId);
        const [galleries, files, subscriptions, transactions] = await Promise.all([
            galleryIds.length ? this.galleryService.findByIds(galleryIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : [],
            (user === null || user === void 0 ? void 0 : user._id) ? this.subscriptionService.findSubscriptionList({
                userId: user._id,
                performerId: { $in: performerIds },
                expiredAt: { $gt: new Date() }
            }) : [],
            (user === null || user === void 0 ? void 0 : user._id) ? this.tokenTransactionSearchService.findByQuery({
                sourceId: user._id,
                targetId: { $in: galleryIds },
                target: constants_2.PURCHASE_ITEM_TARTGET_TYPE.GALLERY,
                status: constants_2.PURCHASE_ITEM_STATUS.SUCCESS
            }) : []
        ]);
        photos.forEach((v) => {
            if (v.galleryId) {
                const gallery = galleries.find((p) => p._id.toString() === v.galleryId.toString());
                if (gallery)
                    v.gallery = gallery;
            }
            const subscription = subscriptions.find((s) => `${s.performerId}` === `${v.performerId}`);
            const bought = transactions.find((transaction) => `${transaction.targetId}` === `${v.galleryId}`);
            const canView = (v.gallery && !v.gallery.isSale && !!subscription) || (v.gallery && v.gallery.isSale && !!bought) || (user && `${user._id}` === `${v.performerId}`) || (user && user.roles && user.roles.includes('admin'));
            const file = files.find((f) => f._id.toString() === v.fileId.toString());
            if (file) {
                let fileUrl = file.getUrl(canView);
                if (file.server !== contants_1.Storage.S3) {
                    fileUrl = `${fileUrl}?photoId=${v._id}&token=${jwToken}`;
                }
                v.photo = {
                    size: file.size,
                    thumbnails: file.getThumbnails(),
                    url: fileUrl,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                };
            }
        });
        return {
            data: photos,
            total
        };
    }
};
PhotoSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.TokenTransactionSearchService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(3, (0, common_1.Inject)(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_3.TokenTransactionSearchService,
        subscription_service_1.SubscriptionService,
        services_1.PerformerService,
        mongoose_1.Model,
        gallery_service_1.GalleryService,
        services_2.FileService])
], PhotoSearchService);
exports.PhotoSearchService = PhotoSearchService;
//# sourceMappingURL=photo-search.service.js.map