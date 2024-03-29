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
exports.UpdatePayoutRequestListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const mailer_1 = require("../../mailer");
const constants_1 = require("../constants");
const PAYOUT_REQUEST_UPDATE = 'PAYOUT_REQUEST_UPDATE';
let UpdatePayoutRequestListener = class UpdatePayoutRequestListener {
    constructor(queueEventService, mailService, performerService) {
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.performerService = performerService;
        this.queueEventService.subscribe(constants_1.PAYOUT_REQUEST_CHANEL, PAYOUT_REQUEST_UPDATE, this.handler.bind(this));
    }
    async handler(event) {
        const request = event.data.request;
        const { source } = request;
        if (event.eventName === constants_1.PAYOUT_REQUEST_EVENT.UPDATED) {
            if (source === constants_1.SOURCE_TYPE.PERFORMER) {
                await this.handlePerformer(request, event.data.oldStatus);
            }
        }
    }
    async handlePerformer(request, oldStatus) {
        const { status, sourceId, requestTokens } = request;
        const sourceInfo = await this.performerService.findById(sourceId);
        if (!sourceInfo) {
            return;
        }
        if (status === constants_1.STATUSES.DONE && oldStatus === constants_1.STATUSES.PENDING) {
            await this.performerService.updatePerformerBalance(sourceId, -requestTokens);
        }
        if (sourceInfo.email) {
            await this.mailService.send({
                subject: 'Update payout request',
                to: sourceInfo.email,
                data: { request },
                template: 'payout-request-status'
            });
        }
    }
};
UpdatePayoutRequestListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => kernel_1.QueueEventService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => mailer_1.MailerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mailer_1.MailerService,
        services_1.PerformerService])
], UpdatePayoutRequestListener);
exports.UpdatePayoutRequestListener = UpdatePayoutRequestListener;
//# sourceMappingURL=update.listener.js.map