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
import { Model } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { PaymentCustomerModel, PaymentCardModel } from '../models';
import { StripeService } from './stripe.service';
export declare class CustomerCardService {
    private readonly stripeService;
    private readonly paymentCustomerModel;
    private readonly paymentCardModel;
    constructor(stripeService: StripeService, paymentCustomerModel: Model<PaymentCustomerModel>, paymentCardModel: Model<PaymentCardModel>);
    findOneCustomer(query: any): import("mongoose").Query<import("mongoose").Document<unknown, {}, PaymentCustomerModel> & Omit<PaymentCustomerModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Document<unknown, {}, PaymentCustomerModel> & Omit<PaymentCustomerModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, {}, PaymentCustomerModel, "findOne">;
    retrieveCustomer(query: any): import("mongoose").Query<import("mongoose").Document<unknown, {}, PaymentCustomerModel> & Omit<PaymentCustomerModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Document<unknown, {}, PaymentCustomerModel> & Omit<PaymentCustomerModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, {}, PaymentCustomerModel, "findOne">;
    createCustomer(payload: any): Promise<import("mongoose").Document<unknown, {}, PaymentCustomerModel> & Omit<PaymentCustomerModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    findOneCard(query: any): import("mongoose").Query<import("mongoose").Document<unknown, {}, PaymentCardModel> & Omit<PaymentCardModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Document<unknown, {}, PaymentCardModel> & Omit<PaymentCardModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, {}, PaymentCardModel, "findOne">;
    updateOneCard(query: any, payload: any): Promise<void>;
    retrieveCard(query: any): import("mongoose").Query<import("mongoose").Document<unknown, {}, PaymentCardModel> & Omit<PaymentCardModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Document<unknown, {}, PaymentCardModel> & Omit<PaymentCardModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, {}, PaymentCardModel, "findOne">;
    createCard(payload: any): Promise<import("mongoose").Document<unknown, {}, PaymentCardModel> & Omit<PaymentCardModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    deleteCard(id: string, user: UserDto): Promise<{
        deleted: boolean;
    }>;
    findCards(req: any, user: UserDto): Promise<{
        data: (import("mongoose").FlattenMaps<PaymentCardModel> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
    }>;
}
