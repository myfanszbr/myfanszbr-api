import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { UserService } from 'src/modules/user/services';
import { EarningDto } from '../dtos/earning.dto';
import { EarningModel } from '../models/earning.model';
export declare class TransactionEarningListener {
    private readonly performerService;
    private readonly userService;
    private readonly PerformerEarningModel;
    private readonly queueEventService;
    private readonly socketUserService;
    constructor(performerService: PerformerService, userService: UserService, PerformerEarningModel: Model<EarningModel>, queueEventService: QueueEventService, socketUserService: SocketUserService);
    handleListenEarningToken(event: QueueEvent): Promise<EarningDto>;
    handleListenEarningMoney(event: QueueEvent): Promise<EarningDto>;
    private updateBalance;
    private notifyPerformerBalance;
}
