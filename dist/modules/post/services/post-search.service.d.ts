import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
import { PostModel } from '../models';
import { AdminSearch, UserSearch } from '../payloads';
export declare class PostSearchService {
    private readonly userService;
    private readonly postModel;
    constructor(userService: UserService, postModel: Model<PostModel>);
    adminSearch(req: AdminSearch): Promise<PageableData<PostModel>>;
    userSearch(req: UserSearch): Promise<PageableData<PostModel>>;
}
