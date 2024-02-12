import { Types } from 'mongoose';
export declare class ProductDto {
    _id: Types.ObjectId;
    performerId: Types.ObjectId;
    digitalFileId: Types.ObjectId;
    digitalFileUrl: string;
    imageId: Types.ObjectId;
    image: string;
    type: string;
    name: string;
    slug: string;
    description: string;
    status: string;
    price: number;
    stock: number;
    performer: any;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    isBookMarked: boolean;
    stats: {
        likes: number;
        bookmarks: number;
        comments: number;
        views: number;
    };
    constructor(init: Partial<ProductDto>);
    toPublic(): {
        _id: Types.ObjectId;
        performerId: Types.ObjectId;
        digitalFileId: Types.ObjectId;
        image: string;
        type: string;
        name: string;
        slug: string;
        description: string;
        status: string;
        price: number;
        stock: number;
        performer: any;
        createdBy: Types.ObjectId;
        updatedBy: Types.ObjectId;
        createdAt: Date;
        updatedAt: Date;
        isBookMarked: boolean;
        stats: {
            likes: number;
            bookmarks: number;
            comments: number;
            views: number;
        };
    };
}
