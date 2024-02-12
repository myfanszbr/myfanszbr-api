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
import { Model } from 'mongoose';
import { PerformerService } from 'src/modules/performer/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { UserService } from 'src/modules/user/services';
import { SubscriptionModel } from 'src/modules/subscription/models/subscription.model';
import { PaymentTransactionModel } from '../models';
export declare class WebhooksPaymentService {
    private readonly subscriptionService;
    private readonly performerService;
    private readonly userService;
    private readonly TransactionModel;
    private readonly queueEventService;
    private readonly socketUserService;
    constructor(subscriptionService: SubscriptionService, performerService: PerformerService, userService: UserService, TransactionModel: Model<PaymentTransactionModel>, queueEventService: QueueEventService, socketUserService: SocketUserService);
    ccbillSinglePaymentSuccessWebhook(payload: Record<string, any>): Promise<{
        ok: boolean;
    }>;
    ccbillRenewalSuccessWebhook(payload: any): Promise<{
        ok: boolean;
    }>;
    ccbillUserReactivation(payload: any): Promise<void>;
    createCCbillRenewalSubscriptionPaymentTransaction(subscription: SubscriptionModel, payload: any): Promise<import("mongoose").Document<unknown, {}, PaymentTransactionModel> & Omit<PaymentTransactionModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    private createRenewalSubscription;
    stripeSubscriptionWebhook(payload: Record<string, any>): Promise<{
        success: boolean;
    }>;
    stripePaymentWebhook(payload: Record<string, any>): Promise<{
        ok: boolean;
        success?: undefined;
    } | {
        success: boolean;
        ok?: undefined;
    }>;
}
