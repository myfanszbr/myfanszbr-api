import { Types } from 'mongoose';
import { PerformerDto } from 'src/modules/performer/dtos';
export declare class FeedDto {
    _id: Types.ObjectId;
    type: string;
    fromSourceId: Types.ObjectId;
    fromSource: string;
    title: string;
    slug: string;
    text: string;
    pollDescription: string;
    fileIds: Array<Types.ObjectId>;
    pollIds: Array<Types.ObjectId>;
    pollExpiredAt: Date;
    totalLike: number;
    totalComment: number;
    createdAt: Date;
    updatedAt: Date;
    isLiked: boolean;
    isSubscribed: boolean;
    isBought: boolean;
    performer: PerformerDto;
    files: any;
    polls: any;
    isSale: boolean;
    price: number;
    isBookMarked: boolean;
    teaserId: Types.ObjectId;
    teaser: any;
    thumbnailId: Types.ObjectId;
    thumbnail: any;
    isPinned: boolean;
    pinnedAt: Date;
    status: string;
    isSchedule: boolean;
    scheduleAt: Date;
    streamingScheduled: Date;
    isFollowed: boolean;
    constructor(data: Partial<FeedDto>);
}
