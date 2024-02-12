import { DataResponse } from 'src/kernel';
import { StatisticService } from '../services/statistic.service';
export declare class AdminStatisticController {
    private readonly statisticService;
    constructor(statisticService: StatisticService);
    list(): Promise<DataResponse<any>>;
}
