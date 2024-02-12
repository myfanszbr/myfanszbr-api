import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { TokenTransactionSearchService } from 'src/modules/token-transaction/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { UserDto } from 'src/modules/user/dtos';
import { VideoDto } from '../dtos';
import { VideoSearchRequest } from '../payloads';
import { VideoModel } from '../models';
export declare class VideoSearchService {
    private readonly tokenTransactionSearchService;
    private readonly performerService;
    private readonly subscriptionService;
    private readonly videoModel;
    private readonly fileService;
    constructor(tokenTransactionSearchService: TokenTransactionSearchService, performerService: PerformerService, subscriptionService: SubscriptionService, videoModel: Model<VideoModel>, fileService: FileService);
    adminSearch(req: VideoSearchRequest): Promise<PageableData<VideoDto>>;
    performerSearch(req: VideoSearchRequest, performer: UserDto): Promise<PageableData<VideoDto>>;
    userSearch(req: VideoSearchRequest, user: UserDto): Promise<PageableData<VideoDto>>;
    mapArrayInfo(data: any, user: UserDto): Promise<any>;
}
