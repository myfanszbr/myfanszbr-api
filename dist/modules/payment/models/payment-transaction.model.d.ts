import { Document } from "mongoose";
import { Types } from "mongoose";
export declare class PaymentProductModel {
    name: string;
    description: string;
    price: number;
    extraInfo: any;
    productType: string;
    productId: Types.ObjectId;
    performerId: Types.ObjectId;
    quantity: number;
    tokens: number;
}
export declare class PaymentTransactionModel extends Document {
    paymentGateway: string;
    source: string;
    sourceId: Types.ObjectId;
    target: string;
    targetId: Types.ObjectId;
    performerId: Types.ObjectId;
    couponInfo: any;
    type: string;
    totalPrice: number;
    originalPrice: number;
    products: PaymentProductModel[];
    paymentResponseInfo: any;
    invoiceId: string;
    stripeClientSecret: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
