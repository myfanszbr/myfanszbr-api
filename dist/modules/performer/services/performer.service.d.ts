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
import { QueueEventService, QueueEvent } from 'src/kernel';
import { FileService } from 'src/modules/file/services';
import { SettingService } from 'src/modules/settings';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { FileDto } from 'src/modules/file';
import { AuthService } from 'src/modules/auth/services';
import { MailerService } from 'src/modules/mailer';
import { UserDto } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { PerformerBlockService } from 'src/modules/block/services';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { PerformerDto } from '../dtos';
import { PerformerModel, PaymentGatewaySettingModel, BankingModel } from '../models';
import { PerformerCreatePayload, PerformerUpdatePayload, PerformerRegisterPayload, SelfUpdatePayload, PaymentGatewaySettingPayload, CommissionSettingPayload, BankingSettingPayload } from '../payloads';
export declare class PerformerService {
    private readonly followService;
    private readonly performerBlockService;
    private readonly userService;
    private readonly authService;
    private readonly reactionService;
    private readonly settingService;
    private readonly fileService;
    private readonly subscriptionService;
    private readonly performerModel;
    private readonly queueEventService;
    private readonly mailService;
    private readonly paymentGatewaySettingModel;
    private readonly bankingSettingModel;
    constructor(followService: FollowService, performerBlockService: PerformerBlockService, userService: UserService, authService: AuthService, reactionService: ReactionService, settingService: SettingService, fileService: FileService, subscriptionService: SubscriptionService, performerModel: Model<PerformerModel>, queueEventService: QueueEventService, mailService: MailerService, paymentGatewaySettingModel: Model<PaymentGatewaySettingModel>, bankingSettingModel: Model<BankingModel>);
    handleWelcomeVideoFile(event: QueueEvent): Promise<void>;
    checkExistedEmailorUsername(payload: any): Promise<number>;
    findById(id: string | Types.ObjectId): Promise<PerformerDto>;
    findOne(query: any): Promise<import("mongoose").Document<unknown, {}, PerformerModel> & Omit<PerformerModel & Required<{
        _id: Types.ObjectId;
    }>, never>>;
    find(query: any): Promise<(import("mongoose").Document<unknown, {}, PerformerModel> & Omit<PerformerModel & Required<{
        _id: Types.ObjectId;
    }>, never>)[]>;
    updateOne(query: any, params: any, options: any): Promise<any>;
    findByUsername(username: string, countryCode?: string, user?: UserDto): Promise<PerformerDto>;
    findByEmail(email: string): Promise<PerformerDto>;
    findByIds(ids: any[]): Promise<PerformerDto[]>;
    getDetails(id: string, jwToken: string): Promise<PerformerDto>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
    create(payload: PerformerCreatePayload): Promise<PerformerDto>;
    register(payload: PerformerRegisterPayload): Promise<PerformerDto>;
    adminUpdate(id: string, payload: PerformerUpdatePayload): Promise<any>;
    selfUpdate(id: string, payload: SelfUpdatePayload): Promise<boolean>;
    socialCreate(payload: PerformerRegisterPayload): Promise<PerformerModel>;
    updateDocument(performerId: string | Types.ObjectId, file: FileDto, type: string): Promise<FileDto>;
    updateAvatar(performerId: string | Types.ObjectId, file: FileDto): Promise<FileDto>;
    updateCover(performerId: string | Types.ObjectId, file: FileDto): Promise<FileDto>;
    updateWelcomeVideo(performerId: string | Types.ObjectId, file: FileDto): Promise<FileDto>;
    getBankInfo(performerId: any): Promise<import("mongoose").Document<unknown, {}, BankingModel> & Omit<BankingModel & {
        _id: Types.ObjectId;
    }, never>>;
    increaseViewStats(id: string | Types.ObjectId): Promise<void>;
    updateLastStreamingTime(id: string | Types.ObjectId, streamTime: number): Promise<void>;
    updateStats(id: string | Types.ObjectId, payload: Record<string, number>): Promise<void>;
    goLive(id: string | Types.ObjectId): Promise<void>;
    setStreamingStatus(id: string | Types.ObjectId, streamingStatus: string): Promise<void>;
    updatePaymentGateway(payload: PaymentGatewaySettingPayload): Promise<import("mongoose").Document<unknown, {}, PaymentGatewaySettingModel> & Omit<PaymentGatewaySettingModel & {
        _id: Types.ObjectId;
    }, never>>;
    getPaymentSetting(performerId: string | Types.ObjectId, service?: string): Promise<import("mongoose").Document<unknown, {}, PaymentGatewaySettingModel> & Omit<PaymentGatewaySettingModel & {
        _id: Types.ObjectId;
    }, never>>;
    updateSubscriptionStat(performerId: string | Types.ObjectId, num?: number): Promise<void>;
    updateLikeStat(performerId: string | Types.ObjectId, num?: number): Promise<void>;
    updateCommissionSetting(performerId: string, payload: CommissionSettingPayload): Promise<void>;
    updateBankingSetting(performerId: string, payload: BankingSettingPayload, user: UserDto): Promise<import("mongoose").Document<unknown, {}, BankingModel> & Omit<BankingModel & {
        _id: Types.ObjectId;
    }, never>>;
    updateVerificationStatus(userId: string | Types.ObjectId): Promise<any>;
    updateEmailVerificationStatus(userId: string | Types.ObjectId, verifiedEmail?: boolean): Promise<any>;
    updatePerformerBalance(performerId: string | Types.ObjectId, tokens: number): Promise<void>;
    checkAuthDocument(req: any, user: UserDto): Promise<boolean>;
}
