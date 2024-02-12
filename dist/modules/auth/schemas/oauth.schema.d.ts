import * as mongoose from 'mongoose';
export declare const OAuthLoginSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    updatedAt: Date;
    source: string;
    createdAt: Date;
    value?: any;
    sourceId?: mongoose.Types.ObjectId;
    provider?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    updatedAt: Date;
    source: string;
    createdAt: Date;
    value?: any;
    sourceId?: mongoose.Types.ObjectId;
    provider?: string;
}>> & Omit<mongoose.FlatRecord<{
    updatedAt: Date;
    source: string;
    createdAt: Date;
    value?: any;
    sourceId?: mongoose.Types.ObjectId;
    provider?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
