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
exports.PerformerController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../auth/services");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const file_1 = require("../../file");
const services_2 = require("../../file/services");
const services_3 = require("../../utils/services");
const dtos_1 = require("../../user/dtos");
const contants_1 = require("../../storage/contants");
const constants_1 = require("../constants");
const dtos_2 = require("../dtos");
const payloads_1 = require("../payloads");
const services_4 = require("../services");
let PerformerController = class PerformerController {
    constructor(authService, countryService, fileService, performerService, performerSearchService) {
        this.authService = authService;
        this.countryService = countryService;
        this.fileService = fileService;
        this.performerService = performerService;
        this.performerSearchService = performerSearchService;
    }
    async me(req) {
        const user = await this.performerService.getDetails(req.user._id, req.jwToken);
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(user).toResponse(true, false));
    }
    async usearch(query, currentUser) {
        const data = await this.performerSearchService.search(query, currentUser);
        return kernel_1.DataResponse.ok(data);
    }
    async randomSearch(req, currentUser) {
        const data = await this.performerSearchService.randomSearch(req, currentUser);
        return kernel_1.DataResponse.ok(data);
    }
    async updateUser(payload, performerId, req) {
        await this.performerService.selfUpdate(performerId, payload);
        const performer = await this.performerService.getDetails(performerId, req.jwToken);
        if (payload.password) {
            await this.authService.createAuthPassword({
                source: 'performer',
                sourceId: performer._id,
                type: 'password',
                key: performer.email || performer.username,
                value: payload.password
            });
        }
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(performer).toResponse(true, false));
    }
    async getDetails(performerUsername, req, user) {
        let ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ipAddress = ipAddress.split(',')[0];
        let userCountry = null;
        let countryCode = req.headers['cf-ipcountry'] || null;
        if (!ipAddress.includes('127.0.0.1') && !countryCode) {
            userCountry = await this.countryService.findCountryByIP(ipAddress);
            if (userCountry && userCountry.status === 'success' && userCountry.countryCode) {
                countryCode = userCountry.countryCode;
            }
        }
        const performer = await this.performerService.findByUsername(performerUsername, countryCode, user);
        if (!performer || performer.status !== constants_1.PERFORMER_STATUSES.ACTIVE) {
            throw new common_1.HttpException('This account is suspended', 403);
        }
        return kernel_1.DataResponse.ok(performer.toPublicDetailsResponse());
    }
    async uploadPerformerDocument(currentUser, file, type, req) {
        await this.performerService.updateDocument(currentUser._id, file, type);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: `${file.getUrl(true)}?performerId=${currentUser._id}&token=${req.jwToken}` }));
    }
    async uploadPerformerAvatar(file, performer) {
        await this.performerService.updateAvatar(performer._id, file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async uploadPerformerCover(file, performer) {
        await this.performerService.updateCover(performer._id, file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async uploadPerformerVideo(file, performer) {
        await this.performerService.updateWelcomeVideo(performer._id, file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl(true) }));
    }
    async updateBankingSetting(performerId, payload, user) {
        const data = await this.performerService.updateBankingSetting(performerId, payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async updatePaymentGatewaySetting(payload, user) {
        payload.performerId = user._id;
        const data = await this.performerService.updatePaymentGateway(payload);
        return kernel_1.DataResponse.ok(data);
    }
    async checkAuth(req) {
        if (!req.query.token || !req.query.performerId)
            throw new kernel_1.ForbiddenException();
        const auth = await this.authService.verifySession(req.query.token);
        if (!auth)
            throw new kernel_1.ForbiddenException();
        const user = await this.authService.getSourceFromAuthSession({ source: auth.source, sourceId: auth.sourceId });
        if (!user) {
            throw new kernel_1.ForbiddenException();
        }
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        if (req.query.performerId === `${user._id}`)
            return true;
        throw new kernel_1.ForbiddenException();
    }
};
__decorate([
    (0, common_1.Get)('/me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('/user/search'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "usearch", null);
__decorate([
    (0, common_1.Get)('/search/random'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "randomSearch", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.SelfUpdatePayload, String, Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)('/:username'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)('/documents/upload/:type'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('performer-document', 'file', {
        destination: (0, kernel_1.getConfig)('file').documentDir,
        uploadImmediately: true,
        acl: contants_1.S3ObjectCannelACL.AuthenticatedRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, file_1.FileUploaded)()),
    __param(2, (0, common_1.Param)('type')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.PerformerDto,
        file_1.FileDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerDocument", null);
__decorate([
    (0, common_1.Post)('/avatar/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('avatar', 'avatar', {
        destination: (0, kernel_1.getConfig)('file').avatarDir,
        uploadImmediately: true,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerAvatar", null);
__decorate([
    (0, common_1.Post)('/cover/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('cover', 'cover', {
        destination: (0, kernel_1.getConfig)('file').coverDir,
        uploadImmediately: true,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerCover", null);
__decorate([
    (0, common_1.Post)('/welcome-video/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('performer-welcome-video', 'welcome-video', {
        destination: (0, kernel_1.getConfig)('file').videoDir,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_2.PerformerDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerVideo", null);
__decorate([
    (0, common_1.Put)('/:id/banking-settings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.BankingSettingPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updateBankingSetting", null);
__decorate([
    (0, common_1.Put)('/:id/payment-gateway-settings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PaymentGatewaySettingPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updatePaymentGatewaySetting", null);
__decorate([
    (0, common_1.Get)('/documents/auth/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "checkAuth", null);
PerformerController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('performers'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.CountryService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.FileService))),
    __metadata("design:paramtypes", [services_1.AuthService,
        services_3.CountryService,
        services_2.FileService,
        services_4.PerformerService,
        services_4.PerformerSearchService])
], PerformerController);
exports.PerformerController = PerformerController;
//# sourceMappingURL=performer.controller.js.map