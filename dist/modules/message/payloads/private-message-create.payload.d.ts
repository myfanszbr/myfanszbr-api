import { Types } from 'mongoose';
import { MessageCreatePayload } from './message-create.payload';
export declare class PrivateMessageCreatePayload extends MessageCreatePayload {
    recipientId: Types.ObjectId;
    recipientType: string;
}
