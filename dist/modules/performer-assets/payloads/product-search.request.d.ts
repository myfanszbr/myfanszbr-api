import { SearchRequest } from 'src/kernel/common';
export declare class ProductSearchRequest extends SearchRequest {
    performerId: string;
    status: string;
    excludedId: string;
    fromDate: string;
    toDate: string;
}
