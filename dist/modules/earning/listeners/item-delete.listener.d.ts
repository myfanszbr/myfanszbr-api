import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { PerformerModel } from 'src/modules/performer/models';
import { TokenTransactionModel } from 'src/modules/token-transaction/models';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { UserModel } from 'src/modules/user/models';
import { OrderModel } from 'src/modules/order/models';
import { MailerService } from 'src/modules/mailer';
import { EarningModel } from '../models/earning.model';
export declare class HandleDeleteItemListener {
    private readonly orderModel;
    private readonly earningModel;
    private readonly performerModel;
    private readonly userModel;
    private readonly tokenTransactionModel;
    private readonly queueEventService;
    private readonly socketUserService;
    private readonly mailerService;
    constructor(orderModel: Model<OrderModel>, earningModel: Model<EarningModel>, performerModel: Model<PerformerModel>, userModel: Model<UserModel>, tokenTransactionModel: Model<TokenTransactionModel>, queueEventService: QueueEventService, socketUserService: SocketUserService, mailerService: MailerService);
    private handleRefundOrder;
    private notifyPerformerBalance;
    private notifyUserBalance;
}
