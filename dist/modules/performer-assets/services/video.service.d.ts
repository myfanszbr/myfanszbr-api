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
import { QueueEventService, QueueEvent, AgendaService } from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { PerformerService } from 'src/modules/performer/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { TokenTransactionService } from 'src/modules/token-transaction/services';
import { UserDto } from 'src/modules/user/dtos';
import { VideoUpdatePayload } from '../payloads';
import { VideoDto } from '../dtos';
import { VideoCreatePayload } from '../payloads/video-create.payload';
import { VideoModel } from '../models';
export declare const PERFORMER_VIDEO_CHANNEL = "PERFORMER_VIDEO_CHANNEL";
export declare const CONVERT_VIDEO_CHANNEL = "CONVERT_VIDEO_CHANNEL";
export declare const CONVERT_TEASER_CHANNEL = "CONVERT_TEASER_CHANNEL";
export declare const PERFORMER_COUNT_VIDEO_CHANNEL = "PERFORMER_COUNT_VIDEO_CHANNEL";
export declare class VideoService {
    private readonly performerService;
    private readonly reactionService;
    private readonly tokenTransactionService;
    private readonly subscriptionService;
    private readonly PerformerVideoModel;
    private readonly queueEventService;
    private readonly fileService;
    private readonly agenda;
    constructor(performerService: PerformerService, reactionService: ReactionService, tokenTransactionService: TokenTransactionService, subscriptionService: SubscriptionService, PerformerVideoModel: Model<VideoModel>, queueEventService: QueueEventService, fileService: FileService, agenda: AgendaService);
    private defineJobs;
    private scheduleVideo;
    find(query: any): Promise<(import("mongoose").Document<unknown, {}, VideoModel> & Omit<VideoModel & {
        _id: Types.ObjectId;
    }, never>)[]>;
    findById(id: string | Types.ObjectId): Promise<VideoDto>;
    findByIds(ids: string[] | Types.ObjectId[]): Promise<(import("mongoose").Document<unknown, {}, VideoModel> & Omit<VideoModel & {
        _id: Types.ObjectId;
    }, never>)[]>;
    getVideoForView(file: FileDto, video: VideoDto, canView: boolean, jwToken: string): {
        name: string;
        url: string;
        duration: number;
        thumbnails: string[];
    };
    handleTeaserProcessed(event: QueueEvent): Promise<void>;
    handleFileProcessed(event: QueueEvent): Promise<void>;
    create(video: FileDto, teaser: FileDto, thumbnail: FileDto, payload: VideoCreatePayload, creator?: UserDto): Promise<VideoDto>;
    getDetails(videoId: string, jwToken: string): Promise<VideoDto>;
    userGetDetails(videoId: string, currentUser: UserDto, jwToken: string): Promise<VideoDto>;
    updateInfo(id: string | Types.ObjectId, payload: VideoUpdatePayload, files: any, updater: UserDto): Promise<VideoDto>;
    delete(id: string, user: UserDto): Promise<boolean>;
    deleteFile(id: string, type: string, user: UserDto): Promise<boolean>;
    increaseView(id: string | Types.ObjectId): Promise<void>;
    increaseComment(id: string | Types.ObjectId, num?: number): Promise<void>;
    increaseLike(id: string | Types.ObjectId, num?: number): Promise<void>;
    increaseFavourite(id: string | Types.ObjectId, num?: number): Promise<void>;
    checkAuth(req: any, user: UserDto): Promise<boolean>;
}
