import * as mongoose from 'mongoose';
export declare const AuthSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    updatedAt: Date;
    source: string;
    type: string;
    createdAt: Date;
    key?: string;
    value?: string;
    salt?: string;
    sourceId?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    updatedAt: Date;
    source: string;
    type: string;
    createdAt: Date;
    key?: string;
    value?: string;
    salt?: string;
    sourceId?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
}>> & Omit<mongoose.FlatRecord<{
    updatedAt: Date;
    source: string;
    type: string;
    createdAt: Date;
    key?: string;
    value?: string;
    salt?: string;
    sourceId?: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
