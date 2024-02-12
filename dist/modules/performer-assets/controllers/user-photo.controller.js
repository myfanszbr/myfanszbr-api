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
exports.UserPhotosController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const guards_1 = require("../../auth/guards");
const dtos_1 = require("../../user/dtos");
const photo_service_1 = require("../services/photo.service");
const photo_search_service_1 = require("../services/photo-search.service");
const payloads_1 = require("../payloads");
const services_1 = require("../../auth/services");
let UserPhotosController = class UserPhotosController {
    constructor(photoService, photoSearchService, authService) {
        this.photoService = photoService;
        this.photoSearchService = photoSearchService;
        this.authService = authService;
    }
    async search(query, user, req) {
        const data = await this.photoSearchService.searchPhotos(query, user, req.jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async details(id, user, req) {
        const details = await this.photoService.details(id, req.jwToken, user);
        return kernel_1.DataResponse.ok(details);
    }
    async checkAuth(req) {
        if (!req.query.token)
            throw new common_1.ForbiddenException();
        const decodded = await this.authService.verifySession(req.query.token);
        if (!decodded)
            throw new common_1.ForbiddenException();
        const user = await this.authService.getSourceFromAuthSession({
            source: decodded.source,
            sourceId: decodded.sourceId
        });
        if (!user) {
            throw new common_1.ForbiddenException();
        }
        const valid = await this.photoService.checkAuth(req, user);
        return kernel_1.DataResponse.ok(valid);
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PhotoSearchRequest,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserPhotosController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('/:id/view'),
    (0, common_1.UseGuards)(guards_1.LoadUser),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserPhotosController.prototype, "details", null);
__decorate([
    (0, common_1.Get)('/auth/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserPhotosController.prototype, "checkAuth", null);
UserPhotosController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('performer-assets/photos'),
    __metadata("design:paramtypes", [photo_service_1.PhotoService,
        photo_search_service_1.PhotoSearchService,
        services_1.AuthService])
], UserPhotosController);
exports.UserPhotosController = UserPhotosController;
//# sourceMappingURL=user-photo.controller.js.map