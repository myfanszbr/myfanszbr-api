import { DataResponse, PageableData } from 'src/kernel';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
import { EarningService } from '../services/earning.service';
import { EarningSearchRequestPayload } from '../payloads';
import { EarningDto, IEarningStatResponse } from '../dtos/earning.dto';
export declare class PerformerEarningController {
    private readonly earningService;
    constructor(earningService: EarningService);
    search(req: EarningSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<EarningDto>>>;
    performerStats(req: EarningSearchRequestPayload, user: PerformerDto): Promise<DataResponse<IEarningStatResponse>>;
}
