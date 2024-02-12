/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Connection } from 'mongoose';
export declare const FEED_PROVIDER = "FEED_PROVIDER";
export declare const POLL_PROVIDER = "POLL_PROVIDER";
export declare const VOTE_PROVIDER = "VOTE_PROVIDER";
export declare const SCHEDULED_STREAM_NOTIFICATION_PROVIDER = "SCHEDULED_STREAM_NOTIFICATION_PROVIDER";
export declare const feedProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        status: string;
        isSale: boolean;
        price: number;
        isSchedule: boolean;
        fileIds: import("mongoose").Types.ObjectId[];
        pollIds: import("mongoose").Types.ObjectId[];
        pollExpiredAt: Date;
        totalLike: number;
        totalComment: number;
        isPinned: boolean;
        scheduleAt: Date;
        type?: string;
        text?: string;
        slug?: string;
        title?: string;
        thumbnailId?: import("mongoose").Types.ObjectId;
        teaserId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        pollDescription?: string;
        pinnedAt?: Date;
        streamingScheduled?: Date;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        status: string;
        isSale: boolean;
        price: number;
        isSchedule: boolean;
        fileIds: import("mongoose").Types.ObjectId[];
        pollIds: import("mongoose").Types.ObjectId[];
        pollExpiredAt: Date;
        totalLike: number;
        totalComment: number;
        isPinned: boolean;
        scheduleAt: Date;
        type?: string;
        text?: string;
        slug?: string;
        title?: string;
        thumbnailId?: import("mongoose").Types.ObjectId;
        teaserId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        pollDescription?: string;
        pinnedAt?: Date;
        streamingScheduled?: Date;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        status: string;
        isSale: boolean;
        price: number;
        isSchedule: boolean;
        fileIds: import("mongoose").Types.ObjectId[];
        pollIds: import("mongoose").Types.ObjectId[];
        pollExpiredAt: Date;
        totalLike: number;
        totalComment: number;
        isPinned: boolean;
        scheduleAt: Date;
        type?: string;
        text?: string;
        slug?: string;
        title?: string;
        thumbnailId?: import("mongoose").Types.ObjectId;
        teaserId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        pollDescription?: string;
        pinnedAt?: Date;
        streamingScheduled?: Date;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        status: string;
        isSale: boolean;
        price: number;
        isSchedule: boolean;
        fileIds: import("mongoose").Types.ObjectId[];
        pollIds: import("mongoose").Types.ObjectId[];
        pollExpiredAt: Date;
        totalLike: number;
        totalComment: number;
        isPinned: boolean;
        scheduleAt: Date;
        type?: string;
        text?: string;
        slug?: string;
        title?: string;
        thumbnailId?: import("mongoose").Types.ObjectId;
        teaserId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        pollDescription?: string;
        pinnedAt?: Date;
        streamingScheduled?: Date;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        status: string;
        isSale: boolean;
        price: number;
        isSchedule: boolean;
        fileIds: import("mongoose").Types.ObjectId[];
        pollIds: import("mongoose").Types.ObjectId[];
        pollExpiredAt: Date;
        totalLike: number;
        totalComment: number;
        isPinned: boolean;
        scheduleAt: Date;
        type?: string;
        text?: string;
        slug?: string;
        title?: string;
        thumbnailId?: import("mongoose").Types.ObjectId;
        teaserId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        pollDescription?: string;
        pinnedAt?: Date;
        streamingScheduled?: Date;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        status: string;
        isSale: boolean;
        price: number;
        isSchedule: boolean;
        fileIds: import("mongoose").Types.ObjectId[];
        pollIds: import("mongoose").Types.ObjectId[];
        pollExpiredAt: Date;
        totalLike: number;
        totalComment: number;
        isPinned: boolean;
        scheduleAt: Date;
        type?: string;
        text?: string;
        slug?: string;
        title?: string;
        thumbnailId?: import("mongoose").Types.ObjectId;
        teaserId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        pollDescription?: string;
        pinnedAt?: Date;
        streamingScheduled?: Date;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
}[];
export declare const pollProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        expiredAt: Date;
        totalVote: number;
        description?: string;
        createdBy?: import("mongoose").Types.ObjectId;
        fromRef?: string;
        refId?: import("mongoose").Types.ObjectId;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        expiredAt: Date;
        totalVote: number;
        description?: string;
        createdBy?: import("mongoose").Types.ObjectId;
        fromRef?: string;
        refId?: import("mongoose").Types.ObjectId;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        expiredAt: Date;
        totalVote: number;
        description?: string;
        createdBy?: import("mongoose").Types.ObjectId;
        fromRef?: string;
        refId?: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        expiredAt: Date;
        totalVote: number;
        description?: string;
        createdBy?: import("mongoose").Types.ObjectId;
        fromRef?: string;
        refId?: import("mongoose").Types.ObjectId;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        expiredAt: Date;
        totalVote: number;
        description?: string;
        createdBy?: import("mongoose").Types.ObjectId;
        fromRef?: string;
        refId?: import("mongoose").Types.ObjectId;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        expiredAt: Date;
        totalVote: number;
        description?: string;
        createdBy?: import("mongoose").Types.ObjectId;
        fromRef?: string;
        refId?: import("mongoose").Types.ObjectId;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
}[];
export declare const voteProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        targetId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        targetSource?: string;
        refId?: import("mongoose").Types.ObjectId;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        targetId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        targetSource?: string;
        refId?: import("mongoose").Types.ObjectId;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        targetId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        targetSource?: string;
        refId?: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        targetId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        targetSource?: string;
        refId?: import("mongoose").Types.ObjectId;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        targetId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        targetSource?: string;
        refId?: import("mongoose").Types.ObjectId;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        targetId?: import("mongoose").Types.ObjectId;
        fromSourceId?: import("mongoose").Types.ObjectId;
        fromSource?: string;
        targetSource?: string;
        refId?: import("mongoose").Types.ObjectId;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
}[];
export declare const scheduledStreamNotificationProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        notified: boolean;
        performerId?: import("mongoose").Types.ObjectId;
        scheduledAt?: Date;
        feedId?: import("mongoose").Types.ObjectId;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        notified: boolean;
        performerId?: import("mongoose").Types.ObjectId;
        scheduledAt?: Date;
        feedId?: import("mongoose").Types.ObjectId;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        notified: boolean;
        performerId?: import("mongoose").Types.ObjectId;
        scheduledAt?: Date;
        feedId?: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
        collection: string;
    }, {
        updatedAt: Date;
        createdAt: Date;
        notified: boolean;
        performerId?: import("mongoose").Types.ObjectId;
        scheduledAt?: Date;
        feedId?: import("mongoose").Types.ObjectId;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        notified: boolean;
        performerId?: import("mongoose").Types.ObjectId;
        scheduledAt?: Date;
        feedId?: import("mongoose").Types.ObjectId;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        notified: boolean;
        performerId?: import("mongoose").Types.ObjectId;
        scheduledAt?: Date;
        feedId?: import("mongoose").Types.ObjectId;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
}[];
