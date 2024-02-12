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
exports.ReactionAssetsListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../reaction/constants");
const constants_2 = require("../../../kernel/constants");
const mailer_1 = require("../../mailer");
const services_1 = require("../../performer/services");
const services_2 = require("../../user/services");
const services_3 = require("../services");
const video_service_1 = require("../services/video.service");
const REACTION_ASSETS_TOPIC = 'REACTION_ASSETS_TOPIC';
let ReactionAssetsListener = class ReactionAssetsListener {
    constructor(performerService, userService, queueEventService, videoService, galleryService, productService, mailerService) {
        this.performerService = performerService;
        this.userService = userService;
        this.queueEventService = queueEventService;
        this.videoService = videoService;
        this.galleryService = galleryService;
        this.productService = productService;
        this.mailerService = mailerService;
        this.queueEventService.subscribe(constants_1.REACTION_CHANNEL, REACTION_ASSETS_TOPIC, this.handleReaction.bind(this));
    }
    async handleReaction(event) {
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const { objectId, objectType, action, createdBy } = event.data;
        if (objectType === constants_1.REACTION_TYPE.VIDEO) {
            switch (action) {
                case constants_1.REACTION.LIKE:
                    const [user, video] = await Promise.all([
                        this.userService.findById(createdBy),
                        this.videoService.findById(objectId)
                    ]);
                    await this.videoService.increaseLike(objectId, event.eventName === constants_2.EVENT.CREATED ? 1 : -1);
                    const performer = video && await this.performerService.findById(video.performerId);
                    (performer === null || performer === void 0 ? void 0 : performer.email) && await this.mailerService.send({
                        subject: 'Like content',
                        to: performer === null || performer === void 0 ? void 0 : performer.email,
                        data: {
                            contentType: 'video',
                            userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username)
                        },
                        template: 'performer-like-content'
                    });
                    break;
                case constants_1.REACTION.BOOKMARK:
                    await this.videoService.increaseFavourite(objectId, event.eventName === constants_2.EVENT.CREATED ? 1 : -1);
                    break;
                default: break;
            }
        }
        if (objectType === constants_1.REACTION_TYPE.GALLERY) {
            switch (action) {
                case constants_1.REACTION.LIKE:
                    await this.galleryService.updateLikeStats(objectId, event.eventName === constants_2.EVENT.CREATED ? 1 : -1);
                    break;
                case constants_1.REACTION.BOOKMARK:
                    await this.galleryService.updateBookmarkStats(objectId, event.eventName === constants_2.EVENT.CREATED ? 1 : -1);
                    break;
                default: break;
            }
        }
        if (objectType === constants_1.REACTION_TYPE.PRODUCT) {
            switch (action) {
                case constants_1.REACTION.LIKE:
                    await this.productService.updateLikeStats(objectId, event.eventName === constants_2.EVENT.CREATED ? 1 : -1);
                    break;
                case constants_1.REACTION.BOOKMARK:
                    await this.productService.updateBookmarkStats(objectId, event.eventName === constants_2.EVENT.CREATED ? 1 : -1);
                    break;
                default: break;
            }
        }
    }
};
ReactionAssetsListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __metadata("design:paramtypes", [services_1.PerformerService,
        services_2.UserService,
        kernel_1.QueueEventService,
        video_service_1.VideoService,
        services_3.GalleryService,
        services_3.ProductService,
        mailer_1.MailerService])
], ReactionAssetsListener);
exports.ReactionAssetsListener = ReactionAssetsListener;
//# sourceMappingURL=reaction.listener.js.map