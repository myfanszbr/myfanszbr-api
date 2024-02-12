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
exports.CancelSubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../user/dtos");
const payment_service_1 = require("../services/payment.service");
let CancelSubscriptionController = class CancelSubscriptionController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async ccbillCancel(subscriptionId, user) {
        const data = await this.paymentService.ccbillCancelSubscription(subscriptionId, user);
        return kernel_1.DataResponse.ok(data);
    }
    async stripeCancel(subscriptionId, user) {
        const data = await this.paymentService.stripeCancelSubscription(subscriptionId, user);
        return kernel_1.DataResponse.ok(data);
    }
    async systemCancel(subscriptionId, user) {
        const data = await this.paymentService.systemCancelSubscription(subscriptionId, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Post)('/ccbill/cancel-subscription/:subscriptionId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('subscriptionId')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], CancelSubscriptionController.prototype, "ccbillCancel", null);
__decorate([
    (0, common_1.Post)('/stripe/cancel-subscription/:subscriptionId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('subscriptionId')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], CancelSubscriptionController.prototype, "stripeCancel", null);
__decorate([
    (0, common_1.Post)('/system/cancel-subscription/:subscriptionId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('subscriptionId')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], CancelSubscriptionController.prototype, "systemCancel", null);
CancelSubscriptionController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], CancelSubscriptionController);
exports.CancelSubscriptionController = CancelSubscriptionController;
//# sourceMappingURL=cancel-subscription.controller.js.map