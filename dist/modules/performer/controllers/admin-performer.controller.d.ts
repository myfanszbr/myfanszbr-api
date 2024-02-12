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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerCreatePayload, PerformerUpdatePayload, PerformerSearchPayload, PaymentGatewaySettingPayload, CommissionSettingPayload, BankingSettingPayload } from '../payloads';
import { PerformerDto } from '../dtos';
import { PerformerService, PerformerSearchService } from '../services';
export declare class AdminPerformerController {
    private readonly performerService;
    private readonly performerSearchService;
    private readonly authService;
    constructor(performerService: PerformerService, performerSearchService: PerformerSearchService, authService: AuthService);
    search(req: PerformerSearchPayload): Promise<DataResponse<PageableData<PerformerDto>>>;
    create(payload: PerformerCreatePayload): Promise<DataResponse<PerformerDto>>;
    updateUser(payload: PerformerUpdatePayload, performerId: string, req: any): Promise<DataResponse<PerformerDto>>;
    getDetails(performerId: string, req: any): Promise<DataResponse<PerformerDto>>;
    delete(performerId: string): Promise<DataResponse<any>>;
    uploadPerformerDocument(file: FileDto, id: string, type: string): Promise<any>;
    uploadPerformerAvatar(file: FileDto, performerId: string): Promise<any>;
    uploadPerformerCover(file: FileDto, performerId: string): Promise<any>;
    uploadPerformerVideo(file: FileDto, performerId: string): Promise<any>;
    updatePaymentGatewaySetting(payload: PaymentGatewaySettingPayload): Promise<DataResponse<import("mongoose").Document<unknown, {}, import("../models").PaymentGatewaySettingModel> & Omit<import("../models").PaymentGatewaySettingModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    updateCommissionSetting(performerId: string, payload: CommissionSettingPayload): Promise<DataResponse<void>>;
    updateBankingSetting(performerId: string, payload: BankingSettingPayload, user: UserDto): Promise<DataResponse<import("mongoose").Document<unknown, {}, import("../models").BankingModel> & Omit<import("../models").BankingModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
}
