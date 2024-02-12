"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const setting_module_1 = require("./modules/settings/setting.module");
const mailer_module_1 = require("./modules/mailer/mailer.module");
const post_module_1 = require("./modules/post/post.module");
const file_module_1 = require("./modules/file/file.module");
const performer_module_1 = require("./modules/performer/performer.module");
const utils_module_1 = require("./modules/utils/utils.module");
const performer_assets_module_1 = require("./modules/performer-assets/performer-assets.module");
const comment_module_1 = require("./modules/comment/comment.module");
const reaction_module_1 = require("./modules/reaction/reaction.module");
const payment_module_1 = require("./modules/payment/payment.module");
const subscription_module_1 = require("./modules/subscription/subscription.module");
const banner_module_1 = require("./modules/banner/banner.module");
const message_module_1 = require("./modules/message/message.module");
const socket_module_1 = require("./modules/socket/socket.module");
const coupon_module_1 = require("./modules/coupon/coupon.module");
const feed_module_1 = require("./modules/feed/feed.module");
const contact_module_1 = require("./modules/contact/contact.module");
const stream_module_1 = require("./modules/stream/stream.module");
const statistic_module_1 = require("./modules/statistics/statistic.module");
const payout_module_1 = require("./modules/payout-request/payout.module");
const order_module_1 = require("./modules/order/order.module");
const block_module_1 = require("./modules/block/block.module");
const report_module_1 = require("./modules/report/report.module");
const storage_module_1 = require("./modules/storage/storage.module");
const follow_module_1 = require("./modules/follow/follow.module");
const config_2 = require("./config");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [config_2.default]
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public')
            }),
            storage_module_1.StorageModule.forRoot(),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            post_module_1.PostModule,
            setting_module_1.SettingModule,
            mailer_module_1.MailerModule,
            file_module_1.FileModule,
            utils_module_1.UtilsModule,
            performer_module_1.PerformerModule,
            performer_assets_module_1.PerformerAssetsModule,
            comment_module_1.CommentModule,
            reaction_module_1.ReactionModule,
            payment_module_1.PaymentModule,
            subscription_module_1.SubscriptionModule,
            banner_module_1.BannerModule,
            socket_module_1.SocketModule,
            message_module_1.MessageModule,
            coupon_module_1.CouponModule,
            feed_module_1.FeedModule,
            stream_module_1.StreamModule,
            contact_module_1.ContactModule,
            statistic_module_1.StatisticsModule,
            payout_module_1.PayoutRequestModule,
            order_module_1.OrderModule,
            block_module_1.BlockModule,
            report_module_1.ReportModule,
            follow_module_1.FollowModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService]
    })
], AppModule);
exports.AppModule = AppModule;
exports.default = AppModule;
//# sourceMappingURL=app.module.js.map