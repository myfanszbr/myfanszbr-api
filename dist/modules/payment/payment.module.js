"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const kernel_1 = require("../../kernel");
const common_1 = require("@nestjs/common");
const coupon_module_1 = require("../coupon/coupon.module");
const request_log_middleware_1 = require("../../kernel/logger/request-log.middleware");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const providers_1 = require("./providers");
const setting_module_1 = require("../settings/setting.module");
const mailer_module_1 = require("../mailer/mailer.module");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const listeners_1 = require("./listeners");
const user_module_1 = require("../user/user.module");
const subscription_module_1 = require("../subscription/subscription.module");
const socket_module_1 = require("../socket/socket.module");
const pay2m_service_1 = require("./services/pay2m.service");
let PaymentModule = class PaymentModule {
    configure(consumer) {
        consumer.apply(request_log_middleware_1.RequestLoggerMiddleware).forRoutes("/payment/*/callhook");
    }
};
PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            socket_module_1.SocketModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => setting_module_1.SettingModule),
            (0, common_1.forwardRef)(() => coupon_module_1.CouponModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule),
            (0, common_1.forwardRef)(() => subscription_module_1.SubscriptionModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule),
        ],
        providers: [
            ...providers_1.paymentProviders,
            services_1.PaymentService,
            services_1.CCBillService,
            pay2m_service_1.Pay2mService,
            services_1.StripeService,
            services_1.PaymentSearchService,
            listeners_1.TransactionMailerListener,
            listeners_1.UpdateUserBalanceListener,
            listeners_1.SettingsUpdatedListener,
            services_1.CustomerCardService,
            services_1.WebhooksPaymentService,
        ],
        controllers: [
            controllers_1.PaymentController,
            controllers_1.AdminPaymentTransactionController,
            controllers_1.PaymentTransactionController,
            controllers_1.StripeController,
            controllers_1.CancelSubscriptionController,
            controllers_1.PaymentWebhookController,
            controllers_1.PaymentCardController,
        ],
        exports: [...providers_1.paymentProviders, services_1.PaymentService, services_1.PaymentSearchService],
    })
], PaymentModule);
exports.PaymentModule = PaymentModule;
//# sourceMappingURL=payment.module.js.map