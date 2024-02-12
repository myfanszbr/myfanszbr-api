import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class StreamModel extends Document {
    performerId: Types.ObjectId;
    title: string;
    description: string;
    type: string;
    sessionId: string;
    isStreaming: number;
    streamingTime: number;
    lastStreamingTime: Date;
    isFree: boolean;
    price: number;
    stats: {
        members: number;
        likes: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
