import { SearchRequest } from 'src/kernel/common';
export declare class GallerySearchRequest extends SearchRequest {
    performerId: string;
    excludedId: string;
    status: string;
    fromDate: string;
    toDate: string;
}
