import { DataResponse } from 'src/kernel';
import { BlockService } from '../services';
import { BlockCountryCreatePayload } from '../payloads/site-block-country.payload';
export declare class AdminBlockController {
    private readonly blockService;
    constructor(blockService: BlockService);
    search(): Promise<DataResponse<any>>;
    createUser(payload: BlockCountryCreatePayload): Promise<DataResponse<any>>;
    delete(countryCode: string): Promise<DataResponse<boolean>>;
}
