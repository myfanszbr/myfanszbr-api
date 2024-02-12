import { QueueEventService, QueueEvent } from 'src/kernel';
import { CommentService } from 'src/modules/comment/services/comment.service';
import { VideoService } from '../services/video.service';
import { GalleryService, ProductService } from '../services';
export declare class CommentAssetsListener {
    private readonly commentService;
    private readonly queueEventService;
    private readonly videoService;
    private readonly productService;
    private readonly galleryService;
    constructor(commentService: CommentService, queueEventService: QueueEventService, videoService: VideoService, productService: ProductService, galleryService: GalleryService);
    handleComment(event: QueueEvent): Promise<void>;
}
