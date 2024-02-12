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
exports.UserGalleryController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const auth_1 = require("../../auth");
const payloads_1 = require("../payloads");
const gallery_service_1 = require("../services/gallery.service");
let UserGalleryController = class UserGalleryController {
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    async searchGallery(query, user, req) {
        const resp = await this.galleryService.userSearch(query, user, req.jwToken);
        return kernel_1.DataResponse.ok(resp);
    }
    async view(id, user) {
        const resp = await this.galleryService.details(id, user);
        return kernel_1.DataResponse.ok(resp);
    }
    async download(res, id, user) {
        const resp = await this.galleryService.downloadZipPhotos(id, user);
        return kernel_1.DataResponse.ok(resp);
    }
};
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.GallerySearchRequest, Object, Object]),
    __metadata("design:returntype", Promise)
], UserGalleryController.prototype, "searchGallery", null);
__decorate([
    (0, common_1.Get)('/:id/view'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserGalleryController.prototype, "view", null);
__decorate([
    (0, common_1.Post)('/:id/download-zip'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UserGalleryController.prototype, "download", null);
UserGalleryController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('performer-assets/galleries'),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], UserGalleryController);
exports.UserGalleryController = UserGalleryController;
//# sourceMappingURL=user-gallery.controller.js.map