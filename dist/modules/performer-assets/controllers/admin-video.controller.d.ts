import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { VideoCreatePayload } from '../payloads/video-create.payload';
import { VideoService } from '../services/video.service';
import { VideoSearchRequest, VideoUpdatePayload } from '../payloads';
import { VideoSearchService } from '../services/video-search.service';
export declare class AdminPerformerVideosController {
    private readonly videoService;
    private readonly videoSearchService;
    constructor(videoService: VideoService, videoSearchService: VideoSearchService);
    uploadVideo(files: Record<string, any>, payload: VideoCreatePayload): Promise<any>;
    details(id: string, req: any): Promise<DataResponse<import("../dtos").VideoDto>>;
    search(req: VideoSearchRequest): Promise<DataResponse<import("src/kernel").PageableData<import("../dtos").VideoDto>>>;
    update(files: Record<string, any>, id: string, payload: VideoUpdatePayload, updater: UserDto): Promise<DataResponse<import("../dtos").VideoDto>>;
    remove(id: string, user: UserDto): Promise<DataResponse<boolean>>;
    removeFile(id: string, user: UserDto, payload: {
        type: string;
    }): Promise<DataResponse<boolean>>;
}
