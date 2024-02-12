import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { FileDto } from 'src/modules/file';
import { DataResponse } from 'src/kernel';
import { Response } from 'express';
import { UserRegisterPayload } from 'src/modules/user/payloads';
import { PerformerRegisterPayload } from 'src/modules/performer/payloads';
import { EmailVerificationPayload } from '../payloads';
import { AuthService } from '../services';
export declare class RegisterController {
    private readonly performerService;
    private readonly fileService;
    private readonly userService;
    private readonly authService;
    constructor(performerService: PerformerService, fileService: FileService, userService: UserService, authService: AuthService);
    userRegister(payload: UserRegisterPayload): Promise<DataResponse<{
        message: string;
    }>>;
    performerRegister(payload: PerformerRegisterPayload, files: Record<string, FileDto>): Promise<DataResponse<{
        message: string;
    }>>;
    emailVerify(payload: EmailVerificationPayload): Promise<DataResponse<{
        message: string;
    }>>;
    verifyEmail(res: Response, token: string): Promise<void>;
}
