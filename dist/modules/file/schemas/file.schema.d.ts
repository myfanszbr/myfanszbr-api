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
import { Schema, Types } from 'mongoose';
export declare const FileSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    server: string;
    updatedAt: Date;
    createdAt: Date;
    refItems: {
        _id?: unknown;
        itemId?: {
            prototype?: Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        itemType?: string;
    }[];
    path?: string;
    name?: string;
    type?: string;
    description?: string;
    error?: any;
    status?: string;
    createdBy?: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    updatedBy?: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    height?: number;
    acl?: string;
    mimeType?: string;
    absolutePath?: string;
    width?: number;
    duration?: number;
    size?: number;
    encoding?: string;
    thumbnails?: any;
    metadata?: any;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    server: string;
    updatedAt: Date;
    createdAt: Date;
    refItems: {
        _id?: unknown;
        itemId?: {
            prototype?: Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        itemType?: string;
    }[];
    path?: string;
    name?: string;
    type?: string;
    description?: string;
    error?: any;
    status?: string;
    createdBy?: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    updatedBy?: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    height?: number;
    acl?: string;
    mimeType?: string;
    absolutePath?: string;
    width?: number;
    duration?: number;
    size?: number;
    encoding?: string;
    thumbnails?: any;
    metadata?: any;
}>> & Omit<import("mongoose").FlatRecord<{
    server: string;
    updatedAt: Date;
    createdAt: Date;
    refItems: {
        _id?: unknown;
        itemId?: {
            prototype?: Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        itemType?: string;
    }[];
    path?: string;
    name?: string;
    type?: string;
    description?: string;
    error?: any;
    status?: string;
    createdBy?: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    updatedBy?: {
        prototype?: Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    height?: number;
    acl?: string;
    mimeType?: string;
    absolutePath?: string;
    width?: number;
    duration?: number;
    size?: number;
    encoding?: string;
    thumbnails?: any;
    metadata?: any;
}> & {
    _id: Types.ObjectId;
}, never>>;
