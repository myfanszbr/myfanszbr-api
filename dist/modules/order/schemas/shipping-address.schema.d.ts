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
export declare const ShippingAddressSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
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
}, never>>;