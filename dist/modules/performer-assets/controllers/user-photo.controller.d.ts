import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PhotoService } from '../services/photo.service';
import { PhotoSearchService } from '../services/photo-search.service';
import { PhotoSearchRequest } from '../payloads';
import { AuthService } from '../../auth/services';
export declare class UserPhotosController {
    private readonly photoService;
    private readonly photoSearchService;
    private readonly authService;
    constructor(photoService: PhotoService, photoSearchService: PhotoSearchService, authService: AuthService);
    search(query: PhotoSearchRequest, user: UserDto, req: any): Promise<DataResponse<{
        data: import("../dtos").PhotoDto[];
        total: number;
    }>>;
    details(id: string, user: UserDto, req: any): Promise<DataResponse<import("../dtos").PhotoDto>>;
    checkAuth(req: any): Promise<DataResponse<boolean>>;
}
