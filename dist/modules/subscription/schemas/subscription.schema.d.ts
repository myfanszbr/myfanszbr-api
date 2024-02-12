import * as mongoose from 'mongoose';
export declare const SubscriptionSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    updatedAt: Date;
    createdAt: Date;
    status: string;
    paymentGateway: string;
    subscriptionType: string;
    startRecurringDate: Date;
    expiredAt: Date;
    usedFreeSubscription: boolean;
    performerId?: mongoose.Types.ObjectId;
    meta?: any;
    userId?: mongoose.Types.ObjectId;
    subscriptionId?: string;
    transactionId?: mongoose.Types.ObjectId;
    nextRecurringDate?: Date;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    updatedAt: Date;
    createdAt: Date;
    status: string;
    paymentGateway: string;
    subscriptionType: string;
    startRecurringDate: Date;
    expiredAt: Date;
    usedFreeSubscription: boolean;
    performerId?: mongoose.Types.ObjectId;
    meta?: any;
    userId?: mongoose.Types.ObjectId;
    subscriptionId?: string;
    transactionId?: mongoose.Types.ObjectId;
    nextRecurringDate?: Date;
}>> & Omit<mongoose.FlatRecord<{
    updatedAt: Date;
    createdAt: Date;
    status: string;
    paymentGateway: string;
    subscriptionType: string;
    startRecurringDate: Date;
    expiredAt: Date;
    usedFreeSubscription: boolean;
    performerId?: mongoose.Types.ObjectId;
    meta?: any;
    userId?: mongoose.Types.ObjectId;
    subscriptionId?: string;
    transactionId?: mongoose.Types.ObjectId;
    nextRecurringDate?: Date;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
