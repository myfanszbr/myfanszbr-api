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
exports.FileService = exports.FILE_EVENT = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const config_1 = require("@nestjs/config");
const kernel_1 = require("../../../kernel");
const fs_1 = require("fs");
const contants_1 = require("../../storage/contants");
const services_1 = require("../../storage/services");
const multer_helper_1 = require("../../../kernel/helpers/multer.helper");
const path_1 = require("path");
const jwt = require("jsonwebtoken");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
const image_service_1 = require("./image.service");
const video_service_1 = require("./video.service");
const audio_service_1 = require("./audio.service");
const VIDEO_QUEUE_CHANNEL = 'VIDEO_PROCESS';
const AUDIO_QUEUE_CHANNEL = 'AUDIO_PROCESS';
const PHOTO_QUEUE_CHANNEL = 'PHOTO_PROCESS';
exports.FILE_EVENT = {
    VIDEO_PROCESSED: 'VIDEO_PROCESSED',
    PHOTO_PROCESSED: 'PHOTO_PROCESSED',
    AUDIO_PROCESSED: 'AUDIO_PROCESSED'
};
let FileService = class FileService {
    constructor(s3StorageService, fileModel, imageService, videoService, audioFileService, queueEventService, config) {
        this.s3StorageService = s3StorageService;
        this.fileModel = fileModel;
        this.imageService = imageService;
        this.videoService = videoService;
        this.audioFileService = audioFileService;
        this.queueEventService = queueEventService;
        this.config = config;
        this.queueEventService.subscribe(VIDEO_QUEUE_CHANNEL, 'PROCESS_VIDEO', this._processVideo.bind(this));
        this.queueEventService.subscribe(AUDIO_QUEUE_CHANNEL, 'PROCESS_AUDIO', this._processAudio.bind(this));
        this.queueEventService.subscribe(PHOTO_QUEUE_CHANNEL, 'PROCESS_PHOTO', this._processPhoto.bind(this));
    }
    async findById(id) {
        const model = await this.fileModel.findById(id);
        if (!model)
            return null;
        return new dtos_1.FileDto(model);
    }
    async findByIds(ids) {
        const items = await this.fileModel.find({
            _id: {
                $in: ids
            }
        });
        return items.map((i) => new dtos_1.FileDto(i));
    }
    async countByRefType(itemType) {
        const count = await this.fileModel.countDocuments({
            refItems: { $elemMatch: { itemType } }
        });
        return count;
    }
    async findByRefType(itemType, limit, offset) {
        const items = await this.fileModel.find({
            refItems: { $elemMatch: { itemType } }
        }).limit(limit).skip(offset * limit);
        return items.map((item) => new dtos_1.FileDto(item));
    }
    async createFromMulter(type, multerData, fileUploadOptions) {
        const options = Object.assign({}, fileUploadOptions) || {};
        const { publicDir, photoDir } = (0, kernel_1.getConfig)('file');
        const checkS3Settings = await this.s3StorageService.checkSetting();
        let absolutePath = multerData.path;
        let path = multerData.path.replace(publicDir, '');
        let { metadata = {} } = multerData;
        let server = options.server || contants_1.Storage.DiskStorage;
        if (server === contants_1.Storage.S3 && !checkS3Settings) {
            server = contants_1.Storage.DiskStorage;
        }
        const thumbnails = [];
        if (multerData.mimetype.includes('image') && options.uploadImmediately && options.generateThumbnail) {
            const thumbBuffer = await this.imageService.createThumbnail(multerData.path, options.thumbnailSize || { width: 500, height: 500 });
            const thumbName = `${new Date().getTime()}_thumb`;
            if (fileUploadOptions.server === contants_1.Storage.S3 && checkS3Settings) {
                const [uploadThumb] = await Promise.all([
                    this.s3StorageService.upload(thumbName, fileUploadOptions.acl, thumbBuffer, multerData.mimetype)
                ]);
                if (uploadThumb.Key && uploadThumb.Location) {
                    thumbnails.push({
                        thumbnailSize: options.thumbnailSize || { width: 500, height: 500 },
                        path: uploadThumb.Location,
                        absolutePath: uploadThumb.Key
                    });
                }
            }
            else {
                (0, fs_1.writeFileSync)((0, path_1.join)(photoDir, thumbName), thumbBuffer);
                thumbnails.push({
                    thumbnailSize: options.thumbnailSize || { width: 500, height: 500 },
                    path: (0, string_helper_1.toPosixPath)((0, path_1.join)(photoDir, thumbName).replace(publicDir, '')),
                    absolutePath: (0, string_helper_1.toPosixPath)((0, path_1.join)(photoDir, thumbName))
                });
            }
        }
        if (options.uploadImmediately && fileUploadOptions.server === contants_1.Storage.S3 && checkS3Settings) {
            const buffer = multerData.mimetype.includes('image') ? await this.imageService.replaceWithoutExif(multerData.path, multerData.mimetype) : (0, fs_1.readFileSync)(multerData.path);
            const upload = await this.s3StorageService.upload((0, multer_helper_1.formatFileName)(multerData), fileUploadOptions.acl, buffer, multerData.mimetype);
            if (upload.Key && upload.Location) {
                absolutePath = upload.Key;
                path = upload.Location;
            }
            metadata = Object.assign(Object.assign({}, metadata), { bucket: upload.Bucket, endpoint: services_1.S3Service.getEndpoint() });
            (0, fs_1.existsSync)(multerData.path) && (0, fs_1.unlinkSync)(multerData.path);
        }
        else {
            server = contants_1.Storage.DiskStorage;
            path = (0, string_helper_1.toPosixPath)(path);
        }
        const data = {
            type,
            name: multerData.filename,
            description: '',
            mimeType: multerData.mimetype,
            server,
            path,
            absolutePath,
            acl: multerData.acl || options.acl,
            thumbnails,
            metadata,
            size: multerData.size,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: options.uploader ? options.uploader._id : null,
            updatedBy: options.uploader ? options.uploader._id : null
        };
        const file = await this.fileModel.create(data);
        return dtos_1.FileDto.fromModel(file);
    }
    async addRef(fileId, ref) {
        await this.fileModel.updateOne({ _id: fileId }, {
            $addToSet: {
                refItems: ref
            }
        });
    }
    async removeMany(fileIds) {
        const files = await this.fileModel.find({ _id: { $in: fileIds } });
        if (!files.length) {
            return false;
        }
        for (const file of files) {
            await this.fileModel.deleteOne({ _id: file._id });
            const filePaths = [
                {
                    absolutePath: file.absolutePath,
                    path: file.path
                }
            ].concat(file.thumbnails || []);
            if (file.server === contants_1.Storage.S3) {
                const del = filePaths.map((fp) => ({ Key: fp.absolutePath }));
                await this.s3StorageService.deleteObjects({ Objects: del });
                return true;
            }
            filePaths.forEach((fp) => {
                if ((0, fs_1.existsSync)(fp.absolutePath)) {
                    (0, fs_1.unlinkSync)(fp.absolutePath);
                }
                else {
                    const publicDir = this.config.get('file.publicDir');
                    const filePublic = (0, path_1.join)(publicDir, fp.path);
                    (0, fs_1.existsSync)(filePublic) && (0, fs_1.unlinkSync)(filePublic);
                }
            });
        }
        return true;
    }
    async remove(fileId) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file) {
            return false;
        }
        await this.fileModel.deleteOne({ _id: file._id });
        const filePaths = [
            {
                absolutePath: file.absolutePath,
                path: file.path
            }
        ].concat(file.thumbnails || []);
        if (file.server === contants_1.Storage.S3) {
            const del = filePaths.map((fp) => ({ Key: fp.absolutePath }));
            await this.s3StorageService.deleteObjects({ Objects: del });
            return true;
        }
        filePaths.forEach((fp) => {
            if ((0, fs_1.existsSync)(fp.absolutePath)) {
                (0, fs_1.unlinkSync)(fp.absolutePath);
            }
            else {
                const { publicDir } = (0, kernel_1.getConfig)('file');
                const filePublic = (0, path_1.join)(publicDir, fp.path);
                (0, fs_1.existsSync)(filePublic) && (0, fs_1.unlinkSync)(filePublic);
            }
        });
        return true;
    }
    async deleteManyByRefIds(refIds) {
        if (!refIds.length)
            return;
        const files = await this.fileModel.find({
            refItems: {
                $elemMatch: {
                    itemId: { $in: refIds }
                }
            }
        });
        await this.fileModel.deleteMany({ _id: files.map((f) => f._id) });
        await files.reduce(async (cb, file) => {
            await cb;
            const filePaths = [
                {
                    absolutePath: file.absolutePath,
                    path: file.path
                }
            ].concat(file.thumbnails || []);
            if (file.server === contants_1.Storage.S3) {
                const del = filePaths.map((fp) => ({ Key: fp.absolutePath }));
                await this.s3StorageService.deleteObjects({ Objects: del });
                return Promise.resolve();
            }
            filePaths.map((fp) => {
                if ((0, fs_1.existsSync)(fp.absolutePath)) {
                    (0, fs_1.unlinkSync)(fp.absolutePath);
                }
                else {
                    const { publicDir } = (0, kernel_1.getConfig)('file');
                    const filePublic = (0, path_1.join)(publicDir, fp.path);
                    (0, fs_1.existsSync)(filePublic) && (0, fs_1.unlinkSync)(filePublic);
                }
                return fp;
            });
            return Promise.resolve();
        }, Promise.resolve());
    }
    async removeIfNotHaveRef(fileId) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file) {
            return false;
        }
        if (file.refItems && !file.refItems.length) {
            return false;
        }
        await this.fileModel.deleteOne({ _id: file._id });
        if (file.server === contants_1.Storage.S3) {
            const del = [{ Key: file.absolutePath }];
            await this.s3StorageService.deleteObjects({ Objects: del });
            return true;
        }
        if ((0, fs_1.existsSync)(file.absolutePath)) {
            (0, fs_1.unlinkSync)(file.absolutePath);
        }
        else {
            const { publicDir } = (0, kernel_1.getConfig)('file');
            const filePublic = (0, path_1.join)(publicDir, file.path);
            (0, fs_1.existsSync)(filePublic) && (0, fs_1.unlinkSync)(filePublic);
        }
        return true;
    }
    async queueProcessVideo(fileId, options) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file || file.status === 'processing') {
            return false;
        }
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: VIDEO_QUEUE_CHANNEL,
            eventName: 'processVideo',
            data: {
                file: new dtos_1.FileDto(file),
                options
            }
        }));
        return true;
    }
    async _processVideo(event) {
        if (event.eventName !== 'processVideo') {
            return;
        }
        const fileData = event.data.file;
        const options = event.data.options || {};
        const { publicDir, videoDir } = (0, kernel_1.getConfig)('file');
        let videoPath = fileData.absolutePath;
        let newAbsolutePath = fileData.absolutePath;
        let newPath = fileData.path;
        let { metadata = {}, server } = fileData;
        if ((0, fs_1.existsSync)(fileData.absolutePath)) {
            videoPath = fileData.absolutePath;
        }
        else if ((0, fs_1.existsSync)((0, path_1.join)(publicDir, fileData.path))) {
            videoPath = (0, path_1.join)(publicDir, fileData.path);
        }
        try {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'processing'
                }
            });
            const respVideo = await this.videoService.convert2Mp4(videoPath);
            newAbsolutePath = respVideo.toPath;
            newPath = respVideo.toPath.replace(publicDir, '');
            const meta = await this.videoService.getMetaData(videoPath);
            const videoMeta = meta.streams.find((s) => s.codec_type === 'video');
            const { width = 500, height = 500, rotation = '0' } = videoMeta || {};
            const respThumb = await this.videoService.createThumbs(videoPath, {
                toFolder: videoDir,
                size: (options === null || options === void 0 ? void 0 : options.size) || (['90', '-90', '270', '-270'].includes(rotation) ? `${height}x${width}` : `${width}x${height}`),
                count: (options === null || options === void 0 ? void 0 : options.count) || 1
            });
            let thumbnails = [];
            const checkS3Settings = await this.s3StorageService.checkSetting();
            if (fileData.server === contants_1.Storage.S3 && checkS3Settings) {
                const video = (0, fs_1.readFileSync)(respVideo.toPath);
                const result = await this.s3StorageService.upload(respVideo.fileName, fileData.acl, video, 'video/mp4');
                newAbsolutePath = result.Key;
                newPath = result.Location;
                metadata = Object.assign(Object.assign({}, metadata), { bucket: result.Bucket, endpoint: services_1.S3Service.getEndpoint() });
                if (respThumb.length) {
                    for (const name of respThumb) {
                        if ((0, fs_1.existsSync)((0, path_1.join)(videoDir, name))) {
                            const file = (0, fs_1.readFileSync)((0, path_1.join)(videoDir, name));
                            const thumb = await this.s3StorageService.upload(name, contants_1.S3ObjectCannelACL.PublicRead, file, 'image/jpg');
                            thumbnails.push({
                                path: thumb.Location,
                                absolutePath: thumb.Key
                            });
                            (0, fs_1.unlinkSync)((0, path_1.join)(videoDir, name));
                        }
                    }
                }
                (0, fs_1.existsSync)(respVideo.toPath) && (0, fs_1.unlinkSync)(respVideo.toPath);
            }
            else {
                server = contants_1.Storage.DiskStorage;
                thumbnails = respThumb.map((name) => ({
                    absolutePath: (0, path_1.join)(videoDir, name),
                    path: (0, string_helper_1.toPosixPath)((0, path_1.join)(videoDir, name).replace(publicDir, ''))
                }));
                newPath = (0, string_helper_1.toPosixPath)(newPath);
            }
            (0, fs_1.existsSync)(videoPath) && (0, fs_1.unlinkSync)(videoPath);
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'finished',
                    absolutePath: newAbsolutePath,
                    path: newPath,
                    thumbnails,
                    duration: parseInt(meta.format.duration, 10),
                    metadata,
                    server,
                    width,
                    height
                }
            });
        }
        catch (e) {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'error',
                    error: (e === null || e === void 0 ? void 0 : e.stack) || e
                }
            });
            throw new common_1.HttpException(e, 500);
        }
        finally {
            if (options.publishChannel) {
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: options.publishChannel,
                    eventName: exports.FILE_EVENT.VIDEO_PROCESSED,
                    data: {
                        meta: options.meta,
                        fileId: fileData._id
                    }
                }));
            }
        }
    }
    async queueProcessAudio(fileId, options) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file || file.status === 'processing') {
            return false;
        }
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: AUDIO_QUEUE_CHANNEL,
            eventName: 'processAudio',
            data: {
                file: new dtos_1.FileDto(file),
                options
            }
        }));
        return true;
    }
    async _processAudio(event) {
        var _a;
        if (event.eventName !== 'processAudio') {
            return;
        }
        const fileData = event.data.file;
        if (fileData.mimeType.includes('mp3'))
            return;
        const options = event.data.options || {};
        const { publicDir } = (0, kernel_1.getConfig)('file');
        let audioPath = '';
        let newAbsolutePath = '';
        let newPath = '';
        let { metadata = {}, server } = fileData;
        if ((0, fs_1.existsSync)(fileData.absolutePath)) {
            audioPath = fileData.absolutePath;
        }
        else if ((0, fs_1.existsSync)((0, path_1.join)(publicDir, fileData.path))) {
            audioPath = (0, path_1.join)(publicDir, fileData.path);
        }
        try {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'processing'
                }
            });
            const respAudio = await this.audioFileService.convert2Mp3(audioPath);
            newAbsolutePath = respAudio.toPath;
            newPath = respAudio.toPath.replace(publicDir, '');
            const checkS3Settings = await this.s3StorageService.checkSetting();
            if (fileData.server === contants_1.Storage.S3 && checkS3Settings) {
                const audio = (0, fs_1.readFileSync)(respAudio.toPath);
                const result = await this.s3StorageService.upload(respAudio.fileName, fileData.acl, audio, 'audio/mp3');
                newAbsolutePath = result.Key;
                newPath = result.Location;
                metadata = Object.assign(Object.assign({}, metadata), { bucket: result.Bucket, endpoint: services_1.S3Service.getEndpoint() });
                (0, fs_1.existsSync)(respAudio.toPath) && (0, fs_1.unlinkSync)(respAudio.toPath);
            }
            else {
                server = contants_1.Storage.DiskStorage;
                newPath = (0, string_helper_1.toPosixPath)(newPath);
            }
            const meta = await this.videoService.getMetaData(audioPath);
            (0, fs_1.existsSync)(audioPath) && (0, fs_1.unlinkSync)(audioPath);
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'finished',
                    absolutePath: newAbsolutePath,
                    path: newPath,
                    duration: parseInt((_a = meta === null || meta === void 0 ? void 0 : meta.format) === null || _a === void 0 ? void 0 : _a.duration, 10) || null,
                    mimeType: 'audio/mp3',
                    name: fileData.name.replace(`.${fileData.mimeType.split('audio/')[1]}`, '.mp3'),
                    metadata,
                    server
                }
            });
        }
        catch (e) {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'error',
                    error: (e === null || e === void 0 ? void 0 : e.stack) || e
                }
            });
            throw new common_1.HttpException(e, 500);
        }
        finally {
            if (options.publishChannel) {
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: options.publishChannel,
                    eventName: exports.FILE_EVENT.AUDIO_PROCESSED,
                    data: {
                        meta: options.meta,
                        fileId: fileData._id
                    }
                }));
            }
        }
    }
    async queueProcessPhoto(fileId, options) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file || file.status === 'processing') {
            return false;
        }
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: PHOTO_QUEUE_CHANNEL,
            eventName: 'processPhoto',
            data: {
                file: new dtos_1.FileDto(file),
                options
            }
        }));
        return true;
    }
    async _processPhoto(event) {
        if (event.eventName !== 'processPhoto') {
            return;
        }
        const fileData = event.data.file;
        let { metadata = {}, server } = fileData;
        const options = event.data.options || {};
        const { publicDir, photoDir } = (0, kernel_1.getConfig)('file');
        let thumbnailAbsolutePath = '';
        let thumbnailPath = '';
        let { absolutePath } = fileData;
        let photoPath = (0, path_1.join)(publicDir, fileData.path);
        if ((0, fs_1.existsSync)(fileData.absolutePath)) {
            photoPath = fileData.absolutePath;
        }
        else if ((0, fs_1.existsSync)((0, path_1.join)(publicDir, fileData.path))) {
            photoPath = (0, path_1.join)(publicDir, fileData.path);
        }
        try {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'processing'
                }
            });
            const meta = await this.imageService.getMetaData(photoPath);
            const thumbBuffer = await this.imageService.createThumbnail(photoPath, options.thumbnailSize || {
                width: 250,
                height: 250
            });
            const thumbName = `thumb-${new Date().getTime()}.jpg`;
            const checkS3Settings = await this.s3StorageService.checkSetting();
            if (fileData.server === contants_1.Storage.S3 && checkS3Settings) {
                const upload = await this.s3StorageService.upload(thumbName, contants_1.S3ObjectCannelACL.PublicRead, thumbBuffer, fileData.mimeType);
                thumbnailAbsolutePath = upload.Key;
                thumbnailPath = upload.Location;
            }
            else {
                thumbnailPath = (0, string_helper_1.toPosixPath)((0, path_1.join)(photoDir, thumbName).replace(publicDir, ''));
                thumbnailAbsolutePath = (0, path_1.join)(photoDir, thumbName);
                (0, fs_1.writeFileSync)((0, path_1.join)(photoDir, thumbName), thumbBuffer);
            }
            const buffer = await this.imageService.replaceWithoutExif(photoPath, fileData.mimeType);
            if (fileData.server === contants_1.Storage.S3 && checkS3Settings) {
                const upload = await this.s3StorageService.upload(fileData.name, fileData.acl, buffer, fileData.mimeType);
                if (upload.Key && upload.Location) {
                    absolutePath = upload.Key;
                    photoPath = upload.Location;
                }
                metadata = Object.assign(Object.assign({}, metadata), { bucket: upload.Bucket, endpoint: services_1.S3Service.getEndpoint() });
                (0, fs_1.existsSync)(fileData.absolutePath) && (0, fs_1.unlinkSync)(fileData.absolutePath);
            }
            else {
                (0, fs_1.writeFileSync)(photoPath, buffer);
                absolutePath = photoPath;
                photoPath = (0, string_helper_1.toPosixPath)(photoPath.replace(publicDir, ''));
                server = contants_1.Storage.DiskStorage;
            }
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'finished',
                    width: meta.width,
                    height: meta.height,
                    metadata,
                    server,
                    absolutePath,
                    path: photoPath,
                    thumbnails: [
                        {
                            path: thumbnailPath,
                            absolutePath: thumbnailAbsolutePath
                        }
                    ]
                }
            });
        }
        catch (e) {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'error',
                    error: (e === null || e === void 0 ? void 0 : e.stack) || e
                }
            });
            throw new common_1.HttpException(e, 500);
        }
        finally {
            if (options.publishChannel) {
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: options.publishChannel,
                    eventName: exports.FILE_EVENT.PHOTO_PROCESSED,
                    data: {
                        meta: options.meta,
                        fileId: fileData._id
                    }
                }));
            }
        }
    }
    generateJwt(fileId) {
        const expiresIn = 60 * 60 * 3;
        return jwt.sign({
            fileId
        }, process.env.TOKEN_SECRET, {
            expiresIn
        });
    }
    async generateDownloadLink(fileId) {
        const newUrl = new URL('files/download', (0, kernel_1.getConfig)('app').baseUrl);
        newUrl.searchParams.append('key', this.generateJwt(fileId));
        return newUrl.href;
    }
    async getStreamToDownload(key) {
        try {
            const decoded = jwt.verify(key, process.env.TOKEN_SECRET);
            const file = await this.fileModel.findById(decoded.fileId);
            if (!file)
                throw new kernel_1.EntityNotFoundException();
            let filePath;
            const { publicDir } = (0, kernel_1.getConfig)('file');
            if ((0, fs_1.existsSync)(file.absolutePath)) {
                filePath = file.absolutePath;
            }
            else if ((0, fs_1.existsSync)((0, path_1.join)(publicDir, file.path))) {
                filePath = (0, path_1.join)(publicDir, file.path);
            }
            else {
                throw new kernel_1.EntityNotFoundException();
            }
            return {
                file,
                stream: (0, fs_1.createReadStream)(filePath)
            };
        }
        catch (e) {
            throw new kernel_1.EntityNotFoundException();
        }
    }
    async getFileStatus(fileId, query, jwToken) {
        const file = await this.fileModel.findById(fileId);
        const dto = new dtos_1.FileDto(file);
        let fileUrl = dto.getUrl(true);
        if (file.server !== contants_1.Storage.S3) {
            fileUrl = `${fileUrl}?${query.target}=${query.targetId}&token=${jwToken}`;
        }
        return Object.assign(Object.assign({}, dto.toResponse()), { thumbnails: dto.getThumbnails(), url: fileUrl });
    }
};
FileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.S3StorageService))),
    __param(1, (0, common_1.Inject)(providers_1.FILE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.S3StorageService,
        mongoose_1.Model,
        image_service_1.ImageService,
        video_service_1.VideoFileService,
        audio_service_1.AudioFileService,
        kernel_1.QueueEventService,
        config_1.ConfigService])
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map