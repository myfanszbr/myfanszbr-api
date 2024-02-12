import * as mongoose from 'mongoose';
export declare const AuthSessionSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    source: string;
    createdAt: Date;
    expiryAt: Date;
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
    source: string;
    createdAt: Date;
    expiryAt: Date;
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
    source: string;
    createdAt: Date;
    expiryAt: Date;
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
