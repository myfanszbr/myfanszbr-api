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
exports.PaymentTokenController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const dtos_1 = require("../../performer/dtos");
const dtos_2 = require("../../user/dtos");
const payloads_1 = require("../payloads");
const services_1 = require("../services");
let PaymentTokenController = class PaymentTokenController {
    constructor(tokenTransactionService, tokenTransactionSearchService) {
        this.tokenTransactionService = tokenTransactionService;
        this.tokenTransactionSearchService = tokenTransactionSearchService;
    }
    async purchaseProduct(user, productId, payload) {
        const info = await this.tokenTransactionService.purchaseProduct(productId, user, payload);
        return kernel_1.DataResponse.ok(info);
    }
    async purchaseVideo(user, videoId) {
        const info = await this.tokenTransactionService.purchaseVideo(videoId, user);
        return kernel_1.DataResponse.ok(info);
    }
    async buyPhoto(user, galleryId) {
        const info = await this.tokenTransactionService.purchaseGallery(galleryId, user);
        return kernel_1.DataResponse.ok(info);
    }
    async purchasePostFeed(user, id) {
        const info = await this.tokenTransactionService.purchasePostFeed(id, user);
        return kernel_1.DataResponse.ok(info);
    }
    async tip(user, performerId, payload) {
        const info = await this.tokenTransactionService.sendTips(user, performerId, payload);
        return kernel_1.DataResponse.ok(info);
    }
    async purchaseStream(user, streamId) {
        const info = await this.tokenTransactionService.purchaseStream(streamId, user);
        return kernel_1.DataResponse.ok(info);
    }
    async userTranasctions(req, user) {
        const data = await this.tokenTransactionSearchService.getUserTransactionsToken(req, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Post)('/product/:productId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto, String, payloads_1.PurchaseProductsPayload]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "purchaseProduct", null);
__decorate([
    (0, common_1.Post)('/video/:videoId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto, String]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "purchaseVideo", null);
__decorate([
    (0, common_1.Post)('/gallery/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto, String]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "buyPhoto", null);
__decorate([
    (0, common_1.Post)('/feed/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto, String]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "purchasePostFeed", null);
__decorate([
    (0, common_1.Post)('/tip/:performerId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('performerId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.UserDto, String, payloads_1.SendTipsPayload]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "tip", null);
__decorate([
    (0, common_1.Post)('/stream/:streamId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('streamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.UserDto, String]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "purchaseStream", null);
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PaymentTokenSearchPayload,
        dtos_1.PerformerDto]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "userTranasctions", null);
PaymentTokenController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('wallet/charges'),
    __metadata("design:paramtypes", [services_1.TokenTransactionService,
        services_1.TokenTransactionSearchService])
], PaymentTokenController);
exports.PaymentTokenController = PaymentTokenController;
//# sourceMappingURL=token-transaction.controller.js.map