/// <reference types="node" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { QueueEventService } from 'src/kernel';
import { S3StorageService } from 'src/modules/storage/services';
import { FileModel } from '../models';
import { IMulterUploadedFile } from '../lib/multer/multer.utils';
import { FileDto } from '../dtos';
import { IFileUploadOptions } from '../lib';
import { ImageService } from './image.service';
import { VideoFileService } from './video.service';
import { AudioFileService } from './audio.service';
export declare const FILE_EVENT: {
    VIDEO_PROCESSED: string;
    PHOTO_PROCESSED: string;
    AUDIO_PROCESSED: string;
};
export declare class FileService {
    private readonly s3StorageService;
    private readonly fileModel;
    private readonly imageService;
    private readonly videoService;
    private readonly audioFileService;
    private readonly queueEventService;
    private readonly config;
    constructor(s3StorageService: S3StorageService, fileModel: Model<FileModel>, imageService: ImageService, videoService: VideoFileService, audioFileService: AudioFileService, queueEventService: QueueEventService, config: ConfigService);
    findById(id: string | Types.ObjectId): Promise<FileDto>;
    findByIds(ids: string[] | Types.ObjectId[]): Promise<FileDto[]>;
    countByRefType(itemType: string): Promise<any>;
    findByRefType(itemType: string, limit: number, offset: number): Promise<any>;
    createFromMulter(type: string, multerData: IMulterUploadedFile, fileUploadOptions?: IFileUploadOptions): Promise<FileDto>;
    addRef(fileId: Types.ObjectId | string, ref: {
        itemId: Types.ObjectId;
        itemType: string;
    }): Promise<void>;
    removeMany(fileIds: string[] | Types.ObjectId[]): Promise<boolean>;
    remove(fileId: string | Types.ObjectId): Promise<boolean>;
    deleteManyByRefIds(refIds: string[] | Types.ObjectId[]): Promise<void>;
    removeIfNotHaveRef(fileId: string | Types.ObjectId): Promise<boolean>;
    queueProcessVideo(fileId: string | Types.ObjectId, options?: {
        meta?: Record<string, any>;
        publishChannel?: string;
        size?: string;
        count?: number;
    }): Promise<boolean>;
    private _processVideo;
    queueProcessAudio(fileId: string | Types.ObjectId, options?: {
        meta?: Record<string, any>;
        publishChannel?: string;
    }): Promise<boolean>;
    private _processAudio;
    queueProcessPhoto(fileId: string | Types.ObjectId, options?: {
        meta?: Record<string, any>;
        publishChannel?: string;
        thumbnailSize: {
            width: number;
            height: number;
        };
    }): Promise<boolean>;
    private _processPhoto;
    private generateJwt;
    generateDownloadLink(fileId: string | Types.ObjectId): Promise<string>;
    getStreamToDownload(key: string): Promise<{
        file: import("mongoose").Document<unknown, {}, FileModel> & Omit<FileModel & {
            _id: Types.ObjectId;
        }, never>;
        stream: import("fs").ReadStream;
    }>;
    getFileStatus(fileId: string, query: any, jwToken: string): Promise<{
        thumbnails: string[];
        url: string;
        _id?: Types.ObjectId;
        type?: string;
        name?: string;
        description?: string;
        mimeType?: string;
        server?: string;
        path?: string;
        absolutePath?: string;
        width?: number;
        height?: number;
        duration?: number;
        size?: number;
        status?: string;
        encoding?: string;
        refItems: any;
        acl?: string;
        metadata?: any;
        createdBy?: Types.ObjectId;
        updatedBy?: Types.ObjectId;
        createdAt?: Date;
        updatedAt?: Date;
    }>;
}
