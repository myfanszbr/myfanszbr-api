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
exports.PollFeedListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../kernel/constants");
const services_1 = require("../../performer/services");
const services_2 = require("../../user/services");
const mailer_1 = require("../../mailer");
const constants_2 = require("../constants");
const providers_1 = require("../providers");
const services_3 = require("../services");
const POLL_FEED_TOPIC = 'POLL_FEED_TOPIC';
const VOTE_POLL_TOPIC = 'VOTE_POLL_TOPIC';
let PollFeedListener = class PollFeedListener {
    constructor(feedService, performerService, userService, queueEventService, mailerService, pollModel) {
        this.feedService = feedService;
        this.performerService = performerService;
        this.userService = userService;
        this.queueEventService = queueEventService;
        this.mailerService = mailerService;
        this.pollModel = pollModel;
        this.queueEventService.subscribe(constants_2.PERFORMER_FEED_CHANNEL, POLL_FEED_TOPIC, this.handleRefPoll.bind(this));
        this.queueEventService.subscribe(constants_2.VOTE_FEED_CHANNEL, VOTE_POLL_TOPIC, this.handleVotePoll.bind(this));
    }
    async handleRefPoll(event) {
        if (![constants_1.EVENT.CREATED].includes(event.eventName)) {
            return;
        }
        const { pollIds, _id: feedId } = event.data;
        if (!pollIds || !pollIds.length)
            return;
        if (event.eventName === constants_1.EVENT.CREATED) {
            await this.pollModel.updateMany({ _id: { $in: pollIds } }, { refId: feedId, fromRef: constants_2.POLL_TARGET_SOURCE.FEED });
        }
    }
    async handleVotePoll(event) {
        if (![constants_1.EVENT.CREATED, constants_1.EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const { targetId, refId, fromSourceId } = event.data;
        if (event.eventName === constants_1.EVENT.CREATED) {
            await this.pollModel.updateOne({ _id: targetId }, { $inc: { totalVote: 1 } });
            const [feed, user] = await Promise.all([
                this.feedService.findById(refId),
                this.userService.findById(fromSourceId)
            ]);
            const performer = feed && await this.performerService.findById(feed.fromSourceId);
            (performer === null || performer === void 0 ? void 0 : performer.email) && await this.mailerService.send({
                subject: 'Voted a poll',
                to: performer === null || performer === void 0 ? void 0 : performer.email,
                data: {
                    link: `${process.env.USER_URL}/post/${feed.slug || feed._id}`,
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username)
                },
                template: 'performer-voted-poll'
            });
        }
    }
};
PollFeedListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.FeedService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(5, (0, common_1.Inject)(providers_1.POLL_PROVIDER)),
    __metadata("design:paramtypes", [services_3.FeedService,
        services_1.PerformerService,
        services_2.UserService,
        kernel_1.QueueEventService,
        mailer_1.MailerService,
        mongoose_1.Model])
], PollFeedListener);
exports.PollFeedListener = PollFeedListener;
//# sourceMappingURL=poll-ref.listeners.js.map