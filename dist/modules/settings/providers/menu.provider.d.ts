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
export declare const MENU_PROVIDER = "MENU_PROVIDER";
export declare const menuProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<{
        path: string;
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        public: boolean;
        title: string;
        internal: boolean;
        help: string;
        section: "main" | "header" | "footer";
        isPage: boolean;
        isNewTab: boolean;
        parentId?: import("mongoose").Types.ObjectId;
    }, {}, {}, {}, import("mongoose").Document<unknown, {}, {
        path: string;
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        public: boolean;
        title: string;
        internal: boolean;
        help: string;
        section: "main" | "header" | "footer";
        isPage: boolean;
        isNewTab: boolean;
        parentId?: import("mongoose").Types.ObjectId;
    }> & Omit<{
        path: string;
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        public: boolean;
        title: string;
        internal: boolean;
        help: string;
        section: "main" | "header" | "footer";
        isPage: boolean;
        isNewTab: boolean;
        parentId?: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
        path: string;
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        public: boolean;
        title: string;
        internal: boolean;
        help: string;
        section: "main" | "header" | "footer";
        isPage: boolean;
        isNewTab: boolean;
        parentId?: import("mongoose").Types.ObjectId;
    }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
        path: string;
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        public: boolean;
        title: string;
        internal: boolean;
        help: string;
        section: "main" | "header" | "footer";
        isPage: boolean;
        isNewTab: boolean;
        parentId?: import("mongoose").Types.ObjectId;
    }>> & Omit<import("mongoose").FlatRecord<{
        path: string;
        updatedAt: Date;
        createdAt: Date;
        ordering: number;
        public: boolean;
        title: string;
        internal: boolean;
        help: string;
        section: "main" | "header" | "footer";
        isPage: boolean;
        isNewTab: boolean;
        parentId?: import("mongoose").Types.ObjectId;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    inject: string[];
}[];
