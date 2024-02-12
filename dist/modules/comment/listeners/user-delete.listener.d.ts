import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { FeedService } from 'src/modules/feed/services';
import { GalleryService, VideoService } from 'src/modules/performer-assets/services';
import { CommentModel } from '../models/comment.model';
export declare class DeleteUserListener {
    private readonly feedService;
    private readonly videoService;
    private readonly galleryService;
    private readonly queueEventService;
    private readonly commentModel;
    constructor(feedService: FeedService, videoService: VideoService, galleryService: GalleryService, queueEventService: QueueEventService, commentModel: Model<CommentModel>);
    private handleDeletePerformer;
    private handleDeleteUser;
}
