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
import { CouponDto } from "src/modules/coupon/dtos";
import { QueueEventService } from "src/kernel";
import { Model, Types } from "mongoose";
import { CouponService } from "src/modules/coupon/services";
import { SettingService } from "src/modules/settings";
import { PerformerDto } from "src/modules/performer/dtos";
import { PerformerService } from "src/modules/performer/services";
import { SubscriptionService } from "src/modules/subscription/services/subscription.service";
import { UserDto } from "src/modules/user/dtos";
import { SocketUserService } from "src/modules/socket/services/socket-user.service";
import { UserService } from "src/modules/user/services";
import { MailerService } from "src/modules/mailer";
import { PaymentTransactionModel } from "../models";
import { PurchaseTokenPayload, SubscribePerformerPayload } from "../payloads";
import { CCBillService } from "./ccbill.service";
import { StripeService } from "./stripe.service";
import { Pay2mService } from "./pay2m.service";
export declare class PaymentService {
    private readonly subscriptionService;
    private readonly performerService;
    private readonly userService;
    private readonly couponService;
    private readonly TransactionModel;
    private readonly ccbillService;
    private readonly pay2mService;
    private readonly stripeService;
    private readonly queueEventService;
    private readonly settingService;
    private readonly socketUserService;
    private readonly mailerService;
    constructor(subscriptionService: SubscriptionService, performerService: PerformerService, userService: UserService, couponService: CouponService, TransactionModel: Model<PaymentTransactionModel>, ccbillService: CCBillService, pay2mService: Pay2mService, stripeService: StripeService, queueEventService: QueueEventService, settingService: SettingService, socketUserService: SocketUserService, mailerService: MailerService);
    findById(id: string | Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, PaymentTransactionModel> & Omit<PaymentTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    private getCCbillPaymentGatewaySettings;
    createSubscriptionPaymentTransaction(performer: PerformerDto, subscriptionType: string, user: UserDto, paymentGateway?: string, couponInfo?: any): Promise<import("mongoose").Document<unknown, {}, PaymentTransactionModel> & Omit<PaymentTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    subscribePerformer(payload: SubscribePerformerPayload, user: UserDto): Promise<import("../dtos").IPaymentResponse | {
        paymentUrl: string;
    }>;
    createTokenPaymentTransaction(products: any[], paymentGateway: string, totalPrice: number, user: UserDto, couponInfo?: CouponDto): Promise<import("mongoose").Document<unknown, {}, PaymentTransactionModel> & Omit<PaymentTransactionModel & {
        _id: Types.ObjectId;
    }, never>>;
    buyTokens(payload: PurchaseTokenPayload, user: UserDto): Promise<import("../dtos").IPaymentResponse | {
        paymentUrl: string;
    }>;
    ccbillCancelSubscription(id: any, user: UserDto): Promise<{
        success: boolean;
    }>;
    stripeCancelSubscription(id: any, user: UserDto): Promise<{
        success: boolean;
    }>;
    systemCancelSubscription(id: any, user: UserDto): Promise<{
        success: boolean;
    }>;
    private cancelSubscriptionMailer;
}
