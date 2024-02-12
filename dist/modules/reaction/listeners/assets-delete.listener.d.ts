import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { ReactionModel } from '../models/reaction.model';
export declare class DeleteAssetsListener {
    private readonly queueEventService;
    private readonly reactionModel;
    constructor(queueEventService: QueueEventService, reactionModel: Model<ReactionModel>);
    private handleDeleteData;
}
