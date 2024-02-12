import { Types } from 'mongoose';
export declare type StreamType = 'public' | 'group' | 'private';
export declare class StreamDto {
    _id: Types.ObjectId;
    performerId: Types.ObjectId;
    performerInfo: any;
    title: string;
    description: string;
    type: string;
    sessionId: string;
    isStreaming: number;
    streamingTime: number;
    lastStreamingTime: Date;
    isFree: boolean;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    conversationId: Types.ObjectId;
    stats: {
        members: number;
        likes: number;
    };
    isSubscribed: boolean;
    hasPurchased: boolean;
    constructor(data: Partial<any>);
    toResponse(includePrivateInfo?: boolean): {
        _id: Types.ObjectId;
        title: string;
        description: string;
        isStreaming: number;
        isFree: boolean;
        price: number;
        performerId: Types.ObjectId;
        performerInfo: any;
        type: string;
        sessionId: string;
        stats: {
            members: number;
            likes: number;
        };
        createdAt: Date;
        updatedAt: Date;
        isSubscribed: boolean;
        conversationId: Types.ObjectId;
        hasPurchased: boolean;
    } | {
        streamingTime: number;
        lastStreamingTime: Date;
        _id: Types.ObjectId;
        title: string;
        description: string;
        isStreaming: number;
        isFree: boolean;
        price: number;
        performerId: Types.ObjectId;
        performerInfo: any;
        type: string;
        sessionId: string;
        stats: {
            members: number;
            likes: number;
        };
        createdAt: Date;
        updatedAt: Date;
        isSubscribed: boolean;
        conversationId: Types.ObjectId;
        hasPurchased: boolean;
    };
}
