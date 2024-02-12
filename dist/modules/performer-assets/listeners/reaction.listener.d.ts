import { QueueEventService, QueueEvent } from 'src/kernel';
import { MailerService } from 'src/modules/mailer';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { GalleryService, ProductService } from '../services';
import { VideoService } from '../services/video.service';
export declare class ReactionAssetsListener {
    private readonly performerService;
    private readonly userService;
    private readonly queueEventService;
    private readonly videoService;
    private readonly galleryService;
    private readonly productService;
    private readonly mailerService;
    constructor(performerService: PerformerService, userService: UserService, queueEventService: QueueEventService, videoService: VideoService, galleryService: GalleryService, productService: ProductService, mailerService: MailerService);
    handleReaction(event: QueueEvent): Promise<void>;
}
