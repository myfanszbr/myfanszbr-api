import { DataResponse } from 'src/kernel';
import { AuthService } from '../services';
import { PasswordUserChangePayload } from '../payloads';
export declare class AdminPasswordController {
    private readonly authService;
    constructor(authService: AuthService);
    updateUserPassword(payload: PasswordUserChangePayload): Promise<DataResponse<boolean>>;
}
