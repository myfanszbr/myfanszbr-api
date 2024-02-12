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
exports.AdminPasswordController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../services");
const guards_1 = require("../guards");
const decorators_1 = require("../decorators");
const payloads_1 = require("../payloads");
let AdminPasswordController = class AdminPasswordController {
    constructor(authService) {
        this.authService = authService;
    }
    async updateUserPassword(payload) {
        await this.authService.updateAuthPassword({
            source: payload.source || 'user',
            sourceId: payload.userId,
            value: payload.password
        });
        return kernel_1.DataResponse.ok(true);
    }
};
__decorate([
    (0, common_1.Put)('users/password'),
    (0, decorators_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PasswordUserChangePayload]),
    __metadata("design:returntype", Promise)
], AdminPasswordController.prototype, "updateUserPassword", null);
AdminPasswordController = __decorate([
    (0, common_1.Controller)('admin/auth'),
    __metadata("design:paramtypes", [services_1.AuthService])
], AdminPasswordController);
exports.AdminPasswordController = AdminPasswordController;
//# sourceMappingURL=admin-password.controller.js.map