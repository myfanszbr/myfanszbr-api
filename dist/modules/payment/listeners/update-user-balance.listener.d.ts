import { QueueEventService, QueueEvent } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
export declare class UpdateUserBalanceListener {
    private readonly queueEventService;
    private readonly userService;
    constructor(queueEventService: QueueEventService, userService: UserService);
    handleUpdateUser(event: QueueEvent): Promise<void>;
}
