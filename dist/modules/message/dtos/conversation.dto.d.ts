import { Types } from 'mongoose';
import { IRecipient } from '../models';
export declare class ConversationDto {
    _id: Types.ObjectId;
    type: string;
    name: string;
    recipients: IRecipient[];
    lastMessage: string;
    lastSenderId: Types.ObjectId;
    lastMessageCreatedAt: Date;
    meta: any;
    createdAt: Date;
    updatedAt: Date;
    recipientInfo: any;
    totalNotSeenMessages: number;
    isSubscribed: boolean;
    isBlocked: boolean;
    streamId: Types.ObjectId;
    performerId: Types.ObjectId;
    constructor(data: Partial<ConversationDto>);
    getRoomName(): string;
}
