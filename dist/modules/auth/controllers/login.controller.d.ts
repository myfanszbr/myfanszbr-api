import { UserService } from 'src/modules/user/services';
import { DataResponse } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { AuthGooglePayload, AuthTwitterPayload, LoginByUsernamePayload } from '../payloads';
import { AuthService } from '../services';
export declare class LoginController {
    private readonly performerService;
    private readonly userService;
    private readonly authService;
    constructor(performerService: PerformerService, userService: UserService, authService: AuthService);
    login(req: LoginByUsernamePayload): Promise<DataResponse<{
        token: string;
    }>>;
    twitterLogin(payload: AuthTwitterPayload): Promise<DataResponse<any>>;
    googleLogin(payload: AuthGooglePayload): Promise<DataResponse<any>>;
    twitterCallback(payload: any): Promise<DataResponse<any>>;
}
