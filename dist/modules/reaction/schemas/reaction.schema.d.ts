import * as mongoose from 'mongoose';
export declare const ReactSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    updatedAt: Date;
    createdAt: Date;
    action: string;
    objectType: string;
    createdBy?: mongoose.Types.ObjectId;
    objectId?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    updatedAt: Date;
    createdAt: Date;
    action: string;
    objectType: string;
    createdBy?: mongoose.Types.ObjectId;
    objectId?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    updatedAt: Date;
    createdAt: Date;
    action: string;
    objectType: string;
    createdBy?: mongoose.Types.ObjectId;
    objectId?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
