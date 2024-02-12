import { SettingService } from 'src/modules/settings/services';
export declare class RecaptchaService {
    private readonly settingService;
    constructor(settingService: SettingService);
    verifyGoogleRecaptcha(token: string): Promise<any>;
}
