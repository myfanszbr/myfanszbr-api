import { PageableData } from 'src/kernel/common';
import { DataResponse } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserSearchRequestPayload, UserCreatePayload, AdminUpdatePayload } from '../payloads';
import { UserDto } from '../dtos';
import { UserService, UserSearchService } from '../services';
export declare class AdminUserController {
    private readonly authService;
    private readonly userService;
    private readonly userSearchService;
    constructor(authService: AuthService, userService: UserService, userSearchService: UserSearchService);
    search(req: UserSearchRequestPayload): Promise<DataResponse<PageableData<UserDto>>>;
    createUser(payload: UserCreatePayload): Promise<DataResponse<UserDto>>;
    updateUser(payload: AdminUpdatePayload, userId: string): Promise<DataResponse<any>>;
    getDetails(id: string): Promise<DataResponse<UserDto>>;
    delete(id: string): Promise<DataResponse<any>>;
}
