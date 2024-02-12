"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTransactionModule = void 0;
const kernel_1 = require("../../kernel");
const common_1 = require("@nestjs/common");
const feed_module_1 = require("../feed/feed.module");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const providers_1 = require("./providers");
const setting_module_1 = require("../settings/setting.module");
const file_module_1 = require("../file/file.module");
const mailer_module_1 = require("../mailer/mailer.module");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const socket_module_1 = require("../socket/socket.module");
const listeners_1 = require("./listeners");
const subscription_module_1 = require("../subscription/subscription.module");
const stream_module_1 = require("../stream/stream.module");
const user_module_1 = require("../user/user.module");
const message_module_1 = require("../message/message.module");
let TokenTransactionModule = class TokenTransactionModule {
};
TokenTransactionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => setting_module_1.SettingModule),
            (0, common_1.forwardRef)(() => performer_assets_module_1.PerformerAssetsModule),
            (0, common_1.forwardRef)(() => file_module_1.FileModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule),
            (0, common_1.forwardRef)(() => socket_module_1.SocketModule),
            (0, common_1.forwardRef)(() => feed_module_1.FeedModule),
            (0, common_1.forwardRef)(() => subscription_module_1.SubscriptionModule),
            (0, common_1.forwardRef)(() => stream_module_1.StreamModule),
            (0, common_1.forwardRef)(() => message_module_1.MessageModule)
        ],
        providers: [
            ...providers_1.paymentTokenProviders,
            services_1.TokenTransactionService,
            services_1.TokenTransactionSearchService,
            services_1.TokenTransactionService,
            listeners_1.PaymentTokenListener
        ],
        controllers: [
            controllers_1.PaymentTokenController,
            controllers_1.AdminPaymentTokenController
        ],
        exports: [
            ...providers_1.paymentTokenProviders,
            services_1.TokenTransactionService,
            services_1.TokenTransactionSearchService,
            services_1.TokenTransactionService
        ]
    })
], TokenTransactionModule);
exports.TokenTransactionModule = TokenTransactionModule;
//# sourceMappingURL=token-transaction.module.js.map