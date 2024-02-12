"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const payment_module_1 = require("../payment/payment.module");
const auth_module_1 = require("../auth/auth.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const coupon_used_listenter_1 = require("./listeners/coupon-used-listenter");
const performer_module_1 = require("../performer/performer.module");
const setting_module_1 = require("../settings/setting.module");
const mailer_module_1 = require("../mailer/mailer.module");
const user_module_1 = require("../user/user.module");
let CouponModule = class CouponModule {
};
CouponModule = __decorate([
    (0, common_1.Module)({
        imports: [
            kernel_1.MongoDBModule,
            (0, common_1.forwardRef)(() => performer_module_1.PerformerModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => payment_module_1.PaymentModule),
            (0, common_1.forwardRef)(() => mailer_module_1.MailerModule),
            (0, common_1.forwardRef)(() => setting_module_1.SettingModule)
        ],
        providers: [...providers_1.couponProviders, services_1.CouponService, services_1.CouponSearchService, coupon_used_listenter_1.UpdateCouponUsesListener],
        controllers: [controllers_1.AdminCouponController, controllers_1.CouponController],
        exports: [services_1.CouponService, services_1.CouponSearchService]
    })
], CouponModule);
exports.CouponModule = CouponModule;
//# sourceMappingURL=coupon.module.js.map