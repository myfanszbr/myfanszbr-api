import * as mongoose from 'mongoose';
export declare const HttpExceptionLogModel: mongoose.Model<{
    createdAt: Date;
    path?: string;
    error?: any;
    query?: any;
    ip?: string;
    body?: any;
    headers?: any;
    authData?: any;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: Date;
    path?: string;
    error?: any;
    query?: any;
    ip?: string;
    body?: any;
    headers?: any;
    authData?: any;
}> & Omit<{
    createdAt: Date;
    path?: string;
    error?: any;
    query?: any;
    ip?: string;
    body?: any;
    headers?: any;
    authData?: any;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
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
}, never>>>;
