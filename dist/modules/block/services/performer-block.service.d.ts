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
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import { PerformerBlockUserDto } from '../dtos';
import { PerformerBlockCountryModel, PerformerBlockUserModel } from '../models';
import { PerformerBlockCountriesPayload, PerformerBlockUserPayload, GetBlockListUserPayload } from '../payloads';
export declare class PerformerBlockService {
    private readonly userService;
    private readonly performerBlockCountryModel;
    private readonly blockedByPerformerModel;
    private readonly mailService;
    constructor(userService: UserService, performerBlockCountryModel: Model<PerformerBlockCountryModel>, blockedByPerformerModel: Model<PerformerBlockUserModel>, mailService: MailerService);
    findBlockCountriesByQuery(query: any): import("mongoose").Query<(import("mongoose").Document<unknown, {}, PerformerBlockCountryModel> & Omit<PerformerBlockCountryModel & {
        _id: Types.ObjectId;
    }, never>)[], import("mongoose").Document<unknown, {}, PerformerBlockCountryModel> & Omit<PerformerBlockCountryModel & {
        _id: Types.ObjectId;
    }, never>, {}, PerformerBlockCountryModel, "find">;
    findOneBlockCountriesByQuery(query: any): import("mongoose").Query<import("mongoose").Document<unknown, {}, PerformerBlockCountryModel> & Omit<PerformerBlockCountryModel & {
        _id: Types.ObjectId;
    }, never>, import("mongoose").Document<unknown, {}, PerformerBlockCountryModel> & Omit<PerformerBlockCountryModel & {
        _id: Types.ObjectId;
    }, never>, {}, PerformerBlockCountryModel, "findOne">;
    listByQuery(query: any): import("mongoose").Query<(import("mongoose").Document<unknown, {}, PerformerBlockUserModel> & Omit<PerformerBlockUserModel & {
        _id: Types.ObjectId;
    }, never>)[], import("mongoose").Document<unknown, {}, PerformerBlockUserModel> & Omit<PerformerBlockUserModel & {
        _id: Types.ObjectId;
    }, never>, {}, PerformerBlockUserModel, "find">;
    checkBlockedCountryByIp(performerId: string | Types.ObjectId, countryCode: string): Promise<boolean>;
    checkBlockedByPerformer(performerId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<boolean>;
    performerBlockCountries(payload: PerformerBlockCountriesPayload, user: UserDto): Promise<import("mongoose").Document<unknown, {}, PerformerBlockCountryModel> & Omit<PerformerBlockCountryModel & {
        _id: Types.ObjectId;
    }, never>>;
    blockUser(user: UserDto, payload: PerformerBlockUserPayload): Promise<import("mongoose").Document<unknown, {}, PerformerBlockUserModel> & Omit<PerformerBlockUserModel & {
        _id: Types.ObjectId;
    }, never>>;
    unblockUser(user: UserDto, targetId: string): Promise<{
        unlocked: boolean;
    }>;
    getBlockedUsers(user: UserDto, req: GetBlockListUserPayload): Promise<{
        data: PerformerBlockUserDto[];
        total: number;
    }>;
}
