import { UserCreatePayload } from "src/modules/user/payloads";
export declare class Pay2mService {
    constructor();
    createCustomer(id: string, user: UserCreatePayload): Promise<any>;
    createRecipient(user: any): Promise<any>;
    createPayment(payment: {
        customerId: number;
        recipientId?: number;
        amount: number;
        product: {
            name: string;
            price: number;
            quantity: number;
            productId: string;
        };
    }): Promise<any>;
}
