import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class ReactionModel extends Document {
    objectId: Types.ObjectId;
    action?: string;
    creator?: any;
    objectType?: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
