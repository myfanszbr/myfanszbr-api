import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { QueueEventService } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { FileService } from 'src/modules/file/services';
import { PostDto } from '../dtos';
import { PostCreatePayload, PostUpdatePayload } from '../payloads';
import { PostModel, PostMetaModel } from '../models';
export declare class PostService {
    private readonly postModel;
    private readonly postMetaModel;
    private readonly fileService;
    private readonly queueEventService;
    constructor(postModel: Model<PostModel>, postMetaModel: Model<PostMetaModel>, fileService: FileService, queueEventService: QueueEventService);
    find(params: any): Promise<PostModel[]>;
    findByIdOrSlug(id: string | Types.ObjectId): Promise<PostModel>;
    generateSlug(title: string, id?: string | Types.ObjectId): any;
    checkOrdering(ordering: number, id?: string | Types.ObjectId): any;
    create(payload: PostCreatePayload, user?: UserDto): Promise<PostModel>;
    update(id: string | Types.ObjectId, payload: PostUpdatePayload, user?: UserDto): Promise<PostModel>;
    delete(id: string | Types.ObjectId, user?: UserDto): Promise<boolean>;
    adminGetDetails(id: string): Promise<PostDto>;
    getPublic(id: string): Promise<PostDto>;
    private categoryChangeUpdater;
}
