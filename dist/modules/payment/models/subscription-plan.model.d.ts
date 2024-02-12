import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class SubscriptionPlanModel extends Document {
    performerId: Types.ObjectId;
    paymentGateway: string;
    subscriptionType: string;
    price: number;
    planId: string;
    metaData: any;
    createdAt: Date;
    updatedAt: Date;
}
