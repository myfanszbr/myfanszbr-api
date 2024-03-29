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
exports.PhotoService = exports.PERFORMER_PHOTO_CHANNEL = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../file/services");
const lodash_1 = require("lodash");
const services_2 = require("../../performer/services");
const constants_1 = require("../../../kernel/constants");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const constants_2 = require("../../file/constants");
const services_3 = require("../../token-transaction/services");
const constants_3 = require("../../token-transaction/constants");
const contants_1 = require("../../storage/contants");
const dtos_1 = require("../../performer/dtos");
const constants_4 = require("../constants");
const dtos_2 = require("../dtos");
const gallery_service_1 = require("./gallery.service");
const providers_1 = require("../providers");
exports.PERFORMER_PHOTO_CHANNEL = 'PERFORMER_PHOTO_CHANNEL';
const PHOTO_CONVERT_CHANNEL = 'PHOTO_CONVERT_CHANNEL';
const FILE_PROCESSED_TOPIC = 'FILE_PROCESSED';
let PhotoService = class PhotoService {
    constructor(performerService, galleryService, subscriptionService, tokenTransactionService, photoModel, queueEventService, fileService) {
        this.performerService = performerService;
        this.galleryService = galleryService;
        this.subscriptionService = subscriptionService;
        this.tokenTransactionService = tokenTransactionService;
        this.photoModel = photoModel;
        this.queueEventService = queueEventService;
        this.fileService = fileService;
        this.queueEventService.subscribe(PHOTO_CONVERT_CHANNEL, FILE_PROCESSED_TOPIC, this.handleFileProcessed.bind(this));
    }
    async handleFileProcessed(event) {
        if (event.eventName !== services_1.FILE_EVENT.PHOTO_PROCESSED)
            return;
        const { photoId } = event.data.meta;
        const [photo, file] = await Promise.all([
            this.photoModel.findById(photoId),
            this.fileService.findById(event.data.fileId)
        ]);
        if (!photo) {
            await this.fileService.remove(event.data.fileId);
            return;
        }
        photo.processing = false;
        if (file.status === 'error') {
            photo.status = constants_4.PHOTO_STATUS.FILE_ERROR;
        }
        await photo.save();
        if (file.status === 'error' || !photo.galleryId)
            return;
        const photoCover = await this.photoModel.findOne({
            galleryId: photo.galleryId,
            isGalleryCover: true
        });
        if (photoCover)
            return;
        await this.galleryService.updateCover(photo.galleryId, photo._id);
        await this.photoModel.updateOne({ _id: photo._id }, {
            isGalleryCover: true
        });
    }
    async create(file, payload, creator) {
        if (!file)
            throw new common_1.HttpException('File is valid!', 400);
        if (!file.isImage()) {
            await this.fileService.removeIfNotHaveRef(file._id);
            throw new common_1.HttpException('Invalid image!', 400);
        }
        const photo = new this.photoModel(payload);
        if (!photo.title)
            photo.title = file.name;
        photo.fileId = file._id;
        photo.createdAt = new Date();
        photo.updatedAt = new Date();
        if (creator) {
            if (!photo.performerId) {
                photo.performerId = creator._id;
            }
            photo.createdBy = creator._id;
            photo.updatedBy = creator._id;
        }
        photo.processing = true;
        await photo.save();
        await Promise.all([
            this.fileService.addRef(file._id, {
                itemType: constants_2.REF_TYPE.PHOTO,
                itemId: photo._id
            }),
            this.fileService.queueProcessPhoto(file._id, {
                meta: {
                    photoId: photo._id
                },
                publishChannel: PHOTO_CONVERT_CHANNEL,
                thumbnailSize: (0, kernel_1.getConfig)('image').blurThumbnail
            }),
            this.galleryService.updatePhotoStats(photo.galleryId, 1)
        ]);
        const dto = new dtos_2.PhotoDto(photo);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_PHOTO_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: dto
        }));
        return dto;
    }
    async updateInfo(id, payload, updater) {
        const photo = await this.photoModel.findById(id);
        if (!photo) {
            throw new kernel_1.EntityNotFoundException();
        }
        const oldStatus = photo.status;
        (0, lodash_1.merge)(photo, payload);
        if (photo.status !== constants_4.PHOTO_STATUS.FILE_ERROR && payload.status !== constants_4.PHOTO_STATUS.FILE_ERROR) {
            photo.status = payload.status;
        }
        updater && photo.set('updatedBy', updater._id);
        photo.updatedAt = new Date();
        await photo.save();
        const dto = new dtos_2.PhotoDto(photo);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_PHOTO_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: Object.assign(Object.assign({}, dto), { oldStatus })
        }));
        return dto;
    }
    async setCoverGallery(id, updater) {
        const photo = await this.photoModel.findById(id);
        if (!photo) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (updater.roles && !updater.roles.includes('admin') && `${updater._id}` !== `${photo.performerId}`) {
            throw new kernel_1.ForbiddenException();
        }
        await this.photoModel.updateMany({
            galleryId: photo.galleryId
        }, {
            isGalleryCover: false
        });
        photo.isGalleryCover = true;
        await photo.save();
        photo.galleryId && await this.galleryService.updateCover(photo.galleryId, photo._id);
        return new dtos_2.PhotoDto(photo);
    }
    async details(id, jwToken, user) {
        const photo = await this.photoModel.findOne({ _id: id });
        if (!photo) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_2.PhotoDto(photo);
        const [performer, gallery, file, isSubscribed] = await Promise.all([
            photo.performerId ? this.performerService.findById(photo.performerId) : null,
            photo.galleryId ? this.galleryService.findById(photo.galleryId) : null,
            photo.fileId ? this.fileService.findById(photo.fileId) : null,
            user ? this.subscriptionService.checkSubscribed(photo.performerId, user._id) : false
        ]);
        if (performer)
            dto.performer = new dtos_1.PerformerDto(performer).toResponse();
        if (gallery)
            dto.gallery = new dtos_2.GalleryDto(gallery);
        const isBought = user && gallery ? this.tokenTransactionService.checkBought(new dtos_2.GalleryDto(gallery), constants_3.PurchaseItemType.GALLERY, user) : false;
        const canView = (gallery.isSale && isBought) || (!gallery.isSale && isSubscribed) || (`${user === null || user === void 0 ? void 0 : user._id}` === `${gallery === null || gallery === void 0 ? void 0 : gallery.performerId}`) || (user && user.roles && user.roles.includes('admin'));
        if (file) {
            let fileUrl = file.getUrl(canView);
            if (file.server !== contants_1.Storage.S3) {
                fileUrl = `${fileUrl}?photoId=${dto._id}&token=${jwToken}`;
            }
            dto.photo = {
                url: fileUrl,
                thumbnails: file.getThumbnails(),
                width: file.width,
                height: file.height
            };
        }
        return dto;
    }
    async delete(id) {
        const photo = await this.photoModel.findById(id);
        if (!photo) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_2.PhotoDto(photo);
        await this.photoModel.deleteOne({ _id: photo._id });
        await this.fileService.remove(photo.fileId);
        photo.galleryId && await this.galleryService.updatePhotoStats(photo.galleryId, -1);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: exports.PERFORMER_PHOTO_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: dto
        }));
        return true;
    }
    async deleteByGallery(galleryId) {
        const photos = await this.photoModel.find({ galleryId });
        if (photos && photos.length > 0) {
            await photos.reduce(async (lp, photo) => {
                await lp;
                await this.photoModel.deleteOne({ _id: photo._id });
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: exports.PERFORMER_PHOTO_CHANNEL,
                    eventName: constants_1.EVENT.DELETED,
                    data: new dtos_2.PhotoDto(photo)
                }));
                await this.fileService.remove(photo.fileId);
                return Promise.resolve();
            }, Promise.resolve());
        }
        return true;
    }
    async checkAuth(req, user) {
        const { query } = req;
        if (!query.photoId) {
            throw new kernel_1.ForbiddenException();
        }
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        const photo = await this.photoModel.findById(query.photoId);
        if (!photo)
            throw new kernel_1.EntityNotFoundException();
        if (user._id.toString() === photo.performerId.toString()) {
            return true;
        }
        const gallery = await this.galleryService.findById(photo.galleryId);
        if (!gallery.isSale) {
            const checkSubscribed = await this.subscriptionService.checkSubscribed(photo.performerId, user._id);
            if (!checkSubscribed) {
                throw new kernel_1.ForbiddenException();
            }
        }
        if (gallery.isSale) {
            const checkBought = await this.tokenTransactionService.checkBought(new dtos_2.GalleryDto(gallery), constants_3.PurchaseItemType.GALLERY, user);
            if (!checkBought) {
                throw new kernel_1.ForbiddenException();
            }
        }
        return true;
    }
};
PhotoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => gallery_service_1.GalleryService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.TokenTransactionService))),
    __param(4, (0, common_1.Inject)(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        gallery_service_1.GalleryService,
        subscription_service_1.SubscriptionService,
        services_3.TokenTransactionService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.FileService])
], PhotoService);
exports.PhotoService = PhotoService;
//# sourceMappingURL=photo.service.js.map