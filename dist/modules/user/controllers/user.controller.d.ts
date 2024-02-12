import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserSearchService, UserService } from '../services';
import { UserDto } from '../dtos';
import { UserSearchRequestPayload, UserUpdatePayload } from '../payloads';
export declare class UserController {
    private readonly authService;
    private readonly userService;
    private readonly userSearchService;
    constructor(authService: AuthService, userService: UserService, userSearchService: UserSearchService);
    me(req: any): Promise<DataResponse<UserDto>>;
    updateMe(currentUser: UserDto, payload: UserUpdatePayload): Promise<DataResponse<UserDto>>;
    search(req: UserSearchRequestPayload): Promise<DataResponse<PageableData<UserDto>>>;
}
