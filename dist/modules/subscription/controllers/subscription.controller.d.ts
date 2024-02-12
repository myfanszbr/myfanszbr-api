import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { SubscriptionCreatePayload, SubscriptionSearchRequestPayload, SubscriptionUpdatePayload } from '../payloads';
import { SubscriptionDto } from '../dtos/subscription.dto';
import { SubscriptionService } from '../services/subscription.service';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    create(payload: SubscriptionCreatePayload): Promise<DataResponse<SubscriptionDto>>;
    update(payload: SubscriptionUpdatePayload, subscriptionId: string): Promise<DataResponse<SubscriptionDto>>;
    adminSearch(req: SubscriptionSearchRequestPayload): Promise<DataResponse<PageableData<SubscriptionDto>>>;
    adminUpdateUserStats(): Promise<DataResponse<any>>;
    performerSearch(req: SubscriptionSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<SubscriptionDto>>>;
    userSearch(req: SubscriptionSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<SubscriptionDto>>>;
}
