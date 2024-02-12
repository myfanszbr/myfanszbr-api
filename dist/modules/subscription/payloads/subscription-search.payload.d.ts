import { SearchRequest } from 'src/kernel';
export declare class SubscriptionSearchRequestPayload extends SearchRequest {
    userIds: string[];
    userId: string;
    performerId: string;
    transactionId: string;
    subscriptionId: string;
    subscriptionType: string;
    paymentGateway: string;
    status: string;
    fromDate: string;
    toDate: string;
}
