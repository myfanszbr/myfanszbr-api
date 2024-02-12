import * as mongoose from 'mongoose';
export declare const EarningSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: Date;
    grossPrice: number;
    netPrice: number;
    siteCommission: number;
    isPaid: boolean;
    isToken: boolean;
    type?: string;
    sourceType?: string;
    performerId?: mongoose.Types.ObjectId;
    paymentGateway?: string;
    userId?: mongoose.Types.ObjectId;
    transactionId?: mongoose.Types.ObjectId;
    paidAt?: Date;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: Date;
    grossPrice: number;
    netPrice: number;
    siteCommission: number;
    isPaid: boolean;
    isToken: boolean;
    type?: string;
    sourceType?: string;
    performerId?: mongoose.Types.ObjectId;
    paymentGateway?: string;
    userId?: mongoose.Types.ObjectId;
    transactionId?: mongoose.Types.ObjectId;
    paidAt?: Date;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: Date;
    grossPrice: number;
    netPrice: number;
    siteCommission: number;
    isPaid: boolean;
    isToken: boolean;
    type?: string;
    sourceType?: string;
    performerId?: mongoose.Types.ObjectId;
    paymentGateway?: string;
    userId?: mongoose.Types.ObjectId;
    transactionId?: mongoose.Types.ObjectId;
    paidAt?: Date;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
