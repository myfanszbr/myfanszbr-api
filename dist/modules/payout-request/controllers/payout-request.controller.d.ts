import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PayoutRequestCreatePayload, PayoutRequestPerformerUpdatePayload, PayoutRequestSearchPayload } from '../payloads/payout-request.payload';
import { PayoutRequestService } from '../services/payout-request.service';
import { PayoutRequestDto } from '../dtos/payout-request.dto';
export declare class PayoutRequestController {
    private readonly payoutRequestService;
    constructor(payoutRequestService: PayoutRequestService);
    create(payload: PayoutRequestCreatePayload, user: UserDto): Promise<DataResponse<any>>;
    calculate(payload: {
        performerId: string;
    }, user: UserDto): Promise<DataResponse<any>>;
    update(id: string, payload: PayoutRequestPerformerUpdatePayload, performer: UserDto): Promise<DataResponse<any>>;
    details(id: string, user: UserDto): Promise<DataResponse<any>>;
    performerSearch(req: PayoutRequestSearchPayload, user: UserDto): Promise<DataResponse<PageableData<PayoutRequestDto>>>;
}
