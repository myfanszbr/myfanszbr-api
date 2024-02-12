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
import { PageableData, QueueEventService } from 'src/kernel';
import { VideoService, GalleryService, ProductService, VideoSearchService } from 'src/modules/performer-assets/services';
import { FeedService } from 'src/modules/feed/services';
import { FileService } from 'src/modules/file/services';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { ReactionModel } from '../models/reaction.model';
import { ReactionCreatePayload, ReactionSearchRequestPayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { ReactionDto } from '../dtos/reaction.dto';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
export declare class ReactionService {
    private readonly followService;
    private readonly performerService;
    private readonly galleryService;
    private readonly productService;
    private readonly videoService;
    private readonly videoSearchService;
    private readonly userService;
    private readonly feedService;
    private readonly fileService;
    private readonly reactionModel;
    private readonly queueEventService;
    constructor(followService: FollowService, performerService: PerformerService, galleryService: GalleryService, productService: ProductService, videoService: VideoService, videoSearchService: VideoSearchService, userService: UserService, feedService: FeedService, fileService: FileService, reactionModel: Model<ReactionModel>, queueEventService: QueueEventService);
    findOneQuery(query: any): Promise<import("mongoose").FlattenMaps<ReactionModel> & {
        _id: Types.ObjectId;
    }>;
    findByQuery(query: any): Promise<(import("mongoose").FlattenMaps<ReactionModel> & {
        _id: Types.ObjectId;
    })[]>;
    create(data: ReactionCreatePayload, user: UserDto): Promise<ReactionDto>;
    remove(payload: ReactionCreatePayload, user: UserDto): Promise<boolean>;
    search(req: ReactionSearchRequestPayload): Promise<PageableData<ReactionDto>>;
    getListProduct(req: ReactionSearchRequestPayload, user: UserDto): Promise<{
        data: ReactionDto[];
        total: number;
    }>;
    getListVideo(req: ReactionSearchRequestPayload, user: UserDto): Promise<{
        data: ReactionDto[];
        total: number;
    }>;
    getListGallery(req: ReactionSearchRequestPayload, user: UserDto, jwToken: string): Promise<{
        data: ReactionDto[];
        total: number;
    }>;
    getListPerformer(req: ReactionSearchRequestPayload, user: UserDto): Promise<{
        data: ReactionDto[];
        total: number;
    }>;
    getListFeeds(req: ReactionSearchRequestPayload, user: UserDto, jwToken: string): Promise<{
        data: ReactionDto[];
        total: number;
    }>;
    checkExisting(objectId: string | Types.ObjectId, userId: string | Types.ObjectId, action: string, objectType: string): Promise<number>;
}
