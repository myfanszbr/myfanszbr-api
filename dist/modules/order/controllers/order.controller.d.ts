import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { OrderService } from '../services';
import { OrderDto } from '../dtos';
import { OrderSearchPayload, OrderUpdatePayload } from '../payloads';
export declare class OrderController {
    private readonly orderService;
    private readonly authService;
    constructor(orderService: OrderService, authService: AuthService);
    orders(req: OrderSearchPayload, user: UserDto): Promise<DataResponse<PageableData<OrderDto>>>;
    userOrders(req: OrderSearchPayload, user: any): Promise<DataResponse<PageableData<OrderDto>>>;
    findOne(id: string, payload: OrderUpdatePayload): Promise<DataResponse<any>>;
    update(id: string): Promise<DataResponse<OrderDto>>;
    updateShippingAddress(id: string, payload: any, user: any): Promise<DataResponse<any>>;
}
