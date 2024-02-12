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
import { QueueEventService } from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { PerformerService } from 'src/modules/performer/services';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { UserDto } from 'src/modules/user/dtos';
import { TokenTransactionService } from 'src/modules/token-transaction/services';
import { ProductDto } from '../dtos';
import { ProductCreatePayload, ProductUpdatePayload } from '../payloads';
import { ProductModel } from '../models';
export declare const PERFORMER_PRODUCT_CHANNEL = "PERFORMER_PRODUCT_CHANNEL";
export declare class ProductService {
    private readonly performerService;
    private readonly reactionService;
    private readonly tokenTransactionService;
    private readonly productModel;
    private readonly fileService;
    private readonly queueEventService;
    constructor(performerService: PerformerService, reactionService: ReactionService, tokenTransactionService: TokenTransactionService, productModel: Model<ProductModel>, fileService: FileService, queueEventService: QueueEventService);
    findByIds(ids: any): Promise<ProductDto[]>;
    findById(id: string | Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, ProductModel> & Omit<ProductModel & {
        _id: Types.ObjectId;
    }, never>>;
    create(payload: ProductCreatePayload, digitalFile: FileDto, imageFile: FileDto, creator?: UserDto): Promise<ProductDto>;
    update(id: string | Types.ObjectId, payload: ProductUpdatePayload, digitalFile: FileDto, imageFile: FileDto, updater?: UserDto): Promise<ProductDto>;
    delete(id: string | Types.ObjectId, user: UserDto): Promise<boolean>;
    getDetails(id: string, user: UserDto, jwToken: string): Promise<ProductDto>;
    userGetDetails(id: string, user: UserDto): Promise<ProductDto>;
    updateStock(id: string | Types.ObjectId, num?: number): Promise<void>;
    updateCommentStats(id: string | Types.ObjectId, num?: number): Promise<void>;
    updateLikeStats(id: string | Types.ObjectId, num?: number): Promise<void>;
    updateBookmarkStats(id: string | Types.ObjectId, num?: number): Promise<void>;
    generateDownloadLink(productId: string, user: UserDto, jwToken: string): Promise<string>;
    checkAuth(req: any, user: UserDto): Promise<boolean>;
}
