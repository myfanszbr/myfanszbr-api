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
exports.PerformerVideosController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const auth_1 = require("../../auth");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
const contants_1 = require("../../storage/contants");
const video_create_payload_1 = require("../payloads/video-create.payload");
const video_service_1 = require("../services/video.service");
const payloads_1 = require("../payloads");
const video_search_service_1 = require("../services/video-search.service");
let PerformerVideosController = class PerformerVideosController {
    constructor(videoService, videoSearchService) {
        this.videoService = videoService;
        this.videoSearchService = videoSearchService;
    }
    async uploadVideo(files, payload, uploader) {
        const resp = await this.videoService.create(files.video, files.teaser, files.thumbnail, payload, uploader);
        return kernel_1.DataResponse.ok(resp);
    }
    async details(id, req) {
        const details = await this.videoService.getDetails(id, req.jwToken);
        return kernel_1.DataResponse.ok(details);
    }
    async search(req, uploader) {
        const resp = await this.videoSearchService.performerSearch(req, uploader);
        return kernel_1.DataResponse.ok(resp);
    }
    async update(files, id, payload, updater) {
        const details = await this.videoService.updateInfo(id, payload, files, updater);
        return kernel_1.DataResponse.ok(details);
    }
    async remove(id, user) {
        const details = await this.videoService.delete(id, user);
        return kernel_1.DataResponse.ok(details);
    }
    async removeFile(id, user, payload) {
        const details = await this.videoService.deleteFile(id, payload.type, user);
        return kernel_1.DataResponse.ok(details);
    }
};
__decorate([
    (0, common_1.Post)('/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UseInterceptors)((0, file_1.MultiFileUploadInterceptor)([
        {
            type: 'performer-video',
            fieldName: 'video',
            options: {
                destination: (0, kernel_1.getConfig)('file').videoProtectedDir,
                acl: contants_1.S3ObjectCannelACL.AuthenticatedRead,
                server: contants_1.Storage.S3
            }
        },
        {
            type: 'performer-video-teaser',
            fieldName: 'teaser',
            options: {
                destination: (0, kernel_1.getConfig)('file').videoDir,
                acl: contants_1.S3ObjectCannelACL.PublicRead,
                server: contants_1.Storage.S3
            }
        },
        {
            type: 'performer-video-thumbnail',
            fieldName: 'thumbnail',
            options: {
                destination: (0, kernel_1.getConfig)('file').imageDir,
                uploadImmediately: true,
                generateThumbnail: true,
                thumbnailSize: (0, kernel_1.getConfig)('image').blurThumbnail,
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
    __metadata("design:paramtypes", [Object, video_create_payload_1.VideoCreatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerVideosController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Get)('/:id/view'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PerformerVideosController.prototype, "details", null);
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.VideoSearchRequest,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerVideosController.prototype, "search", null);
__decorate([
    (0, common_1.Put)('/edit/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    (0, common_1.UseInterceptors)((0, file_1.MultiFileUploadInterceptor)([
        {
            type: 'performer-video',
            fieldName: 'video',
            options: {
                destination: (0, kernel_1.getConfig)('file').videoProtectedDir,
                acl: contants_1.S3ObjectCannelACL.AuthenticatedRead,
                server: contants_1.Storage.S3
            }
        },
        {
            type: 'performer-video-teaser',
            fieldName: 'teaser',
            options: {
                destination: (0, kernel_1.getConfig)('file').videoDir,
                acl: contants_1.S3ObjectCannelACL.PublicRead,
                server: contants_1.Storage.S3
            }
        },
        {
            type: 'performer-video-thumbnail',
            fieldName: 'thumbnail',
            options: {
                destination: (0, kernel_1.getConfig)('file').imageDir,
                generateThumbnail: true,
                uploadImmediately: true,
                thumbnailSize: (0, kernel_1.getConfig)('image').blurThumbnail,
                acl: contants_1.S3ObjectCannelACL.PublicRead,
                server: contants_1.Storage.S3
            }
        }
    ])),
    __param(0, (0, file_1.FilesUploaded)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, payloads_1.VideoUpdatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerVideosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerVideosController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('/remove-file/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], PerformerVideosController.prototype, "removeFile", null);
PerformerVideosController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('performer/performer-assets/videos'),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        video_search_service_1.VideoSearchService])
], PerformerVideosController);
exports.PerformerVideosController = PerformerVideosController;
//# sourceMappingURL=performer-video.controller.js.map