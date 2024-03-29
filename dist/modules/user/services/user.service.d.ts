import { Model, Types } from "mongoose";
import { FileDto } from "src/modules/file";
import { QueueEventService } from "src/kernel";
import { AuthService } from "src/modules/auth/services";
import { PerformerService } from "src/modules/performer/services";
import { FileService } from "src/modules/file/services";
import { UserModel } from "../models";
import { UserUpdatePayload, UserCreatePayload, AdminUpdatePayload, UserRegisterPayload } from "../payloads";
import { UserDto } from "../dtos";
export declare class UserService {
    private readonly authService;
    private readonly performerService;
    private readonly userModel;
    private readonly queueEventService;
    private readonly fileService;
    constructor(authService: AuthService, performerService: PerformerService, userModel: Model<UserModel>, queueEventService: QueueEventService, fileService: FileService);
    find(params: any): Promise<UserModel[]>;
    findOne(params: any): Promise<UserModel>;
    updateOne(query: any, params: any, options: any): Promise<any>;
    updateMany(query: any, params: any, options: any): Promise<any>;
    findByEmail(email: string): Promise<UserModel | null>;
    findById(id: string | Types.ObjectId): Promise<UserModel>;
    getMe(id: string, jwToken: string): Promise<any>;
    findByUsername(username: string): Promise<UserDto>;
    findByIds(ids: any[]): Promise<UserDto[]>;
    checkExistedEmailorUsername(payload: any): Promise<number>;
    register(data: UserRegisterPayload): Promise<UserModel>;
    create(data: UserCreatePayload): Promise<UserModel>;
    socialCreate(payload: any): Promise<UserModel>;
    update(id: string | Types.ObjectId, payload: UserUpdatePayload, user: UserDto): Promise<any>;
    adminUpdate(id: string | Types.ObjectId, payload: AdminUpdatePayload): Promise<any>;
    updateAvatar(user: UserDto, file: FileDto): Promise<FileDto>;
    updateVerificationStatus(userId: string | Types.ObjectId): Promise<any>;
    updateStats(id: string | Types.ObjectId, payload: Record<string, number>): Promise<void>;
    updateCCbillPaymentInfo(userId: Types.ObjectId, subscriptionId: string): Promise<void>;
    updateBalance(userId: string | Types.ObjectId, num: number): Promise<void>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
