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
exports.ReactionFeedListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../reaction/constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../performer/services");
const mongoose_1 = require("mongoose");
const mailer_1 = require("../../mailer");
const services_2 = require("../../user/services");
const providers_1 = require("../providers");
const REACTION_FEED_CHANNEL = 'REACTION_FEED_CHANNEL';
let ReactionFeedListener = class ReactionFeedListener {
    constructor(userService, performerService, queueEventService, feedModel, mailerService) {
        this.userService = userService;
        this.performerService = performerService;
        this.queueEventService = queueEventService;
        this.feedModel = feedModel;
        this.mailerService = mailerService;
        this.queueEventService.subscribe(constants_1.REACTION_CHANNEL, REACTION_FEED_CHANNEL, this.handleReactFeed.bind(this));
    }
    async handleReactFeed(event) {
        if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const { objectId, objectType, action, createdBy } = event.data;
        if (![constants_1.REACTION_TYPE.FEED].includes(objectType) || action !== constants_1.REACTION.LIKE) {
            return;
        }
        if (constants_1.REACTION.LIKE && event.eventName === constants_2.EVENT.CREATED) {
            const feed = await this.feedModel.findById(objectId);
            if (feed) {
                await this.feedModel.updateOne({ _id: objectId }, { $inc: { totalLike: 1 } });
                await this.performerService.updateLikeStat(feed.fromSourceId, 1);
                const [performer, user] = await Promise.all([
                    this.performerService.findById(feed.fromSourceId),
                    this.userService.findById(createdBy)
                ]);
                (performer === null || performer === void 0 ? void 0 : performer.email) && await this.mailerService.send({
                    subject: 'Like content',
                    to: performer === null || performer === void 0 ? void 0 : performer.email,
                    data: {
                        contentType: 'post',
                        userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username)
                    },
                    template: 'performer-like-content'
                });
            }
        }
        if (constants_1.REACTION.LIKE && event.eventName === constants_2.EVENT.DELETED) {
            const feed = await this.feedModel.findById(objectId);
            if (feed) {
                await this.feedModel.updateOne({ _id: objectId }, { $inc: { totalLike: -1 } });
                await this.performerService.updateLikeStat(feed.fromSourceId, -1);
            }
        }
    }
};
ReactionFeedListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(3, (0, common_1.Inject)(providers_1.FEED_PROVIDER)),
    __metadata("design:paramtypes", [services_2.UserService,
        services_1.PerformerService,
        kernel_1.QueueEventService,
        mongoose_1.Model,
        mailer_1.MailerService])
], ReactionFeedListener);
exports.ReactionFeedListener = ReactionFeedListener;
//# sourceMappingURL=reaction-feed.listener.js.map