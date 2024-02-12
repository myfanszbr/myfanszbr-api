import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class PaymentCustomerModel extends Document {
    source: string;
    sourceId: Types.ObjectId;
    paymentGateway: string;
    isProduction: boolean;
    customerId: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
