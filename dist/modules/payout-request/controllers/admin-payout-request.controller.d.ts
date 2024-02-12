import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PayoutRequestService } from '../services/payout-request.service';
import { PayoutRequestSearchPayload, PayoutRequestUpdatePayload } from '../payloads/payout-request.payload';
import { PayoutRequestDto } from '../dtos/payout-request.dto';
export declare class AdminPayoutRequestController {
    private readonly payoutRequestService;
    constructor(payoutRequestService: PayoutRequestService);
    adminSearch(req: PayoutRequestSearchPayload, user: UserDto): Promise<DataResponse<PageableData<PayoutRequestDto>>>;
    updateStatus(id: string, payload: PayoutRequestUpdatePayload): Promise<DataResponse<any>>;
    adminDetails(id: string): Promise<DataResponse<any>>;
    delete(id: string): Promise<DataResponse<any>>;
    calculate(payload: {
        performerId: string;
    }, user: UserDto): Promise<DataResponse<any>>;
}
