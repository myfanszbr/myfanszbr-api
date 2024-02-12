import * as mongoose from 'mongoose';
export declare const HttpExceptionLogSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    createdAt: Date;
    path?: string;
    error?: any;
    query?: any;
    ip?: string;
    body?: any;
    headers?: any;
    authData?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: Date;
    path?: string;
    error?: any;
    query?: any;
    ip?: string;
    body?: any;
    headers?: any;
    authData?: any;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: Date;
    path?: string;
    error?: any;
    query?: any;
    ip?: string;
    body?: any;
    headers?: any;
    authData?: any;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
