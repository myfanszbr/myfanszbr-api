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
export declare const EARNING_MODEL_PROVIDER = "EARNING_MODEL_PROVIDER";
export declare const earningProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        createdAt: Date;
        grossPrice: number;
        netPrice: number;
        siteCommission: number;
        isPaid: boolean;
        isToken: boolean;
        type?: string;
        sourceType?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        paidAt?: Date;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        createdAt: Date;
        grossPrice: number;
        netPrice: number;
        siteCommission: number;
        isPaid: boolean;
        isToken: boolean;
        type?: string;
        sourceType?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        paidAt?: Date;
    }> & Omit<{
        createdAt: Date;
        grossPrice: number;
        netPrice: number;
        siteCommission: number;
        isPaid: boolean;
        isToken: boolean;
        type?: string;
        sourceType?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        paidAt?: Date;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        createdAt: Date;
        grossPrice: number;
        netPrice: number;
        siteCommission: number;
        isPaid: boolean;
        isToken: boolean;
        type?: string;
        sourceType?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        paidAt?: Date;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        createdAt: Date;
        grossPrice: number;
        netPrice: number;
        siteCommission: number;
        isPaid: boolean;
        isToken: boolean;
        type?: string;
        sourceType?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        paidAt?: Date;
    }>> & Omit<import("mongoose").FlatRecord<{
        createdAt: Date;
        grossPrice: number;
        netPrice: number;
        siteCommission: number;
        isPaid: boolean;
        isToken: boolean;
        type?: string;
        sourceType?: string;
        performerId?: import("mongoose").Types.ObjectId;
        paymentGateway?: string;
        userId?: import("mongoose").Types.ObjectId;
        transactionId?: import("mongoose").Types.ObjectId;
        paidAt?: Date;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
}[];
