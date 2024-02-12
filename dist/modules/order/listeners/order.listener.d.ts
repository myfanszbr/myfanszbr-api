import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { ProductService } from 'src/modules/performer-assets/services';
import { OrderDto } from '../dtos';
import { OrderModel, ShippingAddressModel } from '../models';
export declare class OrderListener {
    private readonly productService;
    private readonly orderModel;
    private readonly shippingAddressModel;
    private readonly queueEventService;
    constructor(productService: ProductService, orderModel: Model<OrderModel>, shippingAddressModel: Model<ShippingAddressModel>, queueEventService: QueueEventService);
    handleListen(event: QueueEvent): Promise<OrderDto>;
}
