import { DataResponse } from 'src/kernel';
import { CountryService } from 'src/modules/utils/services';
import { BlockService } from '../services';
export declare class BlockController {
    private readonly blockService;
    private readonly countryService;
    constructor(blockService: BlockService, countryService: CountryService);
    blockCountry(req: any): Promise<DataResponse<any>>;
}
