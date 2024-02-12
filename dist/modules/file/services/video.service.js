"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoFileService = void 0;
const child_process_1 = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const path_1 = require("path");
const kernel_1 = require("../../../kernel");
const exceptions_1 = require("../exceptions");
class VideoFileService {
    async convert2Mp4(filePath, options = {}) {
        try {
            const fileName = `video-${new Date().getTime()}.mp4`;
            const toPath = options.toPath || (0, path_1.join)(kernel_1.StringHelper.getFilePath(filePath), fileName);
            return new Promise((resolve, reject) => {
                let outputOptions = '-vcodec libx264 -pix_fmt yuv420p -profile:v baseline -level 3.1 -movflags +faststart -strict experimental -preset fast -threads 0 -crf 23 -hide_banner';
                if (options.size) {
                    const sizes = options.size.split('x');
                    const width = sizes[0];
                    const height = sizes.length > 1 ? sizes[1] : '-1  ';
                    outputOptions += ` -vf scale="${width}:${height}"`;
                }
                const q = `ffmpeg -i ${filePath} ${outputOptions} ${toPath}`;
                const command = (0, child_process_1.spawn)(q, [], {
                    shell: true,
                    stdio: ['ignore', 'ignore', 'pipe']
                });
                let e = '';
                command.stderr.on('data', (data) => {
                    e += data;
                });
                command.on('exit', (code) => {
                    if (!code) {
                        resolve({
                            fileName,
                            toPath
                        });
                        return;
                    }
                    reject(new Error(e));
                });
            });
        }
        catch (e) {
            throw new exceptions_1.ConvertMp4ErrorException(e);
        }
    }
    async getMetaData(filePath) {
        return new Promise((resolve, reject) => ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            return resolve(metadata);
        }));
    }
    async createThumbs(filePath, options) {
        let thumbs = [];
        return new Promise((resolve, reject) => new ffmpeg(filePath)
            .on('filenames', (filenames) => {
            thumbs = filenames;
        })
            .on('end', () => resolve(thumbs))
            .on('error', reject)
            .screenshot({
            folder: options.toFolder,
            filename: `${new Date().getTime()}-screenshot-%s.jpg`,
            count: options.count || 3,
            size: options.size || '500x500'
        }));
    }
}
exports.VideoFileService = VideoFileService;
//# sourceMappingURL=video.service.js.map