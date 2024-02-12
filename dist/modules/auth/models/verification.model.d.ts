import { Types } from 'mongoose';
import { Document } from 'mongoose';
export declare class VerificationModel extends Document {
    sourceType: string;
    sourceId: Types.ObjectId;
    type: string;
    value: string;
    token: string;
    verified: boolean;
    createAt: Date;
    updatedAt: Date;
}
