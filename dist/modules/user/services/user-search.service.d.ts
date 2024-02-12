import { Model } from 'mongoose';
import { PageableData } from 'src/kernel/common';
import { PerformerBlockService } from 'src/modules/block/services';
import { UserModel } from '../models';
import { UserDto } from '../dtos';
import { UserSearchRequestPayload } from '../payloads';
export declare class UserSearchService {
    private readonly performerBlockService;
    private readonly userModel;
    constructor(performerBlockService: PerformerBlockService, userModel: Model<UserModel>);
    search(req: UserSearchRequestPayload): Promise<PageableData<UserDto>>;
    performerSearch(req: UserSearchRequestPayload): Promise<PageableData<UserDto>>;
    searchByKeyword(req: UserSearchRequestPayload): Promise<any>;
}
