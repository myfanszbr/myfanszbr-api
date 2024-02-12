import { Model } from 'mongoose';
import { PageableData } from 'src/kernel/common';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerModel } from '../models';
import { PerformerDto } from '../dtos';
import { PerformerSearchPayload } from '../payloads';
export declare class PerformerSearchService {
    private readonly followService;
    private readonly performerModel;
    constructor(followService: FollowService, performerModel: Model<PerformerModel>);
    adminSearch(req: PerformerSearchPayload): Promise<PageableData<PerformerDto>>;
    search(req: PerformerSearchPayload, user: UserDto): Promise<PageableData<any>>;
    searchByKeyword(req: PerformerSearchPayload): Promise<any>;
    topPerformers(req: PerformerSearchPayload): Promise<PageableData<PerformerDto>>;
    randomSearch(req: PerformerSearchPayload, user: UserDto): Promise<any>;
}
