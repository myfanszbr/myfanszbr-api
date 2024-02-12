import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { FeedModel } from 'src/modules/feed/models';
import { GalleryModel, ProductModel, VideoModel } from 'src/modules/performer-assets/models';
import { ReactionModel } from '../models/reaction.model';
export declare class DeletePerformerReactionListener {
    private readonly queueEventService;
    private readonly reactionModel;
    private readonly feedModel;
    private readonly productModel;
    private readonly galleryModel;
    private readonly videoModel;
    constructor(queueEventService: QueueEventService, reactionModel: Model<ReactionModel>, feedModel: Model<FeedModel>, productModel: Model<ProductModel>, galleryModel: Model<GalleryModel>, videoModel: Model<VideoModel>);
    private handleDeletePerformer;
    private handleDeleteUser;
}
