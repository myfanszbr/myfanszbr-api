import { Types } from 'mongoose';
import { PostMetaPayload } from './post-meta.payload';
export declare class PostCreatePayload {
    title: string;
    authorId: Types.ObjectId;
    type: string;
    slug: string;
    ordering: number;
    content: string;
    shortDescription: string;
    categoryIds: string[];
    status: string;
    image: string;
    meta?: PostMetaPayload[];
}
