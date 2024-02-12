import { Model, Types } from 'mongoose';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { SettingService } from 'src/modules/settings';
import { QueueEventService } from 'src/kernel';
import { EarningModel } from 'src/modules/earning/models/earning.model';
import { UserDto } from 'src/modules/user/dtos';
import { PayoutRequestDto } from '../dtos/payout-request.dto';
import { PayoutRequestCreatePayload, PayoutRequestSearchPayload, PayoutRequestUpdatePayload, PayoutRequestPerformerUpdatePayload } from '../payloads/payout-request.payload';
import { PayoutRequestModel } from '../models/payout-request.model';
export declare class PayoutRequestService {
    private readonly earningModel;
    private readonly payoutRequestModel;
    private readonly queueEventService;
    private readonly performerService;
    private readonly mailService;
    private readonly settingService;
    constructor(earningModel: Model<EarningModel>, payoutRequestModel: Model<PayoutRequestModel>, queueEventService: QueueEventService, performerService: PerformerService, mailService: MailerService, settingService: SettingService);
    search(req: PayoutRequestSearchPayload, user?: UserDto): Promise<any>;
    findById(id: string | object): Promise<any>;
    performerCreate(payload: PayoutRequestCreatePayload, user: UserDto): Promise<PayoutRequestDto>;
    calculate(user: UserDto, payload?: any): Promise<any>;
    performerUpdate(id: string, payload: PayoutRequestPerformerUpdatePayload, performer: UserDto): Promise<PayoutRequestDto>;
    details(id: string, user: UserDto): Promise<PayoutRequestDto>;
    adminDetails(id: string): Promise<PayoutRequestDto>;
    adminDelete(id: string): Promise<{
        deleted: boolean;
    }>;
    adminUpdateStatus(id: string | Types.ObjectId, payload: PayoutRequestUpdatePayload): Promise<any>;
}
