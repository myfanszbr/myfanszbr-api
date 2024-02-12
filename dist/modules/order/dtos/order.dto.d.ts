import { Types } from 'mongoose';
export declare class OrderDto {
    _id: Types.ObjectId;
    transactionId: Types.ObjectId;
    performerId: Types.ObjectId;
    performerInfo?: any;
    userId: Types.ObjectId;
    userInfo?: any;
    orderNumber: string;
    shippingCode: string;
    productId: Types.ObjectId;
    productInfo: any;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    deliveryAddress?: string;
    deliveryStatus: string;
    deliveryAddressId?: Types.ObjectId;
    userNote?: string;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<OrderDto>);
}
