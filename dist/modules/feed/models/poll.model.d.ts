import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class PollModel extends Document {
    description: string;
    createdBy: Types.ObjectId;
    fromRef: string;
    refId: Types.ObjectId;
    totalVote?: number;
    expiredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
