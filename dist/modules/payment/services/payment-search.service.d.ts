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
import { PaymentTransactionModel } from '../models';
import { PaymentSearchPayload } from '../payloads';
export declare class PaymentSearchService {
    private readonly userService;
    private readonly performerService;
    private readonly paymentTransactionModel;
    constructor(userService: UserService, performerService: PerformerService, paymentTransactionModel: Model<PaymentTransactionModel>);
    getUserTransactions(req: PaymentSearchPayload, user: PerformerDto): Promise<{
        data: import("../dtos").IPaymentResponse[];
        total: number;
    }>;
    adminGetUserTransactions(req: PaymentSearchPayload): Promise<{
        data: import("../dtos").IPaymentResponse[];
        total: number;
    }>;
    findByQuery(query: any): Promise<(import("mongoose").Document<unknown, {}, PaymentTransactionModel> & Omit<PaymentTransactionModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
}
