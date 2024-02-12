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
import Stripe from 'stripe';
import { SubscriptionModel } from 'src/modules/subscription/models/subscription.model';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PaymentTransactionModel } from '../models';
import { AuthoriseCardPayload } from '../payloads/authorise-card.payload';
import { SubscriptionPlanModel } from '../models/subscription-plan.model';
import { CustomerCardService } from './customer-card.service';
export declare class StripeService {
    private readonly customerCardService;
    private readonly subscriptionPlanModel;
    constructor(customerCardService: CustomerCardService, subscriptionPlanModel: Model<SubscriptionPlanModel>);
    private getCredentials;
    private checkProduction;
    private retrieveCustomer;
    authoriseCard(user: UserDto, payload: AuthoriseCardPayload): Promise<import("mongoose").Document<unknown, {}, import("../models").PaymentCardModel> & Omit<import("../models").PaymentCardModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    removeCard(user: UserDto, cardId: string): Promise<Stripe.Response<Stripe.CustomerSource | Stripe.DeletedBankAccount | Stripe.DeletedCard>>;
    getStripeProduct(performer: PerformerDto, type: string): Promise<import("mongoose").Document<unknown, {}, SubscriptionPlanModel> & Omit<SubscriptionPlanModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    createSubscriptionPlan(transaction: PaymentTransactionModel, performer: PerformerDto, user: UserDto, cardId: string): Promise<Stripe.Response<Stripe.Subscription>>;
    deleteSubscriptionPlan(subscription: SubscriptionModel): Promise<boolean>;
    createSingleCharge(payload: any): Promise<Stripe.Response<Stripe.PaymentIntent>>;
}
