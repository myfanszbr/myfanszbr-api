import { Model } from 'mongoose';
import { AgendaService, QueueEventService } from 'src/kernel';
import { FeedModel } from '../models';
export declare class ScheduledFeedAgendaJob {
    private readonly feedModel;
    private readonly queueEventService;
    private readonly agenda;
    constructor(feedModel: Model<FeedModel>, queueEventService: QueueEventService, agenda: AgendaService);
    private defineJobs;
    private scheduleFeed;
}
