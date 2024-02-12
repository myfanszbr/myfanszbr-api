"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const kernel_1 = require("../../kernel");
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const listeners_1 = require("./listeners");
const user_module_1 = require("../user/user.module");
const token_transaction_module_1 = require("../token-transaction/token-transaction.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const mailer_module_1 = require("../mailer/mailer.module");
const file_module_1 = require("../file/file.module");
let OrderModule = class OrderModule {
};
OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => performer_assets_module_1.PerformerAssetsModule),
            (0, common_1.forwardRef)(() => token_transaction_module_1.TokenTransactionModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule),
            (0, common_1.forwardRef)(() => file_module_1.FileModule)
        ],
        providers: [
            ...providers_1.orderProviders,
            ...providers_1.shippingAddressProviders,
            services_1.OrderService,
            listeners_1.OrderListener,
            services_1.ShippingAddressService
        ],
        controllers: [
            controllers_1.OrderController,
            controllers_1.ShippingAddressController
        ],
        exports: [
            ...providers_1.orderProviders,
            services_1.OrderService
        ]
    })
], OrderModule);
exports.OrderModule = OrderModule;
//# sourceMappingURL=order.module.js.map