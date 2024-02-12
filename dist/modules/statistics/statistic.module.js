"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsModule = void 0;
const common_1 = require("@nestjs/common");
const statistic_service_1 = require("./services/statistic.service");
const admin_statistics_controller_1 = require("./controllers/admin-statistics.controller");
const auth_module_1 = require("../auth/auth.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const performer_module_1 = require("../performer/performer.module");
const user_module_1 = require("../user/user.module");
const subscription_module_1 = require("../subscription/subscription.module");
const earning_module_1 = require("../earning/earning.module");
const token_transaction_module_1 = require("../token-transaction/token-transaction.module");
const feed_module_1 = require("../feed/feed.module");
const order_module_1 = require("../order/order.module");
let StatisticsModule = class StatisticsModule {
};
StatisticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => performer_assets_module_1.PerformerAssetsModule),
            (0, common_1.forwardRef)(() => subscription_module_1.SubscriptionModule),
            (0, common_1.forwardRef)(() => earning_module_1.EarningModule),
            (0, common_1.forwardRef)(() => token_transaction_module_1.TokenTransactionModule),
            (0, common_1.forwardRef)(() => feed_module_1.FeedModule),
            (0, common_1.forwardRef)(() => order_module_1.OrderModule)
        ],
        controllers: [
            admin_statistics_controller_1.AdminStatisticController
        ],
        providers: [
            statistic_service_1.StatisticService
        ],
        exports: [statistic_service_1.StatisticService]
    })
], StatisticsModule);
exports.StatisticsModule = StatisticsModule;
//# sourceMappingURL=statistic.module.js.map