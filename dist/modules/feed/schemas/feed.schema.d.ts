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
import { Schema } from 'mongoose';
export declare const FeedSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
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
}, never>>;
