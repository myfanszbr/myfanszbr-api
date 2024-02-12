import { Types } from 'mongoose';
import { Document } from 'mongoose';
export declare class AuthModel extends Document {
    source: string;
    sourceId: Types.ObjectId;
    type: string;
    key: string;
    value: string;
    salt: string;
    createdAt: Date;
    updatedAt: Date;
}
