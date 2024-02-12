import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class SubscriptionModel extends Document {
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
    usedFreeSubscription: boolean;
}
