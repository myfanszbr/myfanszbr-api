import { Model } from 'mongoose';
import { FeedModel } from 'src/modules/feed/models';
import { GalleryModel, PhotoModel, ProductModel, VideoModel } from 'src/modules/performer-assets/models';
import { UserModel } from 'src/modules/user/models';
import { PerformerModel } from 'src/modules/performer/models';
import { SubscriptionModel } from 'src/modules/subscription/models/subscription.model';
import { OrderModel } from 'src/modules/order/models';
import { EarningModel } from 'src/modules/earning/models/earning.model';
export declare class StatisticService {
    private readonly galleryModel;
    private readonly photoModel;
    private readonly productModel;
    private readonly videoModel;
    private readonly feedModel;
    private readonly userModel;
    private readonly performerModel;
    private readonly subscriptionModel;
    private readonly orderModel;
    private readonly earningModel;
    constructor(galleryModel: Model<GalleryModel>, photoModel: Model<PhotoModel>, productModel: Model<ProductModel>, videoModel: Model<VideoModel>, feedModel: Model<FeedModel>, userModel: Model<UserModel>, performerModel: Model<PerformerModel>, subscriptionModel: Model<SubscriptionModel>, orderModel: Model<OrderModel>, earningModel: Model<EarningModel>);
    stats(): Promise<any>;
}
