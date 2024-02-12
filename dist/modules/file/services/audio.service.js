"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioFileService = void 0;
const ffmpeg = require("fluent-ffmpeg");
const path_1 = require("path");
const kernel_1 = require("../../../kernel");
const exceptions_1 = require("../exceptions");
class AudioFileService {
    async convert2Mp3(filePath, options = {}) {
        try {
            const fileName = `audio-${new Date().getTime()}.mp3`;
            const toPath = options.toPath || (0, path_1.join)(kernel_1.StringHelper.getFilePath(filePath), fileName);
            return new Promise((resolve, reject) => {
                const command = new ffmpeg(filePath)
                    .audioCodec('libmp3lame')
                    .outputOptions('-strict -2')
                    .on('end', () => resolve({
                    fileName,
                    toPath
                }))
                    .on('error', reject)
                    .toFormat('mp3');
                if (options.size) {
                    command.size(options.size);
                }
                command.save(toPath);
            });
        }
        catch (e) {
            throw new exceptions_1.ConvertMp3ErrorException(e);
        }
    }
}
exports.AudioFileService = AudioFileService;
//# sourceMappingURL=audio.service.js.map