import { DataResponse, PageableData } from 'src/kernel';
import { EarningService } from '../services/earning.service';
import { EarningSearchRequestPayload, UpdateEarningStatusPayload } from '../payloads';
import { EarningDto, IEarningStatResponse } from '../dtos/earning.dto';
export declare class AdminEarningController {
    private readonly earningService;
    constructor(earningService: EarningService);
    adminSearch(req: EarningSearchRequestPayload): Promise<DataResponse<PageableData<EarningDto>>>;
    adminStats(req: EarningSearchRequestPayload): Promise<DataResponse<IEarningStatResponse>>;
    updateStats(payload: UpdateEarningStatusPayload): Promise<DataResponse<IEarningStatResponse>>;
    details(id: string): Promise<DataResponse<EarningDto>>;
}
