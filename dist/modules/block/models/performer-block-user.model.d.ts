import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class PerformerBlockUserModel extends Document {
    source: string;
    sourceId: Types.ObjectId;
    reason: string;
    target: string;
    targetId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
