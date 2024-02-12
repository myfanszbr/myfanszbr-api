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
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { AuthModel, ForgotModel, VerificationModel, OAuthLoginModel, AuthSessionModel } from '../models';
import { AuthCreateDto } from '../dtos';
import { AuthGooglePayload } from '../payloads';
export declare class AuthService {
    private readonly performerService;
    private readonly userService;
    private readonly oAuthLoginModel;
    private readonly authModel;
    private readonly verificationModel;
    private readonly forgotModel;
    private readonly authSessionModel;
    private readonly mailService;
    constructor(performerService: PerformerService, userService: UserService, oAuthLoginModel: Model<OAuthLoginModel>, authModel: Model<AuthModel>, verificationModel: Model<VerificationModel>, forgotModel: Model<ForgotModel>, authSessionModel: Model<AuthSessionModel>, mailService: MailerService);
    generateSalt(byteSize?: number): string;
    encryptPassword(pw: string, salt: string): string;
    findOne(query: any): Promise<import("mongoose").Document<unknown, {}, AuthModel> & Omit<AuthModel & {
        _id: Types.ObjectId;
    }, never>>;
    find(query: any): Promise<(import("mongoose").Document<unknown, {}, AuthModel> & Omit<AuthModel & {
        _id: Types.ObjectId;
    }, never>)[]>;
    createAuthPassword(data: AuthCreateDto): Promise<AuthModel>;
    updateAuthPassword(data: AuthCreateDto): Promise<void>;
    updateKey(data: AuthCreateDto): Promise<void>;
    findBySource(options: {
        source?: string;
        sourceId?: Types.ObjectId;
        type?: string;
        key?: string;
    }): Promise<AuthModel | null>;
    verifyPassword(pw: string, auth: AuthModel): boolean;
    getSourceFromAuthSession(auth: {
        source: string;
        sourceId: Types.ObjectId;
    }): Promise<any>;
    getForgot(token: string): Promise<ForgotModel>;
    removeForgot(id: string): Promise<void>;
    forgot(auth: AuthModel, source: {
        _id: Types.ObjectId;
        email: string;
    }): Promise<boolean>;
    loginTwitter(callbackUrl?: string): Promise<unknown>;
    twitterLoginCallback(payload: Record<string, any>): Promise<unknown>;
    verifyLoginGoogle(payload: AuthGooglePayload): Promise<{
        token: string;
    }>;
    sendVerificationEmail(source: any): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    updateAuthSession(source: string, sourceId: string | Types.ObjectId, expiresInSeconds?: number): Promise<string>;
    verifySession(token: string): Promise<false | (import("mongoose").FlattenMaps<AuthSessionModel> & {
        _id: Types.ObjectId;
    })>;
}
