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
exports.DeletePerformerFeedListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../../performer/constants");
const providers_1 = require("../providers");
const constants_3 = require("../constants");
const DELETE_PERFORMER_FEED_TOPIC = 'DELETE_PERFORMER_FEED_TOPIC';
let DeletePerformerFeedListener = class DeletePerformerFeedListener {
    constructor(queueEventService, feedModel) {
        this.queueEventService = queueEventService;
        this.feedModel = feedModel;
        this.queueEventService.subscribe(constants_2.DELETE_PERFORMER_CHANNEL, DELETE_PERFORMER_FEED_TOPIC, this.handleDeleteData.bind(this));
    }
    async handleDeleteData(event) {
        if (event.eventName !== constants_1.EVENT.DELETED)
            return;
        const user = event.data;
        const count = await this.feedModel.countDocuments({
            fromSourceId: user._id,
            status: constants_1.STATUS.ACTIVE
        });
        count && await this.feedModel.updateMany({
            fromSourceId: user._id
        }, { status: constants_1.STATUS.INACTIVE });
        count && await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.PERFORMER_FEED_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: { fromSourceId: user._id, count: -count }
        }));
    }
};
DeletePerformerFeedListener = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(providers_1.FEED_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mongoose_1.Model])
], DeletePerformerFeedListener);
exports.DeletePerformerFeedListener = DeletePerformerFeedListener;
//# sourceMappingURL=performer-delete.listener.js.map