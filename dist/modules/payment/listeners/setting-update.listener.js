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
exports.SettingsUpdatedListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../settings/constants");
const providers_1 = require("../providers");
const PAYMENT_UPDATE_TOPIC = 'STRIPE_UPDATE_TOPIC';
let SettingsUpdatedListener = class SettingsUpdatedListener {
    constructor(queueEventService, paymentCardModel, paymentCustomerModel, subscriptionPlanModel) {
        this.queueEventService = queueEventService;
        this.paymentCardModel = paymentCardModel;
        this.paymentCustomerModel = paymentCustomerModel;
        this.subscriptionPlanModel = subscriptionPlanModel;
        this.queueEventService.subscribe(constants_1.SETTING_CHANNEL, PAYMENT_UPDATE_TOPIC, this.subscribe.bind(this));
    }
    async subscribe(event) {
        const { key, value, oldValue } = event.data;
        if (event.eventName !== 'update')
            return;
        if (![
            constants_1.SETTING_KEYS.PAYMENT_GATEWAY,
            constants_1.SETTING_KEYS.STRIPE_PUBLISHABLE_KEY,
            constants_1.SETTING_KEYS.STRIPE_SECRET_KEY
        ].includes(key)) {
            return;
        }
        if (`${value}` === `${oldValue}`)
            return;
        await this.paymentCardModel.deleteMany({ paymentGateway: 'stripe' });
        await this.paymentCustomerModel.deleteMany({});
        await this.subscriptionPlanModel.deleteMany({});
    }
};
SettingsUpdatedListener = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(providers_1.PAYMENT_CARD_MODEL_PROVIDER)),
    __param(2, (0, common_1.Inject)(providers_1.PAYMENT_CUSTOMER_MODEL_PROVIDER)),
    __param(3, (0, common_1.Inject)(providers_1.SUBSCRIPTION_PLAN_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], SettingsUpdatedListener);
exports.SettingsUpdatedListener = SettingsUpdatedListener;
//# sourceMappingURL=setting-update.listener.js.map