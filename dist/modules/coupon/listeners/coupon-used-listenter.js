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
exports.UpdateCouponUsesListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../payment/constants");
const constants_2 = require("../../../kernel/constants");
const settings_1 = require("../../settings");
const constants_3 = require("../../settings/constants");
const mailer_1 = require("../../mailer");
const services_1 = require("../../user/services");
const coupon_service_1 = require("../services/coupon.service");
const UPDATE_COUPON_USED_TOPIC = 'UPDATE_COUPON_USED_TOPIC';
let UpdateCouponUsesListener = class UpdateCouponUsesListener {
    constructor(userService, queueEventService, couponService, mailerService) {
        this.userService = userService;
        this.queueEventService = queueEventService;
        this.couponService = couponService;
        this.mailerService = mailerService;
        this.queueEventService.subscribe(constants_1.TRANSACTION_SUCCESS_CHANNEL, UPDATE_COUPON_USED_TOPIC, this.handleUpdateCoupon.bind(this));
    }
    async handleUpdateCoupon(event) {
        if (![constants_2.EVENT.CREATED].includes(event.eventName)) {
            return;
        }
        const transaction = event.data;
        if (transaction.status !== constants_1.PAYMENT_STATUS.SUCCESS) {
            return;
        }
        if (!transaction.couponInfo || !transaction.couponInfo._id) {
            return;
        }
        await this.couponService.updateNumberOfUses(transaction.couponInfo._id);
        if (transaction.type === constants_1.PAYMENT_TYPE.TOKEN_PACKAGE) {
            const adminEmail = settings_1.SettingService.getValueByKey(constants_3.SETTING_KEYS.ADMIN_EMAIL);
            const user = await this.userService.findById(transaction.sourceId);
            user && adminEmail && await this.mailerService.send({
                subject: 'Coupon Used',
                to: adminEmail,
                data: {
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                    transactionId: (transaction._id.toString()).slice(16, 24)
                },
                template: 'admin-coupon-used'
            });
        }
    }
};
UpdateCouponUsesListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.UserService))),
    __metadata("design:paramtypes", [services_1.UserService,
        kernel_1.QueueEventService,
        coupon_service_1.CouponService,
        mailer_1.MailerService])
], UpdateCouponUsesListener);
exports.UpdateCouponUsesListener = UpdateCouponUsesListener;
//# sourceMappingURL=coupon-used-listenter.js.map