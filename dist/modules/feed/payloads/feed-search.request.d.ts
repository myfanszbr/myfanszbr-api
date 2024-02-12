import { SearchRequest } from 'src/kernel/common';
export declare class FeedSearchRequest extends SearchRequest {
    q: string;
    performerId: string;
    type: string;
    isHome: string;
    fromDate: string;
    toDate: string;
}
