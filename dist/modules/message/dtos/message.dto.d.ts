import { Types } from 'mongoose';
export declare class MessageDto {
    _id: Types.ObjectId;
    conversationId: Types.ObjectId;
    type: string;
    fileId: Types.ObjectId;
    fileIds: Types.ObjectId[];
    files: any;
    text: string;
    senderId: Types.ObjectId;
    meta: any;
    createdAt: Date;
    updatedAt: Date;
    fileUrl?: string;
    senderInfo?: any;
    constructor(data?: Partial<MessageDto>);
}
