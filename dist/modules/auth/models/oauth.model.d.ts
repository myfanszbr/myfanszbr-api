import { Types } from 'mongoose';
import { Document } from 'mongoose';
export declare class OAuthLoginModel extends Document {
    source: string;
    sourceId: Types.ObjectId;
    provider: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
}
