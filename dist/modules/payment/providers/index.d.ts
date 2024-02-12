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
export declare const PAYMENT_TRANSACTION_MODEL_PROVIDER = "PAYMENT_TRANSACTION_MODEL_PROVIDER";
export declare const SUBSCRIPTION_PLAN_MODEL_PROVIDER = "SUBSCRIPTION_PLAN_MODEL_PROVIDER";
export declare const PAYMENT_CUSTOMER_MODEL_PROVIDER = "PAYMENT_CUSTOMER_MODEL_PROVIDER";
export declare const PAYMENT_CARD_MODEL_PROVIDER = "PAYMENT_CARD_MODEL_PROVIDER";
export declare const paymentProviders: ({
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        products: {
            name?: string;
            _id?: unknown;
            description?: string;
            price?: number;
            productType?: string;
            productId?: import("mongoose").Types.ObjectId;
            quantity?: number;
            extraInfo?: any;
            tokens?: number;
        }[];
        totalPrice: number;
        originalPrice: number;
        source?: string;
        type?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        target?: string;
        targetId?: import("mongoose").Types.ObjectId;
        paymentResponseInfo?: any;
        invoiceId?: string;
        stripeClientSecret?: string;
        couponInfo?: any;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        products: {
            name?: string;
            _id?: unknown;
            description?: string;
            price?: number;
            productType?: string;
            productId?: import("mongoose").Types.ObjectId;
            quantity?: number;
            extraInfo?: any;
            tokens?: number;
        }[];
        totalPrice: number;
        originalPrice: number;
        source?: string;
        type?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        target?: string;
        targetId?: import("mongoose").Types.ObjectId;
        paymentResponseInfo?: any;
        invoiceId?: string;
        stripeClientSecret?: string;
        couponInfo?: any;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        products: {
            name?: string;
            _id?: unknown;
            description?: string;
            price?: number;
            productType?: string;
            productId?: import("mongoose").Types.ObjectId;
            quantity?: number;
            extraInfo?: any;
            tokens?: number;
        }[];
        totalPrice: number;
        originalPrice: number;
        source?: string;
        type?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        target?: string;
        targetId?: import("mongoose").Types.ObjectId;
        paymentResponseInfo?: any;
        invoiceId?: string;
        stripeClientSecret?: string;
        couponInfo?: any;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        products: {
            name?: string;
            _id?: unknown;
            description?: string;
            price?: number;
            productType?: string;
            productId?: import("mongoose").Types.ObjectId;
            quantity?: number;
            extraInfo?: any;
            tokens?: number;
        }[];
        totalPrice: number;
        originalPrice: number;
        source?: string;
        type?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        target?: string;
        targetId?: import("mongoose").Types.ObjectId;
        paymentResponseInfo?: any;
        invoiceId?: string;
        stripeClientSecret?: string;
        couponInfo?: any;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        products: {
            name?: string;
            _id?: unknown;
            description?: string;
            price?: number;
            productType?: string;
            productId?: import("mongoose").Types.ObjectId;
            quantity?: number;
            extraInfo?: any;
            tokens?: number;
        }[];
        totalPrice: number;
        originalPrice: number;
        source?: string;
        type?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        target?: string;
        targetId?: import("mongoose").Types.ObjectId;
        paymentResponseInfo?: any;
        invoiceId?: string;
        stripeClientSecret?: string;
        couponInfo?: any;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        products: {
            name?: string;
            _id?: unknown;
            description?: string;
            price?: number;
            productType?: string;
            productId?: import("mongoose").Types.ObjectId;
            quantity?: number;
            extraInfo?: any;
            tokens?: number;
        }[];
        totalPrice: number;
        originalPrice: number;
        source?: string;
        type?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        status?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        target?: string;
        targetId?: import("mongoose").Types.ObjectId;
        paymentResponseInfo?: any;
        invoiceId?: string;
        stripeClientSecret?: string;
        couponInfo?: any;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        price: number;
        performerId?: import("mongoose").Types.ObjectId;
        subscriptionType?: "free_subscription" | "monthly_subscription" | "yearly_subscription";
        planId?: string;
        metaData?: any;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        price: number;
        performerId?: import("mongoose").Types.ObjectId;
        subscriptionType?: "free_subscription" | "monthly_subscription" | "yearly_subscription";
        planId?: string;
        metaData?: any;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        price: number;
        performerId?: import("mongoose").Types.ObjectId;
        subscriptionType?: "free_subscription" | "monthly_subscription" | "yearly_subscription";
        planId?: string;
        metaData?: any;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        price: number;
        performerId?: import("mongoose").Types.ObjectId;
        subscriptionType?: "free_subscription" | "monthly_subscription" | "yearly_subscription";
        planId?: string;
        metaData?: any;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        price: number;
        performerId?: import("mongoose").Types.ObjectId;
        subscriptionType?: "free_subscription" | "monthly_subscription" | "yearly_subscription";
        planId?: string;
        metaData?: any;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        price: number;
        performerId?: import("mongoose").Types.ObjectId;
        subscriptionType?: "free_subscription" | "monthly_subscription" | "yearly_subscription";
        planId?: string;
        metaData?: any;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        name?: string;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        email?: string;
        customerId?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        name?: string;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        email?: string;
        customerId?: string;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        name?: string;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        email?: string;
        customerId?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
        collection: string;
    }, {
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        name?: string;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        email?: string;
        customerId?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        name?: string;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        email?: string;
        customerId?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        name?: string;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        email?: string;
        customerId?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
} | {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        token?: string;
        year?: string;
        month?: string;
        customerId?: string;
        holderName?: string;
        last4Digits?: string;
        brand?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        token?: string;
        year?: string;
        month?: string;
        customerId?: string;
        holderName?: string;
        last4Digits?: string;
        brand?: string;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        token?: string;
        year?: string;
        month?: string;
        customerId?: string;
        holderName?: string;
        last4Digits?: string;
        brand?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
        collection: string;
    }, {
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        token?: string;
        year?: string;
        month?: string;
        customerId?: string;
        holderName?: string;
        last4Digits?: string;
        brand?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        token?: string;
        year?: string;
        month?: string;
        customerId?: string;
        holderName?: string;
        last4Digits?: string;
        brand?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        paymentGateway: string;
        isProduction: boolean;
        source?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        token?: string;
        year?: string;
        month?: string;
        customerId?: string;
        holderName?: string;
        last4Digits?: string;
        brand?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
})[];
