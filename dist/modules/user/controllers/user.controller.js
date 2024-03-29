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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../auth/services");
const services_2 = require("../services");
const dtos_1 = require("../dtos");
const payloads_1 = require("../payloads");
let UserController = class UserController {
    constructor(authService, userService, userSearchService) {
        this.authService = authService;
        this.userService = userService;
        this.userSearchService = userSearchService;
    }
    async me(req) {
        const { authUser, jwToken } = req;
        const user = await this.userService.getMe(authUser.sourceId, jwToken);
        return kernel_1.DataResponse.ok(user);
    }
    async updateMe(currentUser, payload) {
        const user = await this.userService.update(currentUser._id, payload, currentUser);
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
    async search(req) {
        return kernel_1.DataResponse.ok(await this.userSearchService.performerSearch(req));
    }
};
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.UserUpdatePayload]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('/search'),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "search", null);
UserController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [services_1.AuthService,
        services_2.UserService,
        services_2.UserSearchService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map