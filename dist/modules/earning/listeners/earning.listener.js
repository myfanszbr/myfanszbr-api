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
exports.TransactionEarningListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../token-transaction/constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../performer/services");
const settings_1 = require("../../settings");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_2 = require("../../user/services");
const constants_3 = require("../../payment/constants");
const earning_provider_1 = require("../providers/earning.provider");
const constants_4 = require("../../settings/constants");
const EARNING_TOKEN_TOPIC = 'EARNING_TOKEN_TOPIC';
const EARNING_MONEY_TOPIC = 'EARNING_MONEY_TOPIC';
let TransactionEarningListener = class TransactionEarningListener {
    constructor(performerService, userService, PerformerEarningModel, queueEventService, socketUserService) {
        this.performerService = performerService;
        this.userService = userService;
        this.PerformerEarningModel = PerformerEarningModel;
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.queueEventService.subscribe(constants_1.TOKEN_TRANSACTION_SUCCESS_CHANNEL, EARNING_TOKEN_TOPIC, this.handleListenEarningToken.bind(this));
        this.queueEventService.subscribe(constants_3.TRANSACTION_SUCCESS_CHANNEL, EARNING_MONEY_TOPIC, this.handleListenEarningMoney.bind(this));
    }
    async handleListenEarningToken(event) {
        if (event.eventName !== constants_2.EVENT.CREATED) {
            return;
        }
        const transaction = event.data;
        if (!transaction || transaction.status !== constants_1.PURCHASE_ITEM_STATUS.SUCCESS || !transaction.totalPrice) {
            return;
        }
        const [settingCommission, performer] = await Promise.all([
            settings_1.SettingService.getValueByKey(constants_4.SETTING_KEYS.PERFORMER_COMMISSION),
            this.performerService.findById(transaction.performerId)
        ]);
        const commission = performer.commissionPercentage || settingCommission;
        const netPrice = transaction.totalPrice - transaction.totalPrice * commission;
        const newEarning = new this.PerformerEarningModel();
        newEarning.set('siteCommission', commission);
        newEarning.set('grossPrice', transaction.totalPrice);
        newEarning.set('netPrice', netPrice);
        newEarning.set('performerId', transaction.performerId);
        newEarning.set('userId', transaction.sourceId);
        newEarning.set('transactionId', transaction._id);
        newEarning.set('sourceType', transaction.target);
        newEarning.set('type', transaction.type);
        newEarning.set('createdAt', transaction.createdAt);
        newEarning.set('isPaid', false);
        newEarning.set('paymentGateway', 'system');
        newEarning.set('isToken', true);
        await newEarning.save();
        await this.updateBalance(newEarning.grossPrice, netPrice, newEarning);
        await this.notifyPerformerBalance(newEarning, netPrice);
    }
    async handleListenEarningMoney(event) {
        if (event.eventName !== constants_2.EVENT.CREATED) {
            return;
        }
        const transaction = event.data;
        if (!transaction || transaction.status !== constants_1.PURCHASE_ITEM_STATUS.SUCCESS || !transaction.totalPrice) {
            return;
        }
        if (![constants_3.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION, constants_3.PAYMENT_TYPE.YEARLY_SUBSCRIPTION].includes(transaction.type)) {
            return;
        }
        const [settingCommission, performer] = await Promise.all([
            settings_1.SettingService.getValueByKey(constants_4.SETTING_KEYS.PERFORMER_COMMISSION),
            this.performerService.findById(transaction.performerId)
        ]);
        const commission = performer.commissionPercentage || settingCommission;
        const netPrice = transaction.totalPrice - transaction.totalPrice * commission;
        const newEarning = new this.PerformerEarningModel();
        newEarning.set('siteCommission', commission);
        newEarning.set('grossPrice', transaction.totalPrice);
        newEarning.set('netPrice', netPrice);
        newEarning.set('performerId', transaction.performerId);
        newEarning.set('userId', transaction.sourceId);
        newEarning.set('transactionId', transaction._id);
        newEarning.set('sourceType', transaction.target);
        newEarning.set('type', transaction.type);
        newEarning.set('createdAt', transaction.createdAt);
        newEarning.set('updatedAt', transaction.updatedAt);
        newEarning.set('paymentGateway', transaction.paymentGateway);
        newEarning.set('isPaid', false);
        newEarning.set('isToken', false);
        await newEarning.save();
        await this.updateBalance(newEarning.grossPrice, netPrice, newEarning);
        await this.notifyPerformerBalance(newEarning, netPrice);
    }
    async updateBalance(userTokens, performerTokens, earning) {
        await Promise.all([
            this.performerService.updatePerformerBalance(earning.performerId, performerTokens),
            earning.isToken && this.userService.updateBalance(earning.userId, -userTokens)
        ]);
    }
    async notifyPerformerBalance(earning, performerTokens) {
        await this.socketUserService.emitToUsers(earning.performerId.toString(), 'update_balance', {
            token: performerTokens
        });
    }
};
TransactionEarningListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(2, (0, common_1.Inject)(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        services_2.UserService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService])
], TransactionEarningListener);
exports.TransactionEarningListener = TransactionEarningListener;
//# sourceMappingURL=earning.listener.js.map