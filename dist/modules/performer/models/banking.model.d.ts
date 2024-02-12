import { Document } from 'mongoose';
import { Types } from 'mongoose';
export declare class BankingModel extends Document {
    firstName?: string;
    lastName?: string;
    SSN?: string;
    bankName?: string;
    bankAccount?: string;
    bankRouting?: string;
    bankSwiftCode?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    performerId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
