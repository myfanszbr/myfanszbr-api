import { QueueEventService, QueueEvent } from 'src/kernel';
import { CommentService } from 'src/modules/comment/services/comment.service';
import { FeedService } from '../services/feed.service';
export declare class CommentFeedListener {
    private readonly commentService;
    private readonly queueEventService;
    private readonly feedService;
    constructor(commentService: CommentService, queueEventService: QueueEventService, feedService: FeedService);
    handleCommentFeed(event: QueueEvent): Promise<void>;
}
