"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const https = require("https");
const kernel_1 = require("../../kernel");
const subscription_module_1 = require("../subscription/subscription.module");
const stream_provider_1 = require("./providers/stream.provider");
const performer_module_1 = require("../performer/performer.module");
const auth_module_1 = require("../auth/auth.module");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const message_module_1 = require("../message/message.module");
const socket_module_1 = require("../socket/socket.module");
const gateways_1 = require("./gateways");
const listeners_1 = require("./listeners");
const setting_module_1 = require("../settings/setting.module");
const payment_module_1 = require("../payment/payment.module");
const user_module_1 = require("../user/user.module");
const token_transaction_module_1 = require("../token-transaction/token-transaction.module");
const follow_module_1 = require("../follow/follow.module");
const mailer_module_1 = require("../mailer/mailer.module");
const agent = new https.Agent({
    rejectUnauthorized: process.env.REJECT_UNAUTHORIZED !== 'false'
});
let StreamModule = class StreamModule {
};
StreamModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            axios_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
                httpsAgent: agent
            }),
            kernel_1.QueueModule.forRoot(),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => subscription_module_1.SubscriptionModule),
            (0, common_1.forwardRef)(() => message_module_1.MessageModule),
            (0, common_1.forwardRef)(() => socket_module_1.SocketModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => message_module_1.MessageModule),
            (0, common_1.forwardRef)(() => setting_module_1.SettingModule),
            (0, common_1.forwardRef)(() => payment_module_1.PaymentModule),
            (0, common_1.forwardRef)(() => token_transaction_module_1.TokenTransactionModule),
            (0, common_1.forwardRef)(() => follow_module_1.FollowModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule)
        ],
        providers: [
            ...stream_provider_1.assetsProviders,
            services_1.StreamService,
            services_1.AgoraService,
            listeners_1.StreamConnectListener,
            gateways_1.PublicStreamWsGateway
        ],
        controllers: [controllers_1.StreamController, controllers_1.AgoraController],
        exports: [services_1.StreamService]
    })
], StreamModule);
exports.StreamModule = StreamModule;
//# sourceMappingURL=stream.module.js.map