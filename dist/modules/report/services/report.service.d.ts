import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { MailerService } from 'src/modules/mailer';
import { FeedService } from 'src/modules/feed/services';
import { ReportModel } from '../models/report.model';
import { ReportSearchRequestPayload, ReportCreatePayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { ReportDto } from '../dtos/report.dto';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
export declare class ReportService {
    private readonly feedService;
    private readonly performerService;
    private readonly userService;
    private readonly reportModel;
    private readonly mailService;
    constructor(feedService: FeedService, performerService: PerformerService, userService: UserService, reportModel: Model<ReportModel>, mailService: MailerService);
    create(payload: ReportCreatePayload, user: UserDto): Promise<ReportDto>;
    remove(id: any): Promise<{
        deleted: boolean;
    }>;
    search(req: ReportSearchRequestPayload): Promise<PageableData<ReportDto>>;
}
