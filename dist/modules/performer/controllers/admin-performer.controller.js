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
exports.AdminPerformerController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../../auth/services");
const dtos_1 = require("../../auth/dtos");
const file_1 = require("../../file");
const contants_1 = require("../../storage/contants");
const dtos_2 = require("../../user/dtos");
const payloads_1 = require("../payloads");
const services_2 = require("../services");
let AdminPerformerController = class AdminPerformerController {
    constructor(performerService, performerSearchService, authService) {
        this.performerService = performerService;
        this.performerSearchService = performerSearchService;
        this.authService = authService;
    }
    async search(req) {
        const data = await this.performerSearchService.adminSearch(req);
        return kernel_1.DataResponse.ok(data);
    }
    async create(payload) {
        const { password } = payload;
        delete payload.password;
        const performer = await this.performerService.create(payload);
        if (password) {
            await this.authService.createAuthPassword(new dtos_1.AuthCreateDto({
                source: 'performer',
                sourceId: performer._id,
                type: 'password',
                key: performer.email,
                value: password
            }));
        }
        return kernel_1.DataResponse.ok(performer);
    }
    async updateUser(payload, performerId, req) {
        await this.performerService.adminUpdate(performerId, payload);
        const performer = await this.performerService.getDetails(performerId, req.jwToken);
        return kernel_1.DataResponse.ok(performer);
    }
    async getDetails(performerId, req) {
        const performer = await this.performerService.getDetails(performerId, req.jwToken);
        const data = performer.toResponse(true, true);
        return kernel_1.DataResponse.ok(data);
    }
    async delete(performerId) {
        const data = await this.performerService.delete(performerId);
        return kernel_1.DataResponse.ok(data);
    }
    async uploadPerformerDocument(file, id, type) {
        await this.performerService.updateDocument(id, file, type);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: `${file.getUrl(true)}` }));
    }
    async uploadPerformerAvatar(file, performerId) {
        await this.performerService.updateAvatar(performerId, file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async uploadPerformerCover(file, performerId) {
        await this.performerService.updateCover(performerId, file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async uploadPerformerVideo(file, performerId) {
        await this.performerService.updateWelcomeVideo(performerId, file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl(true) }));
    }
    async updatePaymentGatewaySetting(payload) {
        const data = await this.performerService.updatePaymentGateway(payload);
        return kernel_1.DataResponse.ok(data);
    }
    async updateCommissionSetting(performerId, payload) {
        const data = await this.performerService.updateCommissionSetting(performerId, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async updateBankingSetting(performerId, payload, user) {
        const data = await this.performerService.updateBankingSetting(performerId, payload, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "search", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerUpdatePayload, String, Object]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)('/:id/view'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Delete)('/:id/delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('/documents/upload/:performerId/:type'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('performer-document', 'file', {
        destination: (0, kernel_1.getConfig)('file').documentDir,
        uploadImmediately: true,
        acl: contants_1.S3ObjectCannelACL.AuthenticatedRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __param(1, (0, common_1.Param)('performerId')),
    __param(2, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto, String, String]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "uploadPerformerDocument", null);
__decorate([
    (0, common_1.Post)('/:performerId/avatar/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('avatar', 'avatar', {
        destination: (0, kernel_1.getConfig)('file').avatarDir,
        uploadImmediately: true,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __param(1, (0, common_1.Param)('performerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto, String]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "uploadPerformerAvatar", null);
__decorate([
    (0, common_1.Post)('/:performerId/cover/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('cover', 'cover', {
        destination: (0, kernel_1.getConfig)('file').coverDir,
        uploadImmediately: true,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __param(1, (0, common_1.Param)('performerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto, String]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "uploadPerformerCover", null);
__decorate([
    (0, common_1.Post)('/:id/welcome-video/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('performer-welcome-video', 'welcome-video', {
        destination: (0, kernel_1.getConfig)('file').videoDir,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto, String]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "uploadPerformerVideo", null);
__decorate([
    (0, common_1.Put)('/:id/payment-gateway-settings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PaymentGatewaySettingPayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "updatePaymentGatewaySetting", null);
__decorate([
    (0, common_1.Put)('/:id/commission-settings'),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.CommissionSettingPayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "updateCommissionSetting", null);
__decorate([
    (0, common_1.Put)('/:id/banking-settings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.BankingSettingPayload,
        dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "updateBankingSetting", null);
AdminPerformerController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('admin/performers'),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_2.PerformerSearchService,
        services_1.AuthService])
], AdminPerformerController);
exports.AdminPerformerController = AdminPerformerController;
//# sourceMappingURL=admin-performer.controller.js.map