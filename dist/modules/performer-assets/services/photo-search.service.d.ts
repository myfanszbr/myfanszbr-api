import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { UserDto } from 'src/modules/user/dtos';
import { TokenTransactionSearchService } from 'src/modules/token-transaction/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { PhotoModel } from '../models';
import { PhotoDto } from '../dtos';
import { PhotoSearchRequest } from '../payloads';
import { GalleryService } from './gallery.service';
export declare class PhotoSearchService {
    private readonly tokenTransactionSearchService;
    private readonly subscriptionService;
    private readonly performerService;
    private readonly photoModel;
    private readonly galleryService;
    private readonly fileService;
    constructor(tokenTransactionSearchService: TokenTransactionSearchService, subscriptionService: SubscriptionService, performerService: PerformerService, photoModel: Model<PhotoModel>, galleryService: GalleryService, fileService: FileService);
    adminSearch(req: PhotoSearchRequest, jwToken: string): Promise<PageableData<PhotoDto>>;
    performerSearch(req: PhotoSearchRequest, user: UserDto, jwToken: string): Promise<PageableData<PhotoDto>>;
    searchPhotos(req: PhotoSearchRequest, user: UserDto, jwToken: string): Promise<{
        data: PhotoDto[];
        total: number;
    }>;
}
