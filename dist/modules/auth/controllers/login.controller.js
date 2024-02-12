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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const constants_1 = require("../../user/constants");
const services_2 = require("../../performer/services");
const constants_2 = require("../../settings/constants");
const payloads_1 = require("../payloads");
const services_3 = require("../services");
const exceptions_1 = require("../exceptions");
let LoginController = class LoginController {
    constructor(performerService, userService, authService) {
        this.performerService = performerService;
        this.userService = userService;
        this.authService = authService;
    }
    async login(req) {
        const query = {
            $or: [{
                    email: req.username.toLowerCase()
                }, {
                    username: req.username.toLowerCase()
                }]
        };
        let user = await this.userService.findOne(query);
        let source = 'user';
        if (!user) {
            user = await this.performerService.findOne(query);
            source = 'performer';
        }
        if (!user) {
            throw new common_1.HttpException('This account is not found. Please sign up', 404);
        }
        const authPassword = await this.authService.findBySource({
            sourceId: user._id
        });
        if (!authPassword) {
            throw new common_1.HttpException('This account is not found. Please sign up', 404);
        }
        const requireEmailVerification = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.REQUIRE_EMAIL_VERIFICATION);
        if (requireEmailVerification && !user.verifiedEmail) {
            throw new exceptions_1.EmailNotVerifiedException();
        }
        if (user.status === constants_1.STATUS_INACTIVE) {
            throw new exceptions_1.AccountInactiveException();
        }
        if (!this.authService.verifyPassword(req.password, authPassword)) {
            throw new exceptions_1.PasswordIncorrectException();
        }
        const expiresIn = req.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1;
        const token = await this.authService.updateAuthSession(source, user._id, expiresIn);
        return kernel_1.DataResponse.ok({ token });
    }
    async twitterLogin(payload) {
        const resp = await this.authService.loginTwitter(payload.callbackUrl);
        return kernel_1.DataResponse.ok(resp);
    }
    async googleLogin(payload) {
        const resp = await this.authService.verifyLoginGoogle(payload);
        return kernel_1.DataResponse.ok(resp);
    }
    async twitterCallback(payload) {
        const resp = await this.authService.twitterLoginCallback(payload);
        return kernel_1.DataResponse.ok(resp);
    }
};
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.LoginByUsernamePayload]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('twitter/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.AuthTwitterPayload]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "twitterLogin", null);
__decorate([
    (0, common_1.Post)('google/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.AuthGooglePayload]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Post)('twitter/callback'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "twitterCallback", null);
LoginController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_1.UserService,
        services_3.AuthService])
], LoginController);
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map