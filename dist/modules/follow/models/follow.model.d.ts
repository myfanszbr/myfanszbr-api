import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class FollowModel extends Document {
    followerId: Types.ObjectId;
    followingId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
