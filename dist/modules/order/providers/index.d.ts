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
export declare const ORDER_MODEL_PROVIDER = "ORDER_MODEL_PROVIDER";
export declare const SHIPPING_ADDRESS_MODEL_PROVIDER = "SHIPPING_ADDRESS_MODEL_PROVIDER";
export declare const orderProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        createdAt: Date;
        totalPrice: number;
        quantity: number;
        unitPrice: number;
        performerId?: import("mongoose").Types.ObjectId;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        productId?: import("mongoose").Types.ObjectId;
        deliveryAddressId?: import("mongoose").Types.ObjectId;
        phoneNumber?: string;
        userNote?: string;
        orderNumber?: string;
        shippingCode?: string;
        productInfo?: any;
        deliveryAddress?: string;
        deliveryStatus?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        createdAt: Date;
        totalPrice: number;
        quantity: number;
        unitPrice: number;
        performerId?: import("mongoose").Types.ObjectId;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        productId?: import("mongoose").Types.ObjectId;
        deliveryAddressId?: import("mongoose").Types.ObjectId;
        phoneNumber?: string;
        userNote?: string;
        orderNumber?: string;
        shippingCode?: string;
        productInfo?: any;
        deliveryAddress?: string;
        deliveryStatus?: string;
    }> & Omit<{
        updatedAt: Date;
        createdAt: Date;
        totalPrice: number;
        quantity: number;
        unitPrice: number;
        performerId?: import("mongoose").Types.ObjectId;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        productId?: import("mongoose").Types.ObjectId;
        deliveryAddressId?: import("mongoose").Types.ObjectId;
        phoneNumber?: string;
        userNote?: string;
        orderNumber?: string;
        shippingCode?: string;
        productInfo?: any;
        deliveryAddress?: string;
        deliveryStatus?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        createdAt: Date;
        totalPrice: number;
        quantity: number;
        unitPrice: number;
        performerId?: import("mongoose").Types.ObjectId;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        productId?: import("mongoose").Types.ObjectId;
        deliveryAddressId?: import("mongoose").Types.ObjectId;
        phoneNumber?: string;
        userNote?: string;
        orderNumber?: string;
        shippingCode?: string;
        productInfo?: any;
        deliveryAddress?: string;
        deliveryStatus?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        totalPrice: number;
        quantity: number;
        unitPrice: number;
        performerId?: import("mongoose").Types.ObjectId;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        productId?: import("mongoose").Types.ObjectId;
        deliveryAddressId?: import("mongoose").Types.ObjectId;
        phoneNumber?: string;
        userNote?: string;
        orderNumber?: string;
        shippingCode?: string;
        productInfo?: any;
        deliveryAddress?: string;
        deliveryStatus?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        createdAt: Date;
        totalPrice: number;
        quantity: number;
        unitPrice: number;
        performerId?: import("mongoose").Types.ObjectId;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        productId?: import("mongoose").Types.ObjectId;
        deliveryAddressId?: import("mongoose").Types.ObjectId;
        phoneNumber?: string;
        userNote?: string;
        orderNumber?: string;
        shippingCode?: string;
        productInfo?: any;
        deliveryAddress?: string;
        deliveryStatus?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
}[];
export declare const shippingAddressProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        updatedAt: Date;
        source: string;
        createdAt: Date;
        name?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        description?: string;
        country?: string;
        city?: string;
        state?: string;
        district?: string;
        ward?: string;
        streetNumber?: string;
        streetAddress?: string;
        zipCode?: string;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        updatedAt: Date;
        source: string;
        createdAt: Date;
        name?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        description?: string;
        country?: string;
        city?: string;
        state?: string;
        district?: string;
        ward?: string;
        streetNumber?: string;
        streetAddress?: string;
        zipCode?: string;
    }> & Omit<{
        updatedAt: Date;
        source: string;
        createdAt: Date;
        name?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        description?: string;
        country?: string;
        city?: string;
        state?: string;
        district?: string;
        ward?: string;
        streetNumber?: string;
        streetAddress?: string;
        zipCode?: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        updatedAt: Date;
        source: string;
        createdAt: Date;
        name?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        description?: string;
        country?: string;
        city?: string;
        state?: string;
        district?: string;
        ward?: string;
        streetNumber?: string;
        streetAddress?: string;
        zipCode?: string;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        updatedAt: Date;
        source: string;
        createdAt: Date;
        name?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        description?: string;
        country?: string;
        city?: string;
        state?: string;
        district?: string;
        ward?: string;
        streetNumber?: string;
        streetAddress?: string;
        zipCode?: string;
    }>> & Omit<import("mongoose").FlatRecord<{
        updatedAt: Date;
        source: string;
        createdAt: Date;
        name?: string;
        sourceId?: import("mongoose").Types.ObjectId;
        description?: string;
        country?: string;
        city?: string;
        state?: string;
        district?: string;
        ward?: string;
        streetNumber?: string;
        streetAddress?: string;
        zipCode?: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
}[];
