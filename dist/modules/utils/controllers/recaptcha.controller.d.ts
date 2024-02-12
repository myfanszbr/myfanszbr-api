import { DataResponse } from 'src/kernel';
import { RecaptchaService } from '../services';
export declare class RecaptchaController {
    private readonly recaptchaService;
    constructor(recaptchaService: RecaptchaService);
    create(payload: {
        token: string;
    }): Promise<DataResponse<any>>;
}
