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
exports.RegisterController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const services_3 = require("../../file/services");
const file_1 = require("../../file");
const kernel_1 = require("../../../kernel");
const contants_1 = require("../../storage/contants");
const payloads_1 = require("../../user/payloads");
const payloads_2 = require("../../performer/payloads");
const payloads_3 = require("../payloads");
const services_4 = require("../services");
let RegisterController = class RegisterController {
    constructor(performerService, fileService, userService, authService) {
        this.performerService = performerService;
        this.fileService = fileService;
        this.userService = userService;
        this.authService = authService;
    }
    async userRegister(payload) {
        const user = await this.userService.register(payload);
        await this.authService.createAuthPassword({
            source: 'user',
            sourceId: user._id,
            type: 'password',
            value: payload.password,
            key: user.email
        });
        user.email && await this.authService.sendVerificationEmail(user);
        return kernel_1.DataResponse.ok({
            message: 'Please check your inbox and verify your email address'
        });
    }
    async performerRegister(payload, files) {
        var _a, _b;
        try {
            if (!files.idVerification || !files.documentVerification) {
                throw new common_1.HttpException('Missing ID documents!', 404);
            }
            const performer = await this.performerService.register(Object.assign(Object.assign({}, payload), { idVerificationId: (_a = files === null || files === void 0 ? void 0 : files.idVerification) === null || _a === void 0 ? void 0 : _a._id, documentVerificationId: (_b = files === null || files === void 0 ? void 0 : files.documentVerification) === null || _b === void 0 ? void 0 : _b._id }));
            await this.authService.createAuthPassword({
                source: 'performer',
                sourceId: performer._id,
                type: 'password',
                key: performer.email,
                value: payload.password
            });
            performer.email && await this.authService.sendVerificationEmail(performer);
            return kernel_1.DataResponse.ok({ message: `Your application will be processed withing 24 to 48 hours, most times sooner. You will get an email notification sent to ${performer.email || 'your email address'} with the status update.` });
        }
        catch (e) {
            files.idVerification
                && (await this.fileService.remove(files.idVerification._id));
            files.documentVerification
                && (await this.fileService.remove(files.documentVerification._id));
            throw e;
        }
    }
    async emailVerify(payload) {
        await this.authService.sendVerificationEmail(payload.source);
        return kernel_1.DataResponse.ok({
            message: 'We have sent you a verification email please check your email account you registered with'
        });
    }
    async verifyEmail(res, token) {
        if (!token) {
            return res.render('404.html');
        }
        await this.authService.verifyEmail(token);
        if (process.env.EMAIL_VERIFIED_SUCCESS_URL) {
            return res.redirect(process.env.EMAIL_VERIFIED_SUCCESS_URL);
        }
        return res.redirect(`${process.env.USER_URL}`);
    }
};
__decorate([
    (0, common_1.Post)('users/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserRegisterPayload]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "userRegister", null);
__decorate([
    (0, common_1.Post)('performers/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, file_1.MultiFileUploadInterceptor)([
        {
            type: 'performer-document',
            fieldName: 'idVerification',
            options: {
                destination: (0, kernel_1.getConfig)('file').documentDir,
                uploadImmediately: true,
                acl: contants_1.S3ObjectCannelACL.AuthenticatedRead,
                server: contants_1.Storage.S3
            }
        },
        {
            type: 'performer-document',
            fieldName: 'documentVerification',
            options: {
                destination: (0, kernel_1.getConfig)('file').documentDir,
                uploadImmediately: true,
                acl: contants_1.S3ObjectCannelACL.AuthenticatedRead,
                server: contants_1.Storage.S3
            }
        }
    ])),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, file_1.FilesUploaded)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_2.PerformerRegisterPayload, Object]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "performerRegister", null);
__decorate([
    (0, common_1.Post)('email-verification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_3.EmailVerificationPayload]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "emailVerify", null);
__decorate([
    (0, common_1.Get)('email-verification'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "verifyEmail", null);
RegisterController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.FileService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_3.FileService,
        services_1.UserService,
        services_4.AuthService])
], RegisterController);
exports.RegisterController = RegisterController;
//# sourceMappingURL=register.controller.js.map