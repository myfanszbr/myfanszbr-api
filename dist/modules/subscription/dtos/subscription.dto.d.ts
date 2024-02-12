import { Types } from 'mongoose';
export declare class SubscriptionDto {
    _id: Types.ObjectId;
    subscriptionType: string;
    userId: Types.ObjectId;
    performerId: Types.ObjectId;
    subscriptionId: string;
    transactionId: Types.ObjectId;
    paymentGateway: string;
    status: string;
    meta: any;
    startRecurringDate: Date;
    nextRecurringDate: Date;
    createdAt: Date;
    updatedAt: Date;
    expiredAt: Date;
    userInfo: any;
    performerInfo: any;
    constructor(data: Partial<SubscriptionDto>);
    toResponse(includePrivateInfo?: boolean): {
        _id: Types.ObjectId;
        subscriptionType: string;
        userId: Types.ObjectId;
        userInfo: any;
        performerId: Types.ObjectId;
        performerInfo: any;
        status: string;
        expiredAt: Date;
        startRecurringDate: Date;
        nextRecurringDate: Date;
        paymentGateway: string;
    };
}
