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
import { PerformerService } from 'src/modules/performer/services';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { FileService } from 'src/modules/file/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { TokenTransactionSearchService, TokenTransactionService } from 'src/modules/token-transaction/services';
import { UserDto } from 'src/modules/user/dtos';
import { GalleryUpdatePayload } from '../payloads/gallery-update.payload';
import { GalleryDto } from '../dtos';
import { GalleryCreatePayload, GallerySearchRequest } from '../payloads';
import { GalleryModel, PhotoModel } from '../models';
import { PhotoService } from './photo.service';
export declare class GalleryService {
    private readonly subscriptionService;
    private readonly performerService;
    private readonly reactionService;
    private readonly photoService;
    private readonly tokenTransactionService;
    private readonly tokenTransactionSearchService;
    private readonly galleryModel;
    private readonly photoModel;
    private readonly fileService;
    private readonly queueEventService;
    constructor(subscriptionService: SubscriptionService, performerService: PerformerService, reactionService: ReactionService, photoService: PhotoService, tokenTransactionService: TokenTransactionService, tokenTransactionSearchService: TokenTransactionSearchService, galleryModel: Model<GalleryModel>, photoModel: Model<PhotoModel>, fileService: FileService, queueEventService: QueueEventService);
    create(payload: GalleryCreatePayload, creator?: UserDto): Promise<GalleryDto>;
    update(id: string, payload: GalleryUpdatePayload, creator?: UserDto): Promise<GalleryDto>;
    find(query: any): Promise<(import("mongoose").Document<unknown, {}, GalleryModel> & Omit<GalleryModel & {
        _id: Types.ObjectId;
    }, never>)[]>;
    findByIds(ids: string[] | Types.ObjectId[]): Promise<GalleryDto[]>;
    findById(id: string | Types.ObjectId): Promise<GalleryDto>;
    mapArrayInfo(data: any, user: UserDto, jwToken: string): Promise<any>;
    details(id: string, user: UserDto): Promise<GalleryDto>;
    updatePhotoStats(id: Types.ObjectId, num?: number): Promise<import("mongoose").Document<unknown, {}, GalleryModel> & Omit<GalleryModel & {
        _id: Types.ObjectId;
    }, never>>;
    downloadZipPhotos(galleryId: string, user: UserDto): Promise<{
        path: string;
        name: string;
    }[]>;
    adminSearch(req: GallerySearchRequest): Promise<PageableData<GalleryDto>>;
    performerSearch(req: GallerySearchRequest, user: UserDto): Promise<PageableData<GalleryDto>>;
    userSearch(req: GallerySearchRequest, user: UserDto, jwToken: string): Promise<PageableData<GalleryDto>>;
    updateCover(galleryId: string | Types.ObjectId, photoId: Types.ObjectId): Promise<boolean>;
    delete(id: string | Types.ObjectId): Promise<boolean>;
    updateCommentStats(id: string | Types.ObjectId, num?: number): Promise<void>;
    updateLikeStats(id: string | Types.ObjectId, num?: number): Promise<void>;
    updateBookmarkStats(id: string | Types.ObjectId, num?: number): Promise<void>;
}
