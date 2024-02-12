"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const providers_1 = require("../../feed/providers");
const providers_2 = require("../../performer-assets/providers");
const providers_3 = require("../../user/providers");
const providers_4 = require("../../performer/providers");
const subscription_provider_1 = require("../../subscription/providers/subscription.provider");
const providers_5 = require("../../order/providers");
const earning_provider_1 = require("../../earning/providers/earning.provider");
const constants_1 = require("../../user/constants");
const constants_2 = require("../../order/constants");
let StatisticService = class StatisticService {
    constructor(galleryModel, photoModel, productModel, videoModel, feedModel, userModel, performerModel, subscriptionModel, orderModel, earningModel) {
        this.galleryModel = galleryModel;
        this.photoModel = photoModel;
        this.productModel = productModel;
        this.videoModel = videoModel;
        this.feedModel = feedModel;
        this.userModel = userModel;
        this.performerModel = performerModel;
        this.subscriptionModel = subscriptionModel;
        this.orderModel = orderModel;
        this.earningModel = earningModel;
    }
    async stats() {
        var _a, _b, _c, _d;
        const totalActiveUsers = await this.userModel.countDocuments({ status: constants_1.STATUS_ACTIVE });
        const totalInactiveUsers = await this.userModel.countDocuments({ status: constants_1.STATUS_INACTIVE });
        const totalPendingUsers = await this.userModel.countDocuments({ verifiedEmail: false });
        const totalActivePerformers = await this.performerModel.countDocuments({ status: constants_1.STATUS_ACTIVE });
        const totalInactivePerformers = await this.performerModel.countDocuments({ status: constants_1.STATUS_INACTIVE });
        const totalPendingPerformers = await this.performerModel.countDocuments({ verifiedDocument: false });
        const totalGalleries = await this.galleryModel.countDocuments({});
        const totalPhotos = await this.photoModel.countDocuments({});
        const totalVideos = await this.videoModel.countDocuments({});
        const totalPosts = await this.feedModel.countDocuments({});
        const totalSubscribers = await this.subscriptionModel.countDocuments({});
        const totalDeliveredOrders = await this.orderModel.countDocuments({ deliveryStatus: constants_2.ORDER_STATUS.DELIVERED });
        const totalShippingdOrders = await this.orderModel.countDocuments({ deliveryStatus: constants_2.ORDER_STATUS.SHIPPING });
        const totalRefundedOrders = await this.orderModel.countDocuments({ deliveryStatus: constants_2.ORDER_STATUS.REFUNDED });
        const totalProducts = await this.productModel.countDocuments({});
        const [totalGrossPrice, totalNetPrice] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $match: {}
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$grossPrice'
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: {}
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ])
        ]);
        return {
            totalActiveUsers,
            totalInactiveUsers,
            totalPendingUsers,
            totalActivePerformers,
            totalInactivePerformers,
            totalPendingPerformers,
            totalPosts,
            totalGalleries,
            totalPhotos,
            totalVideos,
            totalProducts,
            totalSubscribers,
            totalDeliveredOrders,
            totalShippingdOrders,
            totalRefundedOrders,
            totalGrossPrice: ((_a = totalGrossPrice[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            totalNetPrice: ((_b = totalNetPrice[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            totalPriceCommission: (((_c = totalGrossPrice[0]) === null || _c === void 0 ? void 0 : _c.total) - ((_d = totalNetPrice[0]) === null || _d === void 0 ? void 0 : _d.total)) || 0
        };
    }
};
StatisticService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(providers_2.PERFORMER_GALLERY_MODEL_PROVIDER)),
    __param(1, (0, common_1.Inject)(providers_2.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __param(2, (0, common_1.Inject)(providers_2.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __param(3, (0, common_1.Inject)(providers_2.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __param(4, (0, common_1.Inject)(providers_1.FEED_PROVIDER)),
    __param(5, (0, common_1.Inject)(providers_3.USER_MODEL_PROVIDER)),
    __param(6, (0, common_1.Inject)(providers_4.PERFORMER_MODEL_PROVIDER)),
    __param(7, (0, common_1.Inject)(subscription_provider_1.SUBSCRIPTION_MODEL_PROVIDER)),
    __param(8, (0, common_1.Inject)(providers_5.ORDER_MODEL_PROVIDER)),
    __param(9, (0, common_1.Inject)(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], StatisticService);
exports.StatisticService = StatisticService;
//# sourceMappingURL=statistic.service.js.map