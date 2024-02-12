import { DataResponse } from 'src/kernel';
import { SettingService } from '../services';
export declare class SettingController {
    private readonly settingService;
    constructor(settingService: SettingService);
    getPublicSettings(): Promise<DataResponse<Record<string, any>>>;
    getPublicValueByKey(key: string): Promise<DataResponse<Record<string, any>>>;
    getPublicValueByKeys(keys: string[]): Promise<DataResponse<Record<string, any>>>;
    getPublicSettingByKey(key: string): Promise<DataResponse<any>>;
}
