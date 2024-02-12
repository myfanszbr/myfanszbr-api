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
import { Model, Types } from 'mongoose';
import { PerformerBlockUserModel, SiteBlockCountryModel } from '../models';
import { BlockCountryCreatePayload } from '../payloads';
export declare class BlockService {
    private readonly blockCountryModel;
    private readonly blockedByPerformerModel;
    constructor(blockCountryModel: Model<SiteBlockCountryModel>, blockedByPerformerModel: Model<PerformerBlockUserModel>);
    create(payload: BlockCountryCreatePayload): Promise<any>;
    search(): Promise<any>;
    delete(code: any): Promise<any>;
    checkCountryBlock(countryCode: any): Promise<{
        blocked: boolean;
    }>;
    userSearch(userId: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, PerformerBlockUserModel> & Omit<PerformerBlockUserModel & {
        _id: Types.ObjectId;
    }, never>)[]>;
}
