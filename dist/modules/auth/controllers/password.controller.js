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
exports.PasswordController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const dtos_1 = require("../../user/dtos");
const kernel_1 = require("../../../kernel");
const moment = require("moment");
const services_3 = require("../services");
const guards_1 = require("../guards");
const decorators_1 = require("../decorators");
const payloads_1 = require("../payloads");
const exceptions_1 = require("../exceptions");
let PasswordController = class PasswordController {
    constructor(userService, performerService, authService) {
        this.userService = userService;
        this.performerService = performerService;
        this.authService = authService;
    }
    async updatePassword(user, payload) {
        await this.authService.updateAuthPassword({
            source: payload.source || 'user',
            sourceId: user._id,
            value: payload.password
        });
        return kernel_1.DataResponse.ok(true);
    }
    async forgotPassword(req) {
        let user = await this.userService.findByEmail(req.email.toLowerCase());
        if (!user) {
            user = await this.performerService.findByEmail(req.email.toLowerCase());
        }
        if (!user) {
            throw new common_1.HttpException('Sorry, we couldn\'t find your account. Please recheck the email entered', 404);
        }
        const authPassword = await this.authService.findBySource({
            sourceId: user._id
        });
        if (!authPassword) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        await this.authService.forgot(authPassword, {
            _id: user._id,
            email: user.email
        });
        return kernel_1.DataResponse.ok({
            success: true
        });
    }
    async renderUpdatePassword(res, token) {
        if (!token) {
            return res.render('404.html');
        }
        const forgot = await this.authService.getForgot(token);
        if (!forgot) {
            return res.render('404.html');
        }
        if (moment(forgot.createdAt).isAfter(moment().add(1, 'day'))) {
            await this.authService.removeForgot(forgot._id);
            return res.render('404.html');
        }
        return res.render('password-change.html');
    }
    async updatePasswordForm(res, token, password) {
        if (!token || !password || password.length < 6) {
            return res.render('404.html');
        }
        const forgot = await this.authService.getForgot(token);
        if (!forgot) {
            return res.render('404.html');
        }
        await this.authService.updateAuthPassword({
            source: forgot.source,
            sourceId: forgot.sourceId,
            value: password
        });
        await this.authService.removeForgot(forgot._id);
        return res.render('password-change.html', {
            done: true
        });
    }
};
__decorate([
    (0, common_1.Put)('users/me/password'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.PasswordChangePayload]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('users/forgot'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ForgotPayload]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Get)('password-change'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "renderUpdatePassword", null);
__decorate([
    (0, common_1.Post)('password-change'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('token')),
    __param(2, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "updatePasswordForm", null);
PasswordController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __metadata("design:paramtypes", [services_1.UserService,
        services_2.PerformerService,
        services_3.AuthService])
], PasswordController);
exports.PasswordController = PasswordController;
//# sourceMappingURL=password.controller.js.map