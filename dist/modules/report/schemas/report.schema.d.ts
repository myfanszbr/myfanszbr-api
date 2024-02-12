import * as mongoose from 'mongoose';
export declare const ReportSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    updatedAt: Date;
    source: string;
    createdAt: Date;
    target: string;
    sourceId?: mongoose.Types.ObjectId;
    description?: string;
    performerId?: mongoose.Types.ObjectId;
    title?: string;
    targetId?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    updatedAt: Date;
    source: string;
    createdAt: Date;
    target: string;
    sourceId?: mongoose.Types.ObjectId;
    description?: string;
    performerId?: mongoose.Types.ObjectId;
    title?: string;
    targetId?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    updatedAt: Date;
    source: string;
    createdAt: Date;
    target: string;
    sourceId?: mongoose.Types.ObjectId;
    description?: string;
    performerId?: mongoose.Types.ObjectId;
    title?: string;
    targetId?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
