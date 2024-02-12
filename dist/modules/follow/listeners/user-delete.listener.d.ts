import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { FollowModel } from '../models/follow.model';
export declare class DeletePerformerFollowListener {
    private readonly queueEventService;
    private readonly followModel;
    constructor(queueEventService: QueueEventService, followModel: Model<FollowModel>);
    private handleDeleteData;
}
