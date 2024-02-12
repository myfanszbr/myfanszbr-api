import { SearchRequest } from 'src/kernel/common';
export declare class UserSearchRequestPayload extends SearchRequest {
    name: string;
    q: string;
    exactMatch: boolean;
    role: string;
    gender: string;
    status: string;
    country: string;
    verifiedEmail: string;
}
