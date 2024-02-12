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
exports.AdminFeedController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const services_1 = require("../../auth/services");
const dtos_1 = require("../../user/dtos");
const file_1 = require("../../file");
const contants_1 = require("../../storage/contants");
const payloads_1 = require("../payloads");
const services_2 = require("../services");
const exceptions_1 = require("../exceptions");
let AdminFeedController = class AdminFeedController {
    constructor(feedService, authService, feedFileService) {
        this.feedService = feedService;
        this.authService = authService;
        this.feedFileService = feedFileService;
    }
    async create(payload, user) {
        if (user.roles && user.roles.includes('admin') && !payload.fromSourceId) {
            throw new exceptions_1.MissingFieldsException();
        }
        const data = await this.feedService.create(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async getMyFeeds(query, performer, req) {
        const data = await this.feedService.search(query, performer, req.jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async getPerformerFeed(user, id, req) {
        const data = await this.feedService.findOne(id, user, req.jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async updateFeed(user, id, payload) {
        const data = await this.feedService.updateFeed(id, user, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async deletePerformerFeed(user, id) {
        const data = await this.feedService.deleteFeed(id, user);
        return kernel_1.DataResponse.ok(data);
    }
    async createPollFeed(payload, user) {
        const data = await this.feedService.createPoll(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async uploadImage(file) {
        await this.feedFileService.validatePhoto(file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({ success: true }, file.toResponse()), { url: file.getUrl() }));
    }
    async uploadVideo(file) {
        await this.feedFileService.validateVideo(file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({ success: true }, file.toResponse()), { url: file.getUrl() }));
    }
    async uploadAudio(file) {
        await this.feedFileService.validateAudio(file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({ success: true }, file.toResponse()), { url: file.getUrl() }));
    }
    async uploadThumb(file) {
        await this.feedFileService.validatePhoto(file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({ success: true }, file.toResponse()), { url: file.getUrl() }));
    }
    async uploadTeaser(file) {
        await this.feedFileService.validateTeaser(file);
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({ success: true }, file.toResponse()), { url: file.getUrl() }));
    }
};
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.FeedCreatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.FeedSearchRequest,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "getMyFeeds", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, String, Object]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "getPerformerFeed", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, String, payloads_1.FeedCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "updateFeed", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, String]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "deletePerformerFeed", null);
__decorate([
    (0, common_1.Post)('/polls'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PollCreatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "createPollFeed", null);
__decorate([
    (0, common_1.Post)('photo/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('feed-photo', 'file', {
        destination: (0, kernel_1.getConfig)('file').feedProtectedDir,
        acl: contants_1.S3ObjectCannelACL.AuthenticatedRead,
        server: contants_1.Storage.S3
    })),
    __param(0, (0, file_1.FileUploaded)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('video/upload'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('feed-video', 'file', {
        destination: (0, kernel_1.getConfig)('file').feedProtectedDir,
        acl: contants_1.S3ObjectCannelACL.AuthenticatedRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Post)('audio/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('feed-audio', 'file', {
        destination: (0, kernel_1.getConfig)('file').feedProtectedDir,
        acl: contants_1.S3ObjectCannelACL.AuthenticatedRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "uploadAudio", null);
__decorate([
    (0, common_1.Post)('thumbnail/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('feed-photo', 'file', {
        destination: (0, kernel_1.getConfig)('file').feedDir,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "uploadThumb", null);
__decorate([
    (0, common_1.Post)('teaser/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, file_1.FileUploadInterceptor)('feed-video', 'file', {
        destination: (0, kernel_1.getConfig)('file').feedDir,
        acl: contants_1.S3ObjectCannelACL.PublicRead,
        server: contants_1.Storage.S3
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, file_1.FileUploaded)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "uploadTeaser", null);
AdminFeedController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('admin/feeds'),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.AuthService))),
    __metadata("design:paramtypes", [services_2.FeedService,
        services_1.AuthService,
        services_2.FeedFileService])
], AdminFeedController);
exports.AdminFeedController = AdminFeedController;
//# sourceMappingURL=admin-feed.controller.js.map