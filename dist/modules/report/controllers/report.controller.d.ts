import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { ReportService } from '../services/report.service';
import { ReportCreatePayload, ReportSearchRequestPayload } from '../payloads';
import { ReportDto } from '../dtos/report.dto';
import { UserDto } from '../../user/dtos';
export declare class ReportController {
    private readonly authService;
    private readonly reportService;
    constructor(authService: AuthService, reportService: ReportService);
    create(user: UserDto, payload: ReportCreatePayload): Promise<DataResponse<ReportDto>>;
    remove(id: string): Promise<DataResponse<any>>;
    bookmarkFeeds(query: ReportSearchRequestPayload): Promise<DataResponse<PageableData<ReportDto>>>;
}
