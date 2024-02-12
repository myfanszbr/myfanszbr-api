import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { StripeService } from '../services';
import { AuthoriseCardPayload } from '../payloads/authorise-card.payload';
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    authoriseCard(user: UserDto, payload: AuthoriseCardPayload): Promise<DataResponse<any>>;
}
