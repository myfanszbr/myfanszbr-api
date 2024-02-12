import { Document } from 'mongoose';
import { Types } from 'mongoose';

export class FollowModel extends Document {
  followerId: Types.ObjectId;

  followingId: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
