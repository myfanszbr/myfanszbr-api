export declare class FeedCreatePayload {
    type: string;
    title: string;
    fromSourceId: string;
    text: string;
    fileIds: string[];
    thumbnailId: string;
    teaserId: string;
    pollDescription: string;
    pollIds: string[];
    pollExpiredAt: Date;
    isSale: boolean;
    price: number;
    status: string;
    streamingScheduled: Date;
}
