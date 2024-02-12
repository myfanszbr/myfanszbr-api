import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class PaymentGatewaySettingModel extends Document {
    performerId: Types.ObjectId;
    status: string;
    key: string;
    value: any;
}
