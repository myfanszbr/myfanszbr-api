import { Types } from 'mongoose';
import { GalleryModel } from '../models';
export declare class GalleryDto {
    _id: Types.ObjectId;
    performerId: Types.ObjectId;
    type: string;
    title: string;
    slug: string;
    description: string;
    status: string;
    processing: boolean;
    coverPhotoId: Types.ObjectId;
    price: number;
    coverPhoto: Record<string, any>;
    performer: any;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    isSale: boolean;
    isBookMarked: boolean;
    isSubscribed: boolean;
    isBought: boolean;
    numOfItems: number;
    stats: {
        likes: number;
        bookmarks: number;
        comments: number;
        views: number;
    };
    constructor(init: Partial<GalleryDto>);
    static fromModel(model: GalleryModel): GalleryDto;
}
