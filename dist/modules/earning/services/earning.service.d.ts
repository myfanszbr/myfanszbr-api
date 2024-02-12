import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
import { UserDto } from 'src/modules/user/dtos';
import { EarningModel } from '../models/earning.model';
import { EarningSearchRequestPayload, UpdateEarningStatusPayload } from '../payloads';
import { PerformerService } from '../../performer/services';
import { EarningDto, IEarningStatResponse } from '../dtos/earning.dto';
import { PaymentService } from '../../payment/services';
export declare class EarningService {
    private readonly userService;
    private readonly performerService;
    private readonly earningModel;
    private readonly paymentService;
    constructor(userService: UserService, performerService: PerformerService, earningModel: Model<EarningModel>, paymentService: PaymentService);
    adminSearch(req: EarningSearchRequestPayload): Promise<PageableData<EarningDto>>;
    search(req: EarningSearchRequestPayload, user: UserDto): Promise<PageableData<EarningDto>>;
    details(id: string): Promise<EarningDto>;
    stats(req: EarningSearchRequestPayload): Promise<IEarningStatResponse>;
    updatePaidStatus(payload: UpdateEarningStatusPayload): Promise<any>;
}
