import { Types } from 'mongoose';
export declare class MessageCreatePayload {
    type: string;
    text: string;
    fileIds: Types.ObjectId[];
}
