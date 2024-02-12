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
import { FileService } from 'src/modules/file/services';
import { CountryService } from 'src/modules/utils/services';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from '../dtos';
import { SelfUpdatePayload, PerformerSearchPayload, BankingSettingPayload, PaymentGatewaySettingPayload } from '../payloads';
import { PerformerService, PerformerSearchService } from '../services';
export declare class PerformerController {
    private readonly authService;
    private readonly countryService;
    private readonly fileService;
    private readonly performerService;
    private readonly performerSearchService;
    constructor(authService: AuthService, countryService: CountryService, fileService: FileService, performerService: PerformerService, performerSearchService: PerformerSearchService);
    me(req: any): Promise<DataResponse<PerformerDto>>;
    usearch(query: PerformerSearchPayload, currentUser: UserDto): Promise<DataResponse<PageableData<PerformerDto>>>;
    randomSearch(req: PerformerSearchPayload, currentUser: UserDto): Promise<DataResponse<any>>;
    updateUser(payload: SelfUpdatePayload, performerId: string, req: any): Promise<DataResponse<PerformerDto>>;
    getDetails(performerUsername: string, req: any, user: UserDto): Promise<DataResponse<Partial<PerformerDto>>>;
    uploadPerformerDocument(currentUser: PerformerDto, file: FileDto, type: any, req: any): Promise<any>;
    uploadPerformerAvatar(file: FileDto, performer: UserDto): Promise<any>;
    uploadPerformerCover(file: FileDto, performer: UserDto): Promise<any>;
    uploadPerformerVideo(file: FileDto, performer: PerformerDto): Promise<any>;
    updateBankingSetting(performerId: string, payload: BankingSettingPayload, user: UserDto): Promise<DataResponse<import("mongoose").Document<unknown, {}, import("../models").BankingModel> & Omit<import("../models").BankingModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    updatePaymentGatewaySetting(payload: PaymentGatewaySettingPayload, user: UserDto): Promise<DataResponse<import("mongoose").Document<unknown, {}, import("../models").PaymentGatewaySettingModel> & Omit<import("../models").PaymentGatewaySettingModel & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>>;
    checkAuth(req: any): Promise<boolean>;
}
