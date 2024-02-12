import * as mongoose from 'mongoose';
export declare const FollowSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    updatedAt: Date;
    createdAt: Date;
    followerId?: mongoose.Types.ObjectId;
    followingId?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    updatedAt: Date;
    createdAt: Date;
    followerId?: mongoose.Types.ObjectId;
    followingId?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    updatedAt: Date;
    createdAt: Date;
    followerId?: mongoose.Types.ObjectId;
    followingId?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
