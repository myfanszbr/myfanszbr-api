import * as mongoose from 'mongoose';
export declare const VerificationSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    updatedAt: Date;
    type: string;
    createdAt: Date;
    sourceType: string;
    verified: boolean;
    value?: string;
    sourceId?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    token?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    updatedAt: Date;
    type: string;
    createdAt: Date;
    sourceType: string;
    verified: boolean;
    value?: string;
    sourceId?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    token?: string;
}>> & Omit<mongoose.FlatRecord<{
    updatedAt: Date;
    type: string;
    createdAt: Date;
    sourceType: string;
    verified: boolean;
    value?: string;
    sourceId?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    token?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
