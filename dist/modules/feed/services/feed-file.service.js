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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedFileService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../file/services");
const exceptions_1 = require("../exceptions");
let FeedFileService = class FeedFileService {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async validateTeaser(video) {
        if (!video.isVideo()) {
            await this.fileService.remove(video._id);
            throw new exceptions_1.InvalidFeedTypeException('Invalid video file!');
        }
        await this.fileService.queueProcessVideo(video._id, {
            count: 1
        });
        return true;
    }
    async validatePhoto(photo) {
        if (!photo.isImage()) {
            await this.fileService.remove(photo._id);
            throw new exceptions_1.InvalidFeedTypeException('Invalid photo file!');
        }
        await this.fileService.queueProcessPhoto(photo._id, {
            thumbnailSize: (0, kernel_1.getConfig)('image').blurThumbnail
        });
        return true;
    }
    async validateVideo(video) {
        if (!video.isVideo()) {
            await this.fileService.remove(video._id);
            throw new exceptions_1.InvalidFeedTypeException('Invalid video file!');
        }
        await this.fileService.queueProcessVideo(video._id, {
            size: '65x65',
            count: 1
        });
        return true;
    }
    async validateAudio(audio) {
        if (!audio.isAudio()) {
            await this.fileService.remove(audio._id);
            throw new exceptions_1.InvalidFeedTypeException('Invalid audio file!');
        }
        await this.fileService.queueProcessAudio(audio._id, {});
        return true;
    }
};
FeedFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_1.FileService])
], FeedFileService);
exports.FeedFileService = FeedFileService;
//# sourceMappingURL=feed-file.service.js.map