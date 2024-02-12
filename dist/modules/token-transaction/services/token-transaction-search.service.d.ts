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
import { PerformerService } from 'src/modules/performer/services';
import { Model } from 'mongoose';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserService } from 'src/modules/user/services';
import { TokenTransactionModel } from '../models';
import { PaymentTokenSearchPayload } from '../payloads';
export declare class TokenTransactionSearchService {
    private readonly userService;
    private readonly performerService;
    private readonly paymentTokenModel;
    constructor(userService: UserService, performerService: PerformerService, paymentTokenModel: Model<TokenTransactionModel>);
    getUserTransactionsToken(req: PaymentTokenSearchPayload, user: PerformerDto): Promise<{
        total: number;
        data: any[];
    }>;
    adminGetUserTransactionsToken(req: PaymentTokenSearchPayload): Promise<{
        total: number;
        data: any[];
    }>;
    findByQuery(query: any): Promise<(import("mongoose").Document<unknown, {}, TokenTransactionModel> & Omit<TokenTransactionModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
}
