import { Types } from 'mongoose';
import { Document } from 'mongoose';
export declare class ForgotModel extends Document {
    authId: Types.ObjectId;
    sourceId: Types.ObjectId;
    source: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}
