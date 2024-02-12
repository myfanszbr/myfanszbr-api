import { DataResponse } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { FeedService } from '../services';
import { FeedSearchRequest } from '../payloads';
export declare class UserFeedController {
    private readonly feedService;
    private readonly authService;
    constructor(feedService: FeedService, authService: AuthService);
    getPerformerFeeds(query: FeedSearchRequest, user: UserDto, req: any): Promise<DataResponse<any>>;
    details(id: string, user: UserDto, req: any): Promise<DataResponse<any>>;
    checkAuth(req: any): Promise<DataResponse<boolean>>;
    create(pollId: string, user: UserDto): Promise<DataResponse<any>>;
}
