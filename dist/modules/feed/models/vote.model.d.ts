import { Document, Types } from 'mongoose';
export declare class VoteModel extends Document {
    fromSourceId: Types.ObjectId;
    fromSource: string;
    targetId: Types.ObjectId;
    targetSource: string;
    refId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
