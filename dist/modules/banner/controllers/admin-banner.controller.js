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
exports.AdminBannerController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const file_1 = require("../../file");
const contants_1 = require("../../storage/contants");
const dtos_1 = require("../../user/dtos");
const payloads_1 = require("../payloads");
const services_1 = require("../services");
let AdminBannerController = class AdminBannerController {
    constructor(bannerService, bannerSearchService) {
        this.bannerService = bannerService;
        this.bannerSearchService = bannerSearchService;
    }
    async upload(files, payload, creator) {
        const resp = await this.bannerService.create(files.banner, payload, creator);
        return kernel_1.DataResponse.ok(resp);
    }
    async update(id, payload, updater) {
        const details = await this.bannerService.update(id, payload, updater);
        return kernel_1.DataResponse.ok(details);
    }
    async delete(id) {
        const details = await this.bannerService.delete(id);
        return kernel_1.DataResponse.ok(details);
    }
    async search(req) {
        const list = await this.bannerSearchService.search(req);
        return kernel_1.DataResponse.ok(list);
    }
    async details(id) {
        const details = await this.bannerService.details(id);
        return kernel_1.DataResponse.ok(details);
    }
};
__decorate([
    (0, common_1.Post)('/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UseInterceptors)((0, file_1.MultiFileUploadInterceptor)([
        {
            type: 'banner',
            fieldName: 'banner',
            options: {
                destination: (0, kernel_1.getConfig)('file').imageDir,
                uploadImmediately: true,
                acl: contants_1.S3ObjectCannelACL.PublicRead,
                server: contants_1.Storage.S3
            }
        }
    ])),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FilesUploaded)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payloads_1.BannerCreatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminBannerController.prototype, "upload", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.BannerUpdatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminBannerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBannerController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.BannerSearchRequest]),
    __metadata("design:returntype", Promise)
], AdminBannerController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('/:id/view'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBannerController.prototype, "details", null);
AdminBannerController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('admin/banner'),
    __metadata("design:paramtypes", [services_1.BannerService,
        services_1.BannerSearchService])
], AdminBannerController);
exports.AdminBannerController = AdminBannerController;
//# sourceMappingURL=admin-banner.controller.js.map