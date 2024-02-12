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
import { QueueEventService } from 'src/kernel';
import { Model, Types } from 'mongoose';
import { VideoService, ProductService, GalleryService } from 'src/modules/performer-assets/services';
import { GalleryDto, VideoDto } from 'src/modules/performer-assets/dtos';
import { PerformerService } from 'src/modules/performer/services';
import { FeedService } from 'src/modules/feed/services';
import { FeedDto } from 'src/modules/feed/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { StreamService } from 'src/modules/stream/services';
import { StreamModel } from 'src/modules/stream/models';
import { UserDto } from 'src/modules/user/dtos';
import { MessageService } from 'src/modules/message/services';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { TokenTransactionModel } from '../models';
import { PurchaseItemType } from '../constants';
import { PurchaseProductsPayload, SendTipsPayload } from '../payloads';
export declare class TokenTransactionService {
    private readonly TokenPaymentModel;
    private readonly queueEventService;
    private readonly socketUserService;
    private readonly videoService;
    private readonly productService;
    private readonly galleryService;
    private readonly performerService;
    private readonly feedService;
    private readonly streamService;
    private readonly messageService;
    constructor(TokenPaymentModel: Model<TokenTransactionModel>, queueEventService: QueueEventService, socketUserService: SocketUserService, videoService: VideoService, productService: ProductService, galleryService: GalleryService, performerService: PerformerService, feedService: FeedService, streamService: StreamService, messageService: MessageService);
    findById(id: string | Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    checkBought(item: any, type: PurchaseItemType, user: UserDto): Promise<boolean>;
    purchaseProduct(id: string, user: PerformerDto, payload: PurchaseProductsPayload): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    createPaymentTokenProduct(products: any[], totalPrice: number, user: PerformerDto): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    purchaseStream(streamId: string, user: UserDto): Promise<(import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>) | {
        success: boolean;
    }>;
    createPaymentTokenStream(stream: StreamModel, purchaseItemType: string, performer: any, user: UserDto): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    purchaseVideo(id: string, user: PerformerDto): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    createPaymentTokenVideo(video: VideoDto, user: PerformerDto): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    purchaseGallery(id: string | Types.ObjectId, user: PerformerDto): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    createPaymentTokenPhotoGallery(gallery: GalleryDto, user: PerformerDto): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    sendTips(user: UserDto, performerId: string, payload: SendTipsPayload): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    purchasePostFeed(id: string | Types.ObjectId, user: PerformerDto): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    createPaymentTokenFeed(feed: FeedDto, user: PerformerDto): Promise<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    findOne(filter: any): import("mongoose").Query<import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>, import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: Types.ObjectId;
    }, never>, {}, TokenTransactionModel, "findOne">;
}
