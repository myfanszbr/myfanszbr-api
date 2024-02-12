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
import { PageableData } from 'src/kernel';
import { UserService, UserSearchService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import { PaymentDto } from 'src/modules/payment/dtos';
import { SubscriptionModel } from '../models/subscription.model';
import { SubscriptionCreatePayload, SubscriptionSearchRequestPayload, SubscriptionUpdatePayload } from '../payloads';
import { SubscriptionDto } from '../dtos/subscription.dto';
export declare class SubscriptionService {
    private readonly userSearchService;
    private readonly performerService;
    private readonly userService;
    private readonly subscriptionModel;
    constructor(userSearchService: UserSearchService, performerService: PerformerService, userService: UserService, subscriptionModel: Model<SubscriptionModel>);
    updateSubscriptionId(transaction: PaymentDto, subscriptionId: string): Promise<void>;
    findBySubscriptionId(subscriptionId: string): Promise<import("mongoose").Document<unknown, {}, SubscriptionModel> & Omit<SubscriptionModel & {
        _id: Types.ObjectId;
    }, never>>;
    findSubscriptionList(query: any): Promise<(import("mongoose").Document<unknown, {}, SubscriptionModel> & Omit<SubscriptionModel & {
        _id: Types.ObjectId;
    }, never>)[]>;
    adminCreate(data: SubscriptionCreatePayload): Promise<SubscriptionDto>;
    adminUpdate(subscriptionId: string, data: SubscriptionUpdatePayload): Promise<SubscriptionDto>;
    adminSearch(req: SubscriptionSearchRequestPayload): Promise<PageableData<SubscriptionDto>>;
    performerSearch(req: SubscriptionSearchRequestPayload, user: UserDto): Promise<PageableData<SubscriptionDto>>;
    userSearch(req: SubscriptionSearchRequestPayload, user: UserDto): Promise<PageableData<SubscriptionDto>>;
    checkSubscribed(performerId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<any>;
    findOneSubscription(payload: any): Promise<import("mongoose").Document<unknown, {}, SubscriptionModel> & Omit<SubscriptionModel & {
        _id: Types.ObjectId;
    }, never>>;
    performerTotalSubscriptions(performerId: string | Types.ObjectId): Promise<number>;
    findById(id: string | Types.ObjectId): Promise<SubscriptionModel>;
    adminUpdateUserStats(): Promise<any>;
}
