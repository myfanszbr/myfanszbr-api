import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class NotificationMessageModel extends Document {
    conversationId: Types.ObjectId;
    totalNotReadMessage: number;
    recipientId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
