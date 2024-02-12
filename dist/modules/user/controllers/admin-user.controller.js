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
exports.AdminUserController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../auth/services");
const payloads_1 = require("../payloads");
const dtos_1 = require("../dtos");
const services_2 = require("../services");
let AdminUserController = class AdminUserController {
    constructor(authService, userService, userSearchService) {
        this.authService = authService;
        this.userService = userService;
        this.userSearchService = userSearchService;
    }
    async search(req) {
        return kernel_1.DataResponse.ok(await this.userSearchService.search(req));
    }
    async createUser(payload) {
        const user = await this.userService.create(payload);
        if (payload.password) {
            await this.authService.createAuthPassword({
                type: 'password',
                value: payload.password,
                source: 'user',
                key: user.email || user.username,
                sourceId: user._id
            });
        }
        return kernel_1.DataResponse.ok(new dtos_1.UserDto(user).toResponse(true));
    }
    async updateUser(payload, userId) {
        const data = await this.userService.adminUpdate(userId, payload);
        return kernel_1.DataResponse.ok(new dtos_1.UserDto(data).toResponse(true));
    }
    async getDetails(id) {
        const user = await this.userService.findById(id);
        return kernel_1.DataResponse.ok(new dtos_1.UserDto(user).toResponse(true));
    }
    async delete(id) {
        const data = await this.userService.delete(id);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Get)('/search'),
    (0, decorators_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, decorators_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, decorators_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.AdminUpdatePayload, String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)('/:id/view'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Delete)('/:id/delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "delete", null);
AdminUserController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('admin/users'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __metadata("design:paramtypes", [services_1.AuthService,
        services_2.UserService,
        services_2.UserSearchService])
], AdminUserController);
exports.AdminUserController = AdminUserController;
//# sourceMappingURL=admin-user.controller.js.map