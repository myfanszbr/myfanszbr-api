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
exports.TransactionSubscriptionListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../payment/constants");
const constants_2 = require("../../../kernel/constants");
const moment = require("moment");
const services_1 = require("../../performer/services");
const services_2 = require("../../user/services");
const subscription_provider_1 = require("../providers/subscription.provider");
const subscription_dto_1 = require("../dtos/subscription.dto");
const constants_3 = require("../constants");
const UPDATE_SUBSCRIPTION_TOPIC = 'UPDATE_SUBSCRIPTION_TOPIC';
let TransactionSubscriptionListener = class TransactionSubscriptionListener {
    constructor(performerService, userService, subscriptionModel, queueEventService) {
        this.performerService = performerService;
        this.userService = userService;
        this.subscriptionModel = subscriptionModel;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe(constants_1.TRANSACTION_SUCCESS_CHANNEL, UPDATE_SUBSCRIPTION_TOPIC, this.handleListenSubscription.bind(this));
    }
    async handleListenSubscription(event) {
        var _a, _b;
        if (![constants_2.EVENT.CREATED].includes(event.eventName))
            return;
        const transaction = event.data;
        if (transaction.status !== constants_1.PAYMENT_STATUS.SUCCESS)
            return;
        if (![
            constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION,
            constants_1.PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
            constants_1.PAYMENT_TYPE.FREE_SUBSCRIPTION
        ].includes(transaction.type))
            return;
        const subscription = await this.subscriptionModel.findOne({
            userId: transaction.sourceId,
            performerId: transaction.performerId
        });
        const performer = await this.performerService.findById(transaction.performerId);
        if (!performer)
            return;
        const subscriptionId = ((_a = transaction === null || transaction === void 0 ? void 0 : transaction.paymentResponseInfo) === null || _a === void 0 ? void 0 : _a.subscriptionId) || ((_b = transaction === null || transaction === void 0 ? void 0 : transaction.paymentResponseInfo) === null || _b === void 0 ? void 0 : _b.subscription_id);
        let expiredAt = moment().endOf('day').toDate();
        let nextRecurringDate = expiredAt;
        const subscriptionType = transaction.type === constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION
            ? constants_3.SUBSCRIPTION_TYPE.MONTHLY
            : transaction.type === constants_1.PAYMENT_TYPE.YEARLY_SUBSCRIPTION
                ? constants_3.SUBSCRIPTION_TYPE.YEARLY : constants_3.SUBSCRIPTION_TYPE.FREE;
        if (subscription) {
            if (subscription.status !== constants_3.SUBSCRIPTION_STATUS.ACTIVE || (!subscription.usedFreeSubscription && transaction.type === constants_1.PAYMENT_TYPE.FREE_SUBSCRIPTION)) {
                await Promise.all([
                    this.performerService.updateSubscriptionStat(subscription.performerId, 1),
                    this.userService.updateStats(subscription.userId, { 'stats.totalSubscriptions': 1 })
                ]);
            }
            switch (transaction.type) {
                case constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION:
                    expiredAt = moment().isBefore(subscription.expiredAt) ? moment(subscription.expiredAt).add(30, 'days').endOf('day').toDate() : moment().add(30, 'days').endOf('day').toDate();
                    nextRecurringDate = moment().add(30, 'days').endOf('day').toDate();
                    break;
                case constants_1.PAYMENT_TYPE.YEARLY_SUBSCRIPTION:
                    expiredAt = moment().isBefore(subscription.expiredAt) ? moment(subscription.expiredAt).add(365, 'days').endOf('day').toDate() : moment().add(365, 'days').endOf('day').toDate();
                    nextRecurringDate = moment().add(365, 'days').endOf('day').toDate();
                    break;
                default: break;
            }
            subscription.paymentGateway = transaction.paymentGateway;
            subscription.expiredAt = expiredAt;
            subscription.updatedAt = new Date();
            subscription.subscriptionType = subscriptionType;
            subscription.transactionId = transaction._id;
            subscription.nextRecurringDate = nextRecurringDate;
            subscription.status = constants_3.SUBSCRIPTION_STATUS.ACTIVE;
            subscription.usedFreeSubscription = transaction.type === constants_1.PAYMENT_TYPE.FREE_SUBSCRIPTION;
            await subscription.save();
            return;
        }
        expiredAt = transaction.type === constants_1.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION
            ? moment().add(30, 'days').toDate()
            : transaction.type === constants_1.PAYMENT_TYPE.YEARLY_SUBSCRIPTION
                ? moment().add(365, 'days').toDate() : moment().add(performer.durationFreeSubscriptionDays, 'days').toDate();
        const newSubscription = await this.subscriptionModel.create({
            performerId: transaction.performerId,
            userId: transaction.sourceId,
            paymentGateway: transaction.paymentGateway,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiredAt: new Date(expiredAt),
            subscriptionType,
            subscriptionId,
            meta: {},
            startRecurringDate: new Date(),
            nextRecurringDate: expiredAt,
            transactionId: transaction._id,
            status: constants_3.SUBSCRIPTION_STATUS.ACTIVE,
            usedFreeSubscription: transaction.type === constants_1.PAYMENT_TYPE.FREE_SUBSCRIPTION
        });
        await Promise.all([
            this.performerService.updateSubscriptionStat(newSubscription.performerId, 1),
            this.userService.updateStats(newSubscription.userId, { 'stats.totalSubscriptions': 1 })
        ]);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.NEW_SUBSCRIPTION_CHANNEL,
            eventName: constants_2.EVENT.CREATED,
            data: new subscription_dto_1.SubscriptionDto(newSubscription)
        }));
    }
};
TransactionSubscriptionListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(2, (0, common_1.Inject)(subscription_provider_1.SUBSCRIPTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        services_2.UserService,
        mongoose_1.Model,
        kernel_1.QueueEventService])
], TransactionSubscriptionListener);
exports.TransactionSubscriptionListener = TransactionSubscriptionListener;
//# sourceMappingURL=transaction-update.listener.js.map