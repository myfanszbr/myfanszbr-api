import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto } from 'src/modules/file';
import { FeedCreatePayload, FeedSearchRequest, PollCreatePayload } from '../payloads';
import { FeedDto } from '../dtos';
import { FeedService, FeedFileService } from '../services';
export declare class PerformerFeedController {
    private readonly feedService;
    private readonly authService;
    private readonly feedFileService;
    constructor(feedService: FeedService, authService: AuthService, feedFileService: FeedFileService);
    create(payload: FeedCreatePayload, user: UserDto): Promise<DataResponse<any>>;
    getMyFeeds(query: FeedSearchRequest, performer: UserDto, req: any): Promise<DataResponse<PageableData<any>>>;
    getPerformerFeed(user: UserDto, id: string, req: any): Promise<DataResponse<FeedDto>>;
    updateFeed(user: UserDto, id: string, payload: FeedCreatePayload): Promise<DataResponse<any>>;
    deletePerformerFeed(user: UserDto, id: string): Promise<DataResponse<any>>;
    createPollFeed(payload: PollCreatePayload, user: UserDto): Promise<DataResponse<any>>;
    uploadImage(file: FileDto): Promise<any>;
    uploadVideo(file: FileDto): Promise<any>;
    uploadAudio(file: FileDto): Promise<any>;
    uploadThumb(file: FileDto): Promise<any>;
    uploadTeaser(file: FileDto): Promise<any>;
}
