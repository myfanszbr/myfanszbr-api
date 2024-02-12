import { SearchRequest } from 'src/kernel';
export declare class AuthoriseCardPayload {
    token: string;
    holderName: string;
    last4Digits: string;
    brand: string;
    month: string;
    year: string;
    paymentGateway: string;
}
export declare class SearchCardRequest extends SearchRequest {
    isProduction: string;
    paymentGateway: string;
}
