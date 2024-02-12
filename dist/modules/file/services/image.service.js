"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const sharp = require("sharp");
class ImageService {
    async createThumbnail(filePath, options) {
        options = options || {
            width: 200,
            height: 200
        };
        if (options.toPath) {
            return sharp(filePath)
                .resize(options.width, options.height, { fit: 'inside' })
                .rotate()
                .toFile(options.toPath);
        }
        return sharp(filePath)
            .resize(options.width, options.height, { fit: 'inside' })
            .rotate()
            .toBuffer();
    }
    async getMetaData(filePath) {
        return sharp(filePath).metadata();
    }
    async replaceWithoutExif(filePath, mimeType) {
        return sharp(filePath, { animated: mimeType === 'image/gif' })
            .rotate()
            .toBuffer();
    }
}
exports.ImageService = ImageService;
//# sourceMappingURL=image.service.js.map