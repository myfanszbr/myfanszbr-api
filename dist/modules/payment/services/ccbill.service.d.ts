import { Types } from 'mongoose';
interface CCBillSubscription {
    salt: string;
    flexformId: string;
    recurringSubAccountNumber: string;
    price: number;
    transactionId: Types.ObjectId;
    subscriptionType: string;
}
interface CCBillSinglePurchase {
    salt: string;
    flexformId: string;
    singleSubAccountNumber: string;
    transactionId: Types.ObjectId;
    price: number;
    currencyCode?: string;
}
export declare class CCBillService {
    subscription(options: CCBillSubscription): {
        paymentUrl: string;
    };
    singlePurchase(options: CCBillSinglePurchase): {
        paymentUrl: string;
    };
}
export {};
