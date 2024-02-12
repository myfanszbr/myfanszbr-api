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
exports.PaymentTransactionController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../performer/dtos");
const services_1 = require("../services");
const payment_search_payload_1 = require("../payloads/payment-search.payload");
let PaymentTransactionController = class PaymentTransactionController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async userTranasctions(req, user) {
        const data = await this.paymentService.getUserTransactions(req, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Get)('/user/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_search_payload_1.PaymentSearchPayload,
        dtos_1.PerformerDto]),
    __metadata("design:returntype", Promise)
], PaymentTransactionController.prototype, "userTranasctions", null);
PaymentTransactionController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('payment/transactions'),
    __metadata("design:paramtypes", [services_1.PaymentSearchService])
], PaymentTransactionController);
exports.PaymentTransactionController = PaymentTransactionController;
//# sourceMappingURL=payment-transactions.controller.js.map