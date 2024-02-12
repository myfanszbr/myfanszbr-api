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
export declare const PERFORMER_MODEL_PROVIDER = "PERFORMER_MODEL";
export declare const PERFORMER_CATEGORY_MODEL_PROVIDER = "PERFORMER_CATEGORY_MODEL";
export declare const PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER = "PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER";
export declare const PERFORMER_BANKING_SETTING_MODEL_PROVIDER = "PERFORMER_BANKING_SETTING_MODEL_PROVIDER";
export declare const performerProviders: ({
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        name?: string;
        description?: string;
        createdBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        updatedBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        slug?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        name?: string;
        description?: string;
        createdBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        updatedBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        slug?: string;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        name?: string;
        description?: string;
        createdBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        updatedBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        slug?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        name?: string;
        description?: string;
        createdBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        updatedBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        slug?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        name?: string;
        description?: string;
        createdBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        updatedBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        slug?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        name?: string;
        description?: string;
        createdBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        updatedBy?: {
            prototype?: import("mongoose").Types.ObjectId;
            cacheHexString?: unknown;
            generate?: {};
            createFromTime?: {};
            createFromHexString?: {};
            createFromBase64?: {};
            isValid?: {};
        };
        slug?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        verifiedEmail: boolean;
        balance: number;
        isOnline: number;
        googleConnected: boolean;
        twitterConnected: boolean;
        activateWelcomeVideo: boolean;
        verifiedAccount: boolean;
        verifiedDocument: boolean;
        languages: string[];
        categoryIds: import("mongoose").Types.ObjectId[];
        isFreeSubscription: boolean;
        durationFreeSubscriptionDays: number;
        monthlyPrice: number;
        yearlyPrice: number;
        publicChatPrice: number;
        score: number;
        live: number;
        streamingStatus: "public" | "private" | "group" | "offline";
        commissionPercentage: number;
        isFeatured: boolean;
        name?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        avatarId?: import("mongoose").Types.ObjectId;
        avatarPath?: string;
        username?: string;
        phone?: string;
        status?: string;
        gender?: string;
        country?: string;
        onlineAt?: Date;
        offlineAt?: Date;
        stats?: {
            views: number;
            likes: number;
            subscribers: number;
            followers: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
            totalFeeds: number;
            totalStreamTime: number;
        };
        phoneCode?: string;
        coverPath?: string;
        city?: string;
        state?: string;
        zipcode?: string;
        address?: string;
        bio?: string;
        lastStreamingTime?: Date;
        dateOfBirth?: Date;
        bodyType?: string;
        coverId?: import("mongoose").Types.ObjectId;
        idVerificationId?: import("mongoose").Types.ObjectId;
        documentVerificationId?: import("mongoose").Types.ObjectId;
        welcomeVideoId?: import("mongoose").Types.ObjectId;
        welcomeVideoPath?: string;
        height?: string;
        weight?: string;
        eyes?: string;
        hair?: string;
        butt?: string;
        ethnicity?: string;
        sexualOrientation?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        verifiedEmail: boolean;
        balance: number;
        isOnline: number;
        googleConnected: boolean;
        twitterConnected: boolean;
        activateWelcomeVideo: boolean;
        verifiedAccount: boolean;
        verifiedDocument: boolean;
        languages: string[];
        categoryIds: import("mongoose").Types.ObjectId[];
        isFreeSubscription: boolean;
        durationFreeSubscriptionDays: number;
        monthlyPrice: number;
        yearlyPrice: number;
        publicChatPrice: number;
        score: number;
        live: number;
        streamingStatus: "public" | "private" | "group" | "offline";
        commissionPercentage: number;
        isFeatured: boolean;
        name?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        avatarId?: import("mongoose").Types.ObjectId;
        avatarPath?: string;
        username?: string;
        phone?: string;
        status?: string;
        gender?: string;
        country?: string;
        onlineAt?: Date;
        offlineAt?: Date;
        stats?: {
            views: number;
            likes: number;
            subscribers: number;
            followers: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
            totalFeeds: number;
            totalStreamTime: number;
        };
        phoneCode?: string;
        coverPath?: string;
        city?: string;
        state?: string;
        zipcode?: string;
        address?: string;
        bio?: string;
        lastStreamingTime?: Date;
        dateOfBirth?: Date;
        bodyType?: string;
        coverId?: import("mongoose").Types.ObjectId;
        idVerificationId?: import("mongoose").Types.ObjectId;
        documentVerificationId?: import("mongoose").Types.ObjectId;
        welcomeVideoId?: import("mongoose").Types.ObjectId;
        welcomeVideoPath?: string;
        height?: string;
        weight?: string;
        eyes?: string;
        hair?: string;
        butt?: string;
        ethnicity?: string;
        sexualOrientation?: string;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        verifiedEmail: boolean;
        balance: number;
        isOnline: number;
        googleConnected: boolean;
        twitterConnected: boolean;
        activateWelcomeVideo: boolean;
        verifiedAccount: boolean;
        verifiedDocument: boolean;
        languages: string[];
        categoryIds: import("mongoose").Types.ObjectId[];
        isFreeSubscription: boolean;
        durationFreeSubscriptionDays: number;
        monthlyPrice: number;
        yearlyPrice: number;
        publicChatPrice: number;
        score: number;
        live: number;
        streamingStatus: "public" | "private" | "group" | "offline";
        commissionPercentage: number;
        isFeatured: boolean;
        name?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        avatarId?: import("mongoose").Types.ObjectId;
        avatarPath?: string;
        username?: string;
        phone?: string;
        status?: string;
        gender?: string;
        country?: string;
        onlineAt?: Date;
        offlineAt?: Date;
        stats?: {
            views: number;
            likes: number;
            subscribers: number;
            followers: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
            totalFeeds: number;
            totalStreamTime: number;
        };
        phoneCode?: string;
        coverPath?: string;
        city?: string;
        state?: string;
        zipcode?: string;
        address?: string;
        bio?: string;
        lastStreamingTime?: Date;
        dateOfBirth?: Date;
        bodyType?: string;
        coverId?: import("mongoose").Types.ObjectId;
        idVerificationId?: import("mongoose").Types.ObjectId;
        documentVerificationId?: import("mongoose").Types.ObjectId;
        welcomeVideoId?: import("mongoose").Types.ObjectId;
        welcomeVideoPath?: string;
        height?: string;
        weight?: string;
        eyes?: string;
        hair?: string;
        butt?: string;
        ethnicity?: string;
        sexualOrientation?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        verifiedEmail: boolean;
        balance: number;
        isOnline: number;
        googleConnected: boolean;
        twitterConnected: boolean;
        activateWelcomeVideo: boolean;
        verifiedAccount: boolean;
        verifiedDocument: boolean;
        languages: string[];
        categoryIds: import("mongoose").Types.ObjectId[];
        isFreeSubscription: boolean;
        durationFreeSubscriptionDays: number;
        monthlyPrice: number;
        yearlyPrice: number;
        publicChatPrice: number;
        score: number;
        live: number;
        streamingStatus: "public" | "private" | "group" | "offline";
        commissionPercentage: number;
        isFeatured: boolean;
        name?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        avatarId?: import("mongoose").Types.ObjectId;
        avatarPath?: string;
        username?: string;
        phone?: string;
        status?: string;
        gender?: string;
        country?: string;
        onlineAt?: Date;
        offlineAt?: Date;
        stats?: {
            views: number;
            likes: number;
            subscribers: number;
            followers: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
            totalFeeds: number;
            totalStreamTime: number;
        };
        phoneCode?: string;
        coverPath?: string;
        city?: string;
        state?: string;
        zipcode?: string;
        address?: string;
        bio?: string;
        lastStreamingTime?: Date;
        dateOfBirth?: Date;
        bodyType?: string;
        coverId?: import("mongoose").Types.ObjectId;
        idVerificationId?: import("mongoose").Types.ObjectId;
        documentVerificationId?: import("mongoose").Types.ObjectId;
        welcomeVideoId?: import("mongoose").Types.ObjectId;
        welcomeVideoPath?: string;
        height?: string;
        weight?: string;
        eyes?: string;
        hair?: string;
        butt?: string;
        ethnicity?: string;
        sexualOrientation?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        verifiedEmail: boolean;
        balance: number;
        isOnline: number;
        googleConnected: boolean;
        twitterConnected: boolean;
        activateWelcomeVideo: boolean;
        verifiedAccount: boolean;
        verifiedDocument: boolean;
        languages: string[];
        categoryIds: import("mongoose").Types.ObjectId[];
        isFreeSubscription: boolean;
        durationFreeSubscriptionDays: number;
        monthlyPrice: number;
        yearlyPrice: number;
        publicChatPrice: number;
        score: number;
        live: number;
        streamingStatus: "public" | "private" | "group" | "offline";
        commissionPercentage: number;
        isFeatured: boolean;
        name?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        avatarId?: import("mongoose").Types.ObjectId;
        avatarPath?: string;
        username?: string;
        phone?: string;
        status?: string;
        gender?: string;
        country?: string;
        onlineAt?: Date;
        offlineAt?: Date;
        stats?: {
            views: number;
            likes: number;
            subscribers: number;
            followers: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
            totalFeeds: number;
            totalStreamTime: number;
        };
        phoneCode?: string;
        coverPath?: string;
        city?: string;
        state?: string;
        zipcode?: string;
        address?: string;
        bio?: string;
        lastStreamingTime?: Date;
        dateOfBirth?: Date;
        bodyType?: string;
        coverId?: import("mongoose").Types.ObjectId;
        idVerificationId?: import("mongoose").Types.ObjectId;
        documentVerificationId?: import("mongoose").Types.ObjectId;
        welcomeVideoId?: import("mongoose").Types.ObjectId;
        welcomeVideoPath?: string;
        height?: string;
        weight?: string;
        eyes?: string;
        hair?: string;
        butt?: string;
        ethnicity?: string;
        sexualOrientation?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        verifiedEmail: boolean;
        balance: number;
        isOnline: number;
        googleConnected: boolean;
        twitterConnected: boolean;
        activateWelcomeVideo: boolean;
        verifiedAccount: boolean;
        verifiedDocument: boolean;
        languages: string[];
        categoryIds: import("mongoose").Types.ObjectId[];
        isFreeSubscription: boolean;
        durationFreeSubscriptionDays: number;
        monthlyPrice: number;
        yearlyPrice: number;
        publicChatPrice: number;
        score: number;
        live: number;
        streamingStatus: "public" | "private" | "group" | "offline";
        commissionPercentage: number;
        isFeatured: boolean;
        name?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        avatarId?: import("mongoose").Types.ObjectId;
        avatarPath?: string;
        username?: string;
        phone?: string;
        status?: string;
        gender?: string;
        country?: string;
        onlineAt?: Date;
        offlineAt?: Date;
        stats?: {
            views: number;
            likes: number;
            subscribers: number;
            followers: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
            totalFeeds: number;
            totalStreamTime: number;
        };
        phoneCode?: string;
        coverPath?: string;
        city?: string;
        state?: string;
        zipcode?: string;
        address?: string;
        bio?: string;
        lastStreamingTime?: Date;
        dateOfBirth?: Date;
        bodyType?: string;
        coverId?: import("mongoose").Types.ObjectId;
        idVerificationId?: import("mongoose").Types.ObjectId;
        documentVerificationId?: import("mongoose").Types.ObjectId;
        welcomeVideoId?: import("mongoose").Types.ObjectId;
        welcomeVideoPath?: string;
        height?: string;
        weight?: string;
        eyes?: string;
        hair?: string;
        butt?: string;
        ethnicity?: string;
        sexualOrientation?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        key?: string;
        value?: any;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        key?: string;
        value?: any;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        key?: string;
        value?: any;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        key?: string;
        value?: any;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        key?: string;
        value?: any;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        key?: string;
        value?: any;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        firstName?: string;
        lastName?: string;
        country?: string;
        city?: string;
        state?: string;
        address?: string;
        performerId?: import("mongoose").Types.ObjectId;
        SSN?: string;
        bankName?: string;
        bankAccount?: string;
        bankRouting?: string;
        bankSwiftCode?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        firstName?: string;
        lastName?: string;
        country?: string;
        city?: string;
        state?: string;
        address?: string;
        performerId?: import("mongoose").Types.ObjectId;
        SSN?: string;
        bankName?: string;
        bankAccount?: string;
        bankRouting?: string;
        bankSwiftCode?: string;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        firstName?: string;
        lastName?: string;
        country?: string;
        city?: string;
        state?: string;
        address?: string;
        performerId?: import("mongoose").Types.ObjectId;
        SSN?: string;
        bankName?: string;
        bankAccount?: string;
        bankRouting?: string;
        bankSwiftCode?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        firstName?: string;
        lastName?: string;
        country?: string;
        city?: string;
        state?: string;
        address?: string;
        performerId?: import("mongoose").Types.ObjectId;
        SSN?: string;
        bankName?: string;
        bankAccount?: string;
        bankRouting?: string;
        bankSwiftCode?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        firstName?: string;
        lastName?: string;
        country?: string;
        city?: string;
        state?: string;
        address?: string;
        performerId?: import("mongoose").Types.ObjectId;
        SSN?: string;
        bankName?: string;
        bankAccount?: string;
        bankRouting?: string;
        bankSwiftCode?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        firstName?: string;
        lastName?: string;
        country?: string;
        city?: string;
        state?: string;
        address?: string;
        performerId?: import("mongoose").Types.ObjectId;
        SSN?: string;
        bankName?: string;
        bankAccount?: string;
        bankRouting?: string;
        bankSwiftCode?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
})[];
