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
export declare const AUTH_MODEL_PROVIDER = "AUTH_MODEL";
export declare const AUTH_SESSION_MODEL_PROVIDER = "AUTH_SESSION_MODEL_PROVIDER";
export declare const OAUTH_LOGIN_MODEL_PROVIDER = "OAUTH_LOGIN_MODEL_PROVIDER";
export declare const VERIFICATION_MODEL_PROVIDER = "VERIFICATION_MODEL_PROVIDER";
export declare const FORGOT_MODEL_PROVIDER = "FORGOT_MODEL_PROVIDER";
export declare const authProviders: ({
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        source: string;
        type: string;
        createdAt: Date;
        key?: string;
        value?: string;
        salt?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        source: string;
        type: string;
        createdAt: Date;
        key?: string;
        value?: string;
        salt?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }> & Omit<{
        updatedAt: Date;
        source: string;
        type: string;
        createdAt: Date;
        key?: string;
        value?: string;
        salt?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
        collection: string;
    }, {
        updatedAt: Date;
        source: string;
        type: string;
        createdAt: Date;
        key?: string;
        value?: string;
        salt?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        source: string;
        type: string;
        createdAt: Date;
        key?: string;
        value?: string;
        salt?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        source: string;
        type: string;
        createdAt: Date;
        key?: string;
        value?: string;
        salt?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        type: string;
        createdAt: Date;
        sourceType: string;
        verified: boolean;
        value?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        type: string;
        createdAt: Date;
        sourceType: string;
        verified: boolean;
        value?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }> & Omit<{
        updatedAt: Date;
        type: string;
        createdAt: Date;
        sourceType: string;
        verified: boolean;
        value?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
        collection: string;
    }, {
        updatedAt: Date;
        type: string;
        createdAt: Date;
        sourceType: string;
        verified: boolean;
        value?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        type: string;
        createdAt: Date;
        sourceType: string;
        verified: boolean;
        value?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        type: string;
        createdAt: Date;
        sourceType: string;
        verified: boolean;
        value?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        source?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
        authId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        source?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
        authId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        source?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
        authId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
        collection: string;
    }, {
        updatedAt: Date;
        createdAt: Date;
        source?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
        authId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        source?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
        authId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        source?: string;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
        authId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        source: string;
        createdAt: Date;
        value?: any;
        sourceId?: import("mongoose").Types.ObjectId;
        provider?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        source: string;
        createdAt: Date;
        value?: any;
        sourceId?: import("mongoose").Types.ObjectId;
        provider?: string;
    }> & Omit<{
        updatedAt: Date;
        source: string;
        createdAt: Date;
        value?: any;
        sourceId?: import("mongoose").Types.ObjectId;
        provider?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
        collection: string;
    }, {
        updatedAt: Date;
        source: string;
        createdAt: Date;
        value?: any;
        sourceId?: import("mongoose").Types.ObjectId;
        provider?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        source: string;
        createdAt: Date;
        value?: any;
        sourceId?: import("mongoose").Types.ObjectId;
        provider?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        source: string;
        createdAt: Date;
        value?: any;
        sourceId?: import("mongoose").Types.ObjectId;
        provider?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        source: string;
        createdAt: Date;
        expiryAt: Date;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        source: string;
        createdAt: Date;
        expiryAt: Date;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }> & Omit<{
        source: string;
        createdAt: Date;
        expiryAt: Date;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
        collection: string;
    }, {
        source: string;
        createdAt: Date;
        expiryAt: Date;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        source: string;
        createdAt: Date;
        expiryAt: Date;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        source: string;
        createdAt: Date;
        expiryAt: Date;
        sourceId?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        token?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
})[];
