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
exports.ScheduledFeedAgendaJob = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const dtos_1 = require("../dtos");
const constants_2 = require("../constants");
const providers_1 = require("../providers");
let ScheduledFeedAgendaJob = class ScheduledFeedAgendaJob {
    constructor(feedModel, queueEventService, agenda) {
        this.feedModel = feedModel;
        this.queueEventService = queueEventService;
        this.agenda = agenda;
        this.defineJobs();
    }
    async defineJobs() {
        const collection = this.agenda._collection;
        await collection.deleteMany({
            name: {
                $in: [
                    constants_2.SCHEDULE_FEED_AGENDA
                ]
            }
        });
        this.agenda.define(constants_2.SCHEDULE_FEED_AGENDA, {}, this.scheduleFeed.bind(this));
        this.agenda.schedule('10 seconds from now', constants_2.SCHEDULE_FEED_AGENDA, {});
    }
    async scheduleFeed(job, done) {
        job.remove();
        try {
            const feeds = await this.feedModel.find({
                isSchedule: true,
                scheduleAt: { $lte: new Date() }
            }).lean();
            await feeds.reduce(async (lp, feed) => {
                await lp;
                const v = new dtos_1.FeedDto(feed);
                await this.feedModel.updateOne({
                    _id: v._id
                }, {
                    isSchedule: false,
                    status: constants_1.STATUS.ACTIVE,
                    updatedAt: new Date()
                });
                const oldStatus = feed.status;
                return this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: constants_2.PERFORMER_FEED_CHANNEL,
                    eventName: constants_1.EVENT.UPDATED,
                    data: Object.assign(Object.assign({}, v), { status: constants_1.STATUS.ACTIVE, oldStatus })
                }));
            }, Promise.resolve());
        }
        finally {
            this.agenda.schedule('1 hour from now', constants_2.SCHEDULE_FEED_AGENDA, {});
            typeof done === 'function' && done();
        }
    }
};
ScheduledFeedAgendaJob = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(providers_1.FEED_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService,
        kernel_1.AgendaService])
], ScheduledFeedAgendaJob);
exports.ScheduledFeedAgendaJob = ScheduledFeedAgendaJob;
//# sourceMappingURL=scheduled-feed.job.js.map