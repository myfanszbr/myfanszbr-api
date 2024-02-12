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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../../auth/services");
const dtos_1 = require("../../user/dtos");
const services_2 = require("../services");
const payloads_1 = require("../payloads");
let OrderController = class OrderController {
    constructor(orderService, authService) {
        this.orderService = orderService;
        this.authService = authService;
    }
    async orders(req, user) {
        const data = await this.orderService.search(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async userOrders(req, user) {
        const data = await this.orderService.userSearch(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async findOne(id, payload) {
        const data = await this.orderService.update(id, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async update(id) {
        const data = await this.orderService.findOne(id);
        return kernel_1.DataResponse.ok(data);
    }
    async updateShippingAddress(id, payload, user) {
        const data = await this.orderService.updateDeliveryAddress(id, payload, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin', 'performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.OrderSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "orders", null);
__decorate([
    (0, common_1.Get)('/users/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.OrderSearchPayload, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "userOrders", null);
__decorate([
    (0, common_1.Put)('/:id/update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.OrderUpdatePayload]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('/:id/update/delivery-address'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateShippingAddress", null);
OrderController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [services_2.OrderService,
        services_1.AuthService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map