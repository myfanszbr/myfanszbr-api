"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDto = void 0;
const kernel_1 = require("../../../kernel");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const contants_1 = require("../../storage/contants");
const services_1 = require("../../storage/services");
class FileDto {
    constructor(init) {
        if (init) {
            this._id = init._id;
            this.type = init.type;
            this.name = init.name;
            this.description = init.description;
            this.mimeType = init.mimeType;
            this.server = init.server;
            this.path = init.path;
            this.width = init.width;
            this.height = init.height;
            this.duration = init.duration;
            this.size = init.size;
            this.encoding = init.encoding;
            this.path = init.path;
            this.absolutePath = init.absolutePath;
            this.thumbnails = init.thumbnails;
            this.refItems = init.refItems;
            this.status = init.status;
            this.acl = init.acl;
            this.metadata = init.metadata;
            this.createdBy = init.createdBy;
            this.updatedBy = init.updatedBy;
            this.createdAt = init.createdAt;
            this.updatedAt = init.updatedAt;
        }
    }
    static fromModel(file) {
        return new FileDto(file);
    }
    getPublicPath() {
        if (this.absolutePath) {
            return this.absolutePath.replace((0, kernel_1.getConfig)('file').publicDir, '');
        }
        return this.path || '';
    }
    getUrl(authenticated = false) {
        if (!this.path)
            return '';
        if ((0, string_helper_1.isUrl)(this.path) && this.server !== contants_1.Storage.S3) {
            return this.path;
        }
        if ((0, string_helper_1.isUrl)(this.path) && this.server === contants_1.Storage.S3) {
            if (this.acl === contants_1.S3ObjectCannelACL.PublicRead) {
                return this.path;
            }
            if (!authenticated || !this.metadata) {
                return this.path;
            }
            const { bucket, expires, endpoint } = this.metadata;
            return services_1.S3Service.getSignedUrl({
                Bucket: bucket,
                Key: this.absolutePath,
                Expires: parseInt(expires, 10) || 60
            }, {
                endpoint
            });
        }
        return new URL(this.path, (0, kernel_1.getConfig)('app').baseUrl).href;
    }
    getThumbnails() {
        if (!this.thumbnails || !this.thumbnails.length) {
            return [];
        }
        return this.thumbnails.map((t) => {
            if ((0, string_helper_1.isUrl)(t.path))
                return t.path;
            return new URL(t.path, (0, kernel_1.getConfig)('app').baseUrl).href;
        });
    }
    static getPublicUrl(filePath) {
        if (!filePath)
            return '';
        if ((0, string_helper_1.isUrl)(filePath))
            return filePath;
        return new URL(filePath, (0, kernel_1.getConfig)('app').baseUrl).href;
    }
    isVideo() {
        return (this.mimeType || '').toLowerCase().includes('video');
    }
    isImage() {
        return (this.mimeType || '').toLowerCase().includes('image');
    }
    isAudio() {
        return (this.mimeType || '').toLowerCase().includes('audio');
    }
    toResponse() {
        const data = Object.assign({}, this);
        delete data.absolutePath;
        delete data.path;
        return data;
    }
}
exports.FileDto = FileDto;
//# sourceMappingURL=file.dto.js.map