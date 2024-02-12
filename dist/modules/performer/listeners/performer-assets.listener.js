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
exports.PerformerAssetsListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer-assets/services");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../performer-assets/constants");
const constants_2 = require("../../../kernel/constants");
const constants_3 = require("../../feed/constants");
const mailer_1 = require("../../mailer");
const follow_service_1 = require("../../follow/services/follow.service");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const constants_4 = require("../../subscription/constants");
const lodash_1 = require("lodash");
const services_2 = require("../../user/services");
const providers_1 = require("../providers");
const HANDLE_PHOTO_COUNT_FOR_PERFORMER = 'HANDLE_PHOTO_COUNT_FOR_PERFORMER';
const HANDLE_VIDEO_COUNT_FOR_PERFORMER = 'HANDLE_VIDEO_COUNT_FOR_PERFORMER';
const HANDLE_PRODUCT_COUNT_FOR_PERFORMER = 'HANDLE_PRODUCT_COUNT_FOR_PERFORMER';
const HANDLE_FEED_COUNT_FOR_PERFORMER = 'HANDLE_FEED_COUNT_FOR_PERFORMER';
let PerformerAssetsListener = class PerformerAssetsListener {
    constructor(userService, subscriptionService, followService, performerModel, mailerService, queueEventService) {
        this.userService = userService;
        this.subscriptionService = subscriptionService;
        this.followService = followService;
        this.performerModel = performerModel;
        this.mailerService = mailerService;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe(services_1.PERFORMER_COUNT_VIDEO_CHANNEL, HANDLE_VIDEO_COUNT_FOR_PERFORMER, this.handleVideoCount.bind(this));
        this.queueEventService.subscribe(services_1.PERFORMER_PHOTO_CHANNEL, HANDLE_PHOTO_COUNT_FOR_PERFORMER, this.handlePhotoCount.bind(this));
        this.queueEventService.subscribe(services_1.PERFORMER_PRODUCT_CHANNEL, HANDLE_PRODUCT_COUNT_FOR_PERFORMER, this.handleProductCount.bind(this));
        this.queueEventService.subscribe(constants_3.PERFORMER_FEED_CHANNEL, HANDLE_FEED_COUNT_FOR_PERFORMER, this.handleFeedCount.bind(this));
    }
    async handlePhotoCount(event) {
        const { eventName } = event;
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED, constants_2.EVENT.UPDATED].includes(eventName)) {
            return;
        }
        const { performerId, status, oldStatus } = event.data;
        let increase = 0;
        switch (eventName) {
            case constants_2.EVENT.CREATED:
                if (status === constants_1.PHOTO_STATUS.ACTIVE)
                    increase = 1;
                break;
            case constants_2.EVENT.UPDATED:
                if (oldStatus !== constants_1.PHOTO_STATUS.ACTIVE
                    && status === constants_1.PHOTO_STATUS.ACTIVE)
                    increase = 1;
                if (oldStatus === constants_1.PHOTO_STATUS.ACTIVE
                    && status !== constants_1.PHOTO_STATUS.ACTIVE)
                    increase = -1;
                break;
            case constants_2.EVENT.DELETED:
                if (status === constants_1.PHOTO_STATUS.ACTIVE)
                    increase = -1;
                break;
            default:
                break;
        }
        if (increase) {
            await this.performerModel.updateOne({ _id: performerId }, {
                $inc: {
                    'stats.totalPhotos': increase
                }
            });
        }
    }
    async handleVideoCount(event) {
        const { eventName } = event;
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED, constants_2.EVENT.UPDATED].includes(eventName)) {
            return;
        }
        const { performerId, status, oldStatus, _id: videoId, user } = event.data;
        let increase = 0;
        switch (eventName) {
            case constants_2.EVENT.CREATED:
                if (status === constants_1.VIDEO_STATUS.ACTIVE)
                    increase = 1;
                break;
            case constants_2.EVENT.UPDATED:
                if (oldStatus !== constants_1.VIDEO_STATUS.ACTIVE
                    && status === constants_1.VIDEO_STATUS.ACTIVE)
                    increase = 1;
                if (oldStatus === constants_1.VIDEO_STATUS.ACTIVE
                    && status !== constants_1.VIDEO_STATUS.ACTIVE)
                    increase = -1;
                break;
            case constants_2.EVENT.DELETED:
                if (status === constants_1.VIDEO_STATUS.ACTIVE)
                    increase = -1;
                break;
            default:
                break;
        }
        if (increase) {
            await this.performerModel.updateOne({ _id: performerId }, {
                $inc: {
                    'stats.totalVideos': increase
                }
            });
        }
        if (increase === -1) {
            if (user === null || user === void 0 ? void 0 : user.roles.includes('admin')) {
                await this.handleDeleteMailer('video', videoId, performerId);
            }
        }
        if (increase === 1) {
            await this.handleNewMailer('video', videoId, performerId);
        }
    }
    async handleProductCount(event) {
        const { eventName } = event;
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED, constants_2.EVENT.UPDATED].includes(eventName)) {
            return;
        }
        const { performerId, status, oldStatus, count, _id: productId, user } = event.data;
        if (count) {
            await this.performerModel.updateOne({ _id: performerId }, {
                $inc: {
                    'stats.totalProducts': count
                }
            });
            return;
        }
        let increase = 0;
        switch (eventName) {
            case constants_2.EVENT.CREATED:
                if (status === constants_1.PRODUCT_STATUS.ACTIVE)
                    increase = 1;
                break;
            case constants_2.EVENT.UPDATED:
                if (oldStatus !== constants_1.PRODUCT_STATUS.ACTIVE
                    && status === constants_1.PRODUCT_STATUS.ACTIVE)
                    increase = 1;
                if (oldStatus === constants_1.PRODUCT_STATUS.ACTIVE
                    && status !== constants_1.PRODUCT_STATUS.ACTIVE)
                    increase = -1;
                break;
            case constants_2.EVENT.DELETED:
                if (status === constants_1.PRODUCT_STATUS.ACTIVE)
                    increase = -1;
                break;
            default:
                break;
        }
        if (increase) {
            await this.performerModel.updateOne({ _id: performerId }, {
                $inc: {
                    'stats.totalProducts': increase
                }
            });
        }
        if (increase === -1) {
            if (user === null || user === void 0 ? void 0 : user.roles.includes('admin')) {
                await this.handleDeleteMailer('product', productId, performerId);
            }
        }
        if (increase === 1) {
            await this.handleNewMailer('product', productId, performerId);
        }
    }
    async handleFeedCount(event) {
        const { eventName } = event;
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.UPDATED, constants_2.EVENT.DELETED].includes(eventName)) {
            return;
        }
        const { fromSourceId, count, status, oldStatus, _id: feedId, user } = event.data;
        if (count) {
            await this.performerModel.updateOne({ _id: fromSourceId }, {
                $inc: {
                    'stats.totalFeeds': count
                }
            });
            return;
        }
        let increase = 0;
        switch (eventName) {
            case constants_2.EVENT.CREATED:
                if (status === constants_1.PRODUCT_STATUS.ACTIVE)
                    increase = 1;
                break;
            case constants_2.EVENT.UPDATED:
                if (oldStatus !== constants_1.PRODUCT_STATUS.ACTIVE
                    && status === constants_1.PRODUCT_STATUS.ACTIVE)
                    increase = 1;
                if (oldStatus === constants_1.PRODUCT_STATUS.ACTIVE
                    && status !== constants_1.PRODUCT_STATUS.ACTIVE)
                    increase = -1;
                break;
            case constants_2.EVENT.DELETED:
                if (status === constants_1.PRODUCT_STATUS.ACTIVE)
                    increase = -1;
                break;
            default:
                break;
        }
        if (increase) {
            await this.performerModel.updateOne({ _id: fromSourceId }, {
                $inc: {
                    'stats.totalFeeds': increase
                }
            });
        }
        if (increase === -1) {
            if (user === null || user === void 0 ? void 0 : user.roles.includes('admin')) {
                await this.handleDeleteMailer('post', feedId, fromSourceId);
            }
        }
        if (increase === 1) {
            await this.handleNewMailer('post', feedId, fromSourceId);
        }
    }
    async handleDeleteMailer(contentType, description, performerId) {
        const performer = await this.performerModel.findById(performerId);
        performer && await this.mailerService.send({
            subject: 'Content was deleted',
            to: performer === null || performer === void 0 ? void 0 : performer.email,
            data: {
                contentType,
                description
            },
            template: 'performer-content-deleted'
        });
    }
    async handleNewMailer(contentType, contentId, performerId) {
        const performer = await this.performerModel.findById(performerId);
        const [subscriptions, follows] = await Promise.all([
            this.subscriptionService.findSubscriptionList({ performerId, status: constants_4.SUBSCRIPTION_STATUS.ACTIVE }),
            this.followService.find({ followingId: performerId })
        ]);
        const userIds = (0, lodash_1.flattenDeep)([
            subscriptions.map((s) => `${s.userId}`),
            follows.map((f) => `${f.followerId}`)
        ]);
        const users = await this.userService.findByIds(userIds);
        await users.reduce(async (cb, user) => {
            await this.mailerService.send({
                subject: 'New content',
                to: user === null || user === void 0 ? void 0 : user.email,
                data: {
                    link: `${process.env.USER_URL}/${contentType}/${contentId}`,
                    contentType,
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                    performerName: (performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username)
                },
                template: 'user-new-content'
            });
        }, Promise.resolve());
    }
};
PerformerAssetsListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => follow_service_1.FollowService))),
    __param(3, (0, common_1.Inject)(providers_1.PERFORMER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.UserService,
        subscription_service_1.SubscriptionService,
        follow_service_1.FollowService,
        mongoose_1.Model,
        mailer_1.MailerService,
        kernel_1.QueueEventService])
], PerformerAssetsListener);
exports.PerformerAssetsListener = PerformerAssetsListener;
//# sourceMappingURL=performer-assets.listener.js.map