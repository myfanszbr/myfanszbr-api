import { SearchRequest } from 'src/kernel/common';
export declare class VideoSearchRequest extends SearchRequest {
    performerId: string;
    excludedId: string;
    status: string;
    isSale: string;
    fromDate: string;
    toDate: string;
}
