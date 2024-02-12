import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { ReactionService } from '../services/reaction.service';
import { ReactionCreatePayload, ReactionSearchRequestPayload } from '../payloads';
import { ReactionDto } from '../dtos/reaction.dto';
import { UserDto } from '../../user/dtos';
export declare class ReactionController {
    private readonly authService;
    private readonly reactionService;
    constructor(authService: AuthService, reactionService: ReactionService);
    create(user: UserDto, payload: ReactionCreatePayload): Promise<DataResponse<ReactionDto>>;
    remove(user: UserDto, payload: ReactionCreatePayload): Promise<DataResponse<boolean>>;
    bookmarkFeeds(query: ReactionSearchRequestPayload, user: UserDto, req: any): Promise<DataResponse<PageableData<ReactionDto>>>;
    bookmarkProducts(query: ReactionSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<ReactionDto>>>;
    bookmarkVideo(query: ReactionSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<ReactionDto>>>;
    bookmarkGalleries(query: ReactionSearchRequestPayload, user: UserDto, req: any): Promise<DataResponse<PageableData<ReactionDto>>>;
    bookmarkPerformers(req: ReactionSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<ReactionDto>>>;
}
