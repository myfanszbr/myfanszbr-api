import { SearchRequest } from 'src/kernel/common';
export declare class FollowSearchRequestPayload extends SearchRequest {
    followerId: string;
    followingId: string;
}
