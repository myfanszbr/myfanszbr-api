/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { PerformerService } from 'src/modules/performer/services';
import { ProductService } from 'src/modules/performer-assets/services';
import { QueueEventService } from 'src/kernel';
import { Model, Types } from 'mongoose';
import { MailerService } from 'src/modules/mailer';
import { UserService } from 'src/modules/user/services';
import { UserDto } from 'src/modules/user/dtos';
import { OrderModel, ShippingAddressModel } from '../models';
import { OrderSearchPayload, OrderUpdatePayload } from '../payloads';
import { OrderDto } from '../dtos';
export declare class OrderService {
    private readonly userService;
    private readonly performerService;
    private readonly productService;
    private readonly orderModel;
    private readonly addressModel;
    private readonly mailService;
    private readonly queueEventService;
    constructor(userService: UserService, performerService: PerformerService, productService: ProductService, orderModel: Model<OrderModel>, addressModel: Model<ShippingAddressModel>, mailService: MailerService, queueEventService: QueueEventService);
    findById(id: string | Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, OrderModel> & Omit<OrderModel & {
        _id: Types.ObjectId;
    }, never>>;
    findByIds(ids: string[] | Types.ObjectId[]): Promise<(import("mongoose").Document<unknown, {}, OrderModel> & Omit<OrderModel & {
        _id: Types.ObjectId;
    }, never>)[]>;
    findByQuery(payload: any): Promise<(import("mongoose").Document<unknown, {}, OrderModel> & Omit<OrderModel & {
        _id: Types.ObjectId;
    }, never>)[]>;
    search(req: OrderSearchPayload, user: UserDto): Promise<{
        data: OrderDto[];
        total: number;
    }>;
    findOne(id: string): Promise<OrderDto>;
    update(id: string, payload: OrderUpdatePayload): Promise<{
        success: boolean;
    }>;
    userSearch(req: OrderSearchPayload, user: any): Promise<{
        data: OrderDto[];
        total: number;
    }>;
    updateDeliveryAddress(id: string, payload: any, user: UserDto): Promise<OrderDto>;
}
