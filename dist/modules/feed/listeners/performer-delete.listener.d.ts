import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { FeedModel } from '../models';
export declare class DeletePerformerFeedListener {
    private readonly queueEventService;
    private readonly feedModel;
    constructor(queueEventService: QueueEventService, feedModel: Model<FeedModel>);
    private handleDeleteData;
}
