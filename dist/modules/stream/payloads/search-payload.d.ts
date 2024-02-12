import { SearchRequest } from 'src/kernel';
export declare class SearchStreamPayload extends SearchRequest {
    fromDate: string;
    toDate: string;
    type: string;
    isFree: string;
    performerId: string;
}
