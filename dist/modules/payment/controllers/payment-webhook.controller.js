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
exports.PaymentWebhookController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../utils/decorators");
const utils_service_1 = require("../../utils/services/utils.service");
const webhooks_service_1 = require("../services/webhooks.service");
let PaymentWebhookController = class PaymentWebhookController {
    constructor(webhooksPaymentService) {
        this.webhooksPaymentService = webhooksPaymentService;
    }
    async ccbillCallhook(payload, req, ipAddress) {
        if (process.env.NODE_ENV === 'production' && !(0, utils_service_1.isValidCCBillIP)(ipAddress)) {
            throw new common_1.ForbiddenException('Invalid request IP!');
        }
        if (!['NewSaleSuccess', 'RenewalSuccess', 'UserReactivation'].includes(req.eventType)) {
            return kernel_1.DataResponse.ok(false);
        }
        let info;
        const data = Object.assign(Object.assign({}, payload), req);
        switch (req.eventType) {
            case 'UserReactivation':
                info = await this.webhooksPaymentService.ccbillUserReactivation(data);
                break;
            case 'RenewalSuccess':
                info = await this.webhooksPaymentService.ccbillRenewalSuccessWebhook(data);
                break;
            default:
                info = await this.webhooksPaymentService.ccbillSinglePaymentSuccessWebhook(data);
                break;
        }
        return kernel_1.DataResponse.ok(info);
    }
    async stripePaymentCallhook(payload) {
        const { type } = payload;
        if (!type.includes('payment_intent') && !type.includes('customer.subscription')) {
            return kernel_1.DataResponse.ok(false);
        }
        let info;
        if (type.includes('customer.subscription')) {
            info = await this.webhooksPaymentService.stripeSubscriptionWebhook(payload);
        }
        if (type.includes('payment_intent')) {
            info = await this.webhooksPaymentService.stripePaymentWebhook(payload);
        }
        return kernel_1.DataResponse.ok(info);
    }
};
__decorate([
    (0, common_1.Post)('/ccbill/callhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, decorators_1.IpAddress)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], PaymentWebhookController.prototype, "ccbillCallhook", null);
__decorate([
    (0, common_1.Post)('/stripe/callhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentWebhookController.prototype, "stripePaymentCallhook", null);
PaymentWebhookController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksPaymentService])
], PaymentWebhookController);
exports.PaymentWebhookController = PaymentWebhookController;
//# sourceMappingURL=payment-webhook.controller.js.map