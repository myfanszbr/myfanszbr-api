import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { ReportModel } from '../models/report.model';
export declare class DeleteUserReactionListener {
    private readonly queueEventService;
    private readonly reportModel;
    constructor(queueEventService: QueueEventService, reportModel: Model<ReportModel>);
    private handleDeletePerformer;
    private handleDeleteUser;
}
