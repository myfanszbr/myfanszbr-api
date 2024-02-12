"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const token_transaction_module_1 = require("../token-transaction/token-transaction.module");
const socket_module_1 = require("../socket/socket.module");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const payment_module_1 = require("../payment/payment.module");
const setting_module_1 = require("../settings/setting.module");
const performer_earning_controller_1 = require("./controllers/performer-earning.controller");
const admin_earning_controller_1 = require("./controllers/admin-earning.controller");
const earning_service_1 = require("./services/earning.service");
const earning_provider_1 = require("./providers/earning.provider");
const listeners_1 = require("./listeners");
const user_module_1 = require("../user/user.module");
const order_module_1 = require("../order/order.module");
const mailer_module_1 = require("../mailer/mailer.module");
let EarningModule = class EarningModule {
};
EarningModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            socket_module_1.SocketModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => payment_module_1.PaymentModule),
            (0, common_1.forwardRef)(() => setting_module_1.SettingModule),
            (0, common_1.forwardRef)(() => token_transaction_module_1.TokenTransactionModule),
            (0, common_1.forwardRef)(() => order_module_1.OrderModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule)
        ],
        providers: [...earning_provider_1.earningProviders, earning_service_1.EarningService, listeners_1.TransactionEarningListener, listeners_1.HandleDeleteItemListener],
        controllers: [performer_earning_controller_1.PerformerEarningController, admin_earning_controller_1.AdminEarningController],
        exports: [...earning_provider_1.earningProviders, earning_service_1.EarningService]
    })
], EarningModule);
exports.EarningModule = EarningModule;
//# sourceMappingURL=earning.module.js.map