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
exports.ScheduledStreamNofificationAgendaJob = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const mailer_1 = require("../../mailer");
const services_1 = require("../../user/services");
const follow_service_1 = require("../../follow/services/follow.service");
const services_2 = require("../../performer/services");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const lodash_1 = require("lodash");
const moment = require("moment");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let ScheduledStreamNofificationAgendaJob = class ScheduledStreamNofificationAgendaJob {
    constructor(subscriptionService, followService, performerService, userService, scheduledStreamNotificationModel, mailerService, agenda) {
        this.subscriptionService = subscriptionService;
        this.followService = followService;
        this.performerService = performerService;
        this.userService = userService;
        this.scheduledStreamNotificationModel = scheduledStreamNotificationModel;
        this.mailerService = mailerService;
        this.agenda = agenda;
        this.defineJobs();
    }
    async defineJobs() {
        const collection = this.agenda._collection;
        await collection.deleteMany({
            name: {
                $in: [
                    constants_1.SCHEDULED_STREAM_NOTIFICATION_AGENDA
                ]
            }
        });
        this.agenda.define(constants_1.SCHEDULED_STREAM_NOTIFICATION_AGENDA, {}, this.handleMailer.bind(this));
        this.agenda.schedule('10 seconds from now', constants_1.SCHEDULED_STREAM_NOTIFICATION_AGENDA, {});
    }
    async handleMailer(job, done) {
        job.remove();
        try {
            const notifications = await this.scheduledStreamNotificationModel.find({
                notified: false,
                scheduledAt: {
                    $gte: moment().startOf('day').toDate(),
                    $lte: moment().add(1, 'day').endOf('day').toDate()
                }
            });
            const performerIds = (0, lodash_1.uniq)(notifications.map((s) => `${s.performerId}`));
            if (!performerIds.length)
                return;
            const performers = await this.performerService.findByIds(performerIds);
            await notifications.reduce(async (lp, notification) => {
                await lp;
                const [subs, follows] = await Promise.all([
                    this.subscriptionService.findSubscriptionList({
                        performerId: notification.performerId
                    }),
                    this.followService.find({
                        followingId: notification.performerId
                    })
                ]);
                const suids = subs.map((s) => `${s.userId}`);
                const fuids = follows.map((s) => `${s.followerId}`);
                if (!suids.length && !fuids.length)
                    return Promise.resolve();
                const users = await this.userService.findByIds((0, lodash_1.uniq)([...suids, ...fuids]));
                const performer = performers.find((s) => `${s._id}` === `${notification.performerId}`);
                (performer === null || performer === void 0 ? void 0 : performer.email) && await this.mailerService.send({
                    subject: 'Scheduled stream notification',
                    to: performer.email,
                    data: {
                        performerName: (performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username) || `${performer === null || performer === void 0 ? void 0 : performer.firstName} ${performer === null || performer === void 0 ? void 0 : performer.lastName}`,
                        scheduledAt: `${moment(notification.scheduledAt).utc().format('lll')} UTC`
                    },
                    template: 'performer-scheduled-streaming-notification'
                });
                await users.reduce(async (cb, user) => {
                    await cb;
                    (user === null || user === void 0 ? void 0 : user.email) && await this.mailerService.send({
                        subject: 'Scheduled stream notification',
                        to: user.email,
                        data: {
                            performerName: (performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username) || `${performer === null || performer === void 0 ? void 0 : performer.firstName} ${performer === null || performer === void 0 ? void 0 : performer.lastName}`,
                            userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || `${(user === null || user === void 0 ? void 0 : user.firstName) || 'there'}`,
                            scheduledAt: `${moment(notification.scheduledAt).utc().format('lll')} UTC`,
                            link: `${process.env.USER_URL}/streaming/${(performer === null || performer === void 0 ? void 0 : performer.username) || (performer === null || performer === void 0 ? void 0 : performer._id)}`
                        },
                        template: 'scheduled-streaming-notification'
                    });
                }, Promise.resolve());
                notification.notified = true;
                notification.updatedAt = new Date();
                await notification.save();
                return Promise.resolve();
            }, Promise.resolve());
        }
        finally {
            this.agenda.schedule('1 minute from now', constants_1.SCHEDULED_STREAM_NOTIFICATION_AGENDA, {});
            typeof done === 'function' && done();
        }
    }
};
ScheduledStreamNofificationAgendaJob = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => follow_service_1.FollowService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __param(4, (0, common_1.Inject)(providers_1.SCHEDULED_STREAM_NOTIFICATION_PROVIDER)),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        follow_service_1.FollowService,
        services_2.PerformerService,
        services_1.UserService,
        mongoose_1.Model,
        mailer_1.MailerService,
        kernel_1.AgendaService])
], ScheduledStreamNofificationAgendaJob);
exports.ScheduledStreamNofificationAgendaJob = ScheduledStreamNofificationAgendaJob;
//# sourceMappingURL=notify-scheduled-stream.job.js.map