import * as mongoose from 'mongoose';
export declare const CommentSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    updatedAt: Date;
    createdAt: Date;
    totalLike: number;
    objectType: string;
    totalReply: number;
    createdBy?: mongoose.Types.ObjectId;
    content?: string;
    objectId?: mongoose.Types.ObjectId;
    recipientId?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    updatedAt: Date;
    createdAt: Date;
    totalLike: number;
    objectType: string;
    totalReply: number;
    createdBy?: mongoose.Types.ObjectId;
    content?: string;
    objectId?: mongoose.Types.ObjectId;
    recipientId?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    updatedAt: Date;
    createdAt: Date;
    totalLike: number;
    objectType: string;
    totalReply: number;
    createdBy?: mongoose.Types.ObjectId;
    content?: string;
    objectId?: mongoose.Types.ObjectId;
    recipientId?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
