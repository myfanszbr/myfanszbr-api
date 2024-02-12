import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { AgoraService } from '../services';
export declare class AgoraController {
    private readonly aograService;
    constructor(aograService: AgoraService);
    buildTokenWithAccount(payload: any, currentUser: UserDto): DataResponse<string>;
}
