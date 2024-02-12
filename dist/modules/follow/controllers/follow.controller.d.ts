import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { FollowService } from '../services/follow.service';
import { FollowSearchRequestPayload } from '../payloads';
import { FollowDto } from '../dtos/follow.dto';
export declare class FollowController {
    private readonly followService;
    constructor(followService: FollowService);
    create(user: UserDto, id: string): Promise<DataResponse<FollowDto>>;
    remove(user: UserDto, id: string): Promise<DataResponse<boolean>>;
    followers(req: FollowSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<FollowDto>>>;
    following(req: FollowSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<FollowDto>>>;
}
