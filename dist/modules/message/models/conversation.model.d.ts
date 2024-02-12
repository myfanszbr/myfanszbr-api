import { Document } from 'mongoose';
import { Types } from 'mongoose';
export interface IRecipient {
    source: string;
    sourceId: Types.ObjectId;
}
export declare class ConversationModel extends Document {
    type?: string;
    name?: string;
    lastMessage?: string;
    lastSenderId?: Types.ObjectId;
    recipients?: IRecipient[];
    meta?: any;
    createdAt?: Date;
    updatedAt?: Date;
    streamId?: Types.ObjectId;
    performerId?: Types.ObjectId;
}
