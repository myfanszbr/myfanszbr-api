import { Types, Document } from 'mongoose';
export declare class AuthSessionModel extends Document {
    source: string;
    sourceId: Types.ObjectId;
    token: string;
    expiryAt: Date;
    createdAt: Date;
}
