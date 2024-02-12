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
exports.WebhooksPaymentService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const mongoose_1 = require("mongoose");
const services_1 = require("../../performer/services");
const constants_2 = require("../../subscription/constants");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_2 = require("../../user/services");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const providers_1 = require("../providers");
const constants_3 = require("../constants");
const dtos_1 = require("../dtos");
let WebhooksPaymentService = class WebhooksPaymentService {
    constructor(subscriptionService, performerService, userService, TransactionModel, queueEventService, socketUserService) {
        this.subscriptionService = subscriptionService;
        this.performerService = performerService;
        this.userService = userService;
        this.TransactionModel = TransactionModel;
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
    }
    async ccbillSinglePaymentSuccessWebhook(payload) {
        const transactionId = payload['X-transactionId'] || payload.transactionId;
        if (!transactionId) {
            throw new common_1.BadRequestException();
        }
        if (!(0, string_helper_1.isObjectId)(transactionId)) {
            return { ok: false };
        }
        const transaction = await this.TransactionModel.findById(transactionId);
        if (!transaction) {
            return { ok: false };
        }
        transaction.status = constants_3.PAYMENT_STATUS.SUCCESS;
        transaction.paymentResponseInfo = payload;
        transaction.updatedAt = new Date();
        await transaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new dtos_1.PaymentDto(transaction)
        }));
        const redirectUrl = `/payment/success?transactionId=${transaction._id.toString().slice(16, 24)}`;
        redirectUrl && await this.socketUserService.emitToUsers(transaction.sourceId, 'payment_status_callback', { redirectUrl });
        return { ok: true };
    }
    async ccbillRenewalSuccessWebhook(payload) {
        const subscriptionId = payload.subscriptionId || payload.subscription_id;
        if (!subscriptionId) {
            throw new common_1.BadRequestException();
        }
        const subscription = await this.subscriptionService.findBySubscriptionId(subscriptionId);
        if (!subscription) {
            return { ok: false };
        }
        const transaction = await this.createCCbillRenewalSubscriptionPaymentTransaction(subscription, payload);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new dtos_1.PaymentDto(transaction)
        }));
        return { ok: true };
    }
    async ccbillUserReactivation(payload) {
        const { subscriptionId } = payload;
        const subscription = await this.subscriptionService.findBySubscriptionId(subscriptionId);
        if (!subscription) {
            throw new kernel_1.EntityNotFoundException();
        }
        subscription.status = constants_2.SUBSCRIPTION_STATUS.ACTIVE;
        subscription.updatedAt = new Date();
        await subscription.save();
        await Promise.all([
            this.performerService.updateSubscriptionStat(subscription.performerId, 1),
            this.userService.updateStats(subscription.userId, { 'stats.totalSubscriptions': 1 })
        ]);
    }
    async createCCbillRenewalSubscriptionPaymentTransaction(subscription, payload) {
        const price = payload.billedAmount || payload.accountingAmount;
        const { userId, performerId, subscriptionType } = subscription;
        const performer = await this.performerService.findById(performerId);
        return this.TransactionModel.create({
            paymentGateway: 'ccbill',
            source: 'user',
            sourceId: userId,
            target: constants_3.PAYMENT_TARGET_TYPE.PERFORMER,
            targetId: performerId,
            performerId,
            type: subscriptionType === constants_2.SUBSCRIPTION_TYPE.MONTHLY ? constants_3.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : constants_3.PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
            originalPrice: price,
            totalPrice: price,
            products: [{
                    price,
                    quantity: 1,
                    name: `${subscriptionType} subscription ${(performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username)}`,
                    description: `recurring ${subscriptionType} subscription ${(performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username)}`,
                    productId: performerId,
                    productType: constants_3.PAYMENT_TARGET_TYPE.PERFORMER,
                    performerId
                }],
            couponInfo: null,
            status: constants_3.PAYMENT_STATUS.SUCCESS,
            paymentResponseInfo: payload
        });
    }
    async createRenewalSubscription(transaction, totalPrice, paymentResponseInfo) {
        const { paymentGateway, sourceId, targetId, target, type, originalPrice, products, couponInfo } = transaction;
        return this.TransactionModel.create({
            paymentGateway,
            source: 'user',
            sourceId,
            target,
            targetId,
            performerId: targetId,
            type: type === constants_3.PAYMENT_TYPE.FREE_SUBSCRIPTION ? constants_3.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : type,
            originalPrice,
            totalPrice,
            products,
            couponInfo,
            status: constants_3.PAYMENT_STATUS.SUCCESS,
            paymentResponseInfo
        });
    }
    async stripeSubscriptionWebhook(payload) {
        var _a, _b, _c, _d, _e;
        const { data, type } = payload;
        if (type.includes('customer.subscription.created'))
            return { success: true };
        const subscriptionId = (_a = data === null || data === void 0 ? void 0 : data.object) === null || _a === void 0 ? void 0 : _a.id;
        const transactionId = (_c = (_b = data === null || data === void 0 ? void 0 : data.object) === null || _b === void 0 ? void 0 : _b.metadata) === null || _c === void 0 ? void 0 : _c.transactionId;
        if (!subscriptionId && !transactionId) {
            throw new common_1.HttpException('Missing subscriptionId or transactionId', 404);
        }
        const subscription = await this.subscriptionService.findBySubscriptionId(subscriptionId);
        if (!subscription)
            throw new common_1.HttpException('Subscription was not found', 404);
        subscription.status = ((_d = data === null || data === void 0 ? void 0 : data.object) === null || _d === void 0 ? void 0 : _d.status) !== 'active' ? constants_2.SUBSCRIPTION_STATUS.DEACTIVATED : constants_2.SUBSCRIPTION_STATUS.ACTIVE;
        subscription.updatedAt = new Date();
        await subscription.save();
        const existedTransaction = transactionId && await this.TransactionModel.findById(transactionId);
        if (existedTransaction) {
            existedTransaction.invoiceId = (_e = data === null || data === void 0 ? void 0 : data.object) === null || _e === void 0 ? void 0 : _e.latest_invoice;
            existedTransaction.updatedAt = new Date();
            await existedTransaction.save();
        }
        return { success: true };
    }
    async stripePaymentWebhook(payload) {
        var _a, _b, _c, _d, _e, _f, _g;
        const { type, data } = payload;
        if (type === 'payment_intent.created')
            return { ok: true };
        const transactionId = (_b = (_a = data === null || data === void 0 ? void 0 : data.object) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.transactionId;
        const invoiceId = ((_c = data === null || data === void 0 ? void 0 : data.object) === null || _c === void 0 ? void 0 : _c.invoice) || ((_d = data === null || data === void 0 ? void 0 : data.object) === null || _d === void 0 ? void 0 : _d.id);
        if (!invoiceId && !transactionId) {
            throw new common_1.HttpException('Missing invoiceId or transactionId', 404);
        }
        let transaction = transactionId && await this.TransactionModel.findOne({ _id: transactionId });
        if (!transaction) {
            transaction = invoiceId && await this.TransactionModel.findOne({ invoiceId });
        }
        if (!transaction)
            throw new common_1.HttpException('Transaction was not found', 404);
        let redirectUrl = '';
        switch (type) {
            case 'payment_intent.processing':
                transaction.status = constants_3.PAYMENT_STATUS.PROCESSING;
                break;
            case 'payment_intent.canceled':
                redirectUrl = `/payment/cancel?transactionId=${transaction._id.toString().slice(16, 24)}`;
                transaction.status = constants_3.PAYMENT_STATUS.CANCELED;
                break;
            case 'payment_intent.payment_failed':
                redirectUrl = `/payment/cancel?transactionId=${transaction._id.toString().slice(16, 24)}`;
                transaction.status = constants_3.PAYMENT_STATUS.FAIL;
                break;
            case 'payment_intent.requires_action':
                transaction.status = constants_3.PAYMENT_STATUS.REQUIRE_AUTHENTICATION;
                transaction.stripeClientSecret = (_e = data === null || data === void 0 ? void 0 : data.object) === null || _e === void 0 ? void 0 : _e.client_secret;
                transaction.stripeClientSecret && await this.socketUserService.emitToUsers(transaction.sourceId, 'stripe_confirm_payment', new dtos_1.PaymentDto(transaction));
                break;
            case 'payment_intent.succeeded':
                if ([constants_3.PAYMENT_TYPE.FREE_SUBSCRIPTION, constants_3.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION, constants_3.PAYMENT_TYPE.YEARLY_SUBSCRIPTION].includes(transaction.type) && transaction.status === constants_3.PAYMENT_STATUS.SUCCESS) {
                    const totalP = Number(((_f = data === null || data === void 0 ? void 0 : data.object) === null || _f === void 0 ? void 0 : _f.amount) || 0) / 100 || Number(((_g = data === null || data === void 0 ? void 0 : data.object) === null || _g === void 0 ? void 0 : _g.amount_received) || 0) / 100 || transaction.totalPrice;
                    const renewalTransaction = await this.createRenewalSubscription(transaction, totalP, payload);
                    await this.queueEventService.publish(new kernel_1.QueueEvent({
                        channel: constants_3.TRANSACTION_SUCCESS_CHANNEL,
                        eventName: constants_1.EVENT.CREATED,
                        data: new dtos_1.PaymentDto(renewalTransaction)
                    }));
                    return { success: true };
                }
                transaction.status = constants_3.PAYMENT_STATUS.SUCCESS;
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: constants_3.TRANSACTION_SUCCESS_CHANNEL,
                    eventName: constants_1.EVENT.CREATED,
                    data: new dtos_1.PaymentDto(transaction)
                }));
                redirectUrl = `/payment/success?transactionId=${transaction._id.toString().slice(16, 24)}`;
                break;
            default: break;
        }
        transaction.paymentResponseInfo = payload;
        transaction.updatedAt = new Date();
        await transaction.save();
        redirectUrl && await this.socketUserService.emitToUsers(transaction.sourceId, 'payment_status_callback', { redirectUrl });
        return { success: true };
    }
};
WebhooksPaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.UserService))),
    __param(3, (0, common_1.Inject)(providers_1.PAYMENT_TRANSACTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        services_1.PerformerService,
        services_2.UserService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService])
], WebhooksPaymentService);
exports.WebhooksPaymentService = WebhooksPaymentService;
//# sourceMappingURL=webhooks.service.js.map