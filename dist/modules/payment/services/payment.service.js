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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const mongoose_1 = require("mongoose");
const services_1 = require("../../coupon/services");
const settings_1 = require("../../settings");
const constants_2 = require("../../settings/constants");
const services_2 = require("../../performer/services");
const constants_3 = require("../../subscription/constants");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const axios_1 = require("axios");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_3 = require("../../user/services");
const mailer_1 = require("../../mailer");
const providers_1 = require("../providers");
const constants_4 = require("../constants");
const exceptions_1 = require("../exceptions");
const ccbill_service_1 = require("./ccbill.service");
const stripe_service_1 = require("./stripe.service");
const dtos_1 = require("../dtos");
const pay2m_service_1 = require("./pay2m.service");
const ccbillCancelUrl = "https://datalink.ccbill.com/utils/subscriptionManagement.cgi";
let PaymentService = class PaymentService {
    constructor(subscriptionService, performerService, userService, couponService, TransactionModel, ccbillService, pay2mService, stripeService, queueEventService, settingService, socketUserService, mailerService) {
        this.subscriptionService = subscriptionService;
        this.performerService = performerService;
        this.userService = userService;
        this.couponService = couponService;
        this.TransactionModel = TransactionModel;
        this.ccbillService = ccbillService;
        this.pay2mService = pay2mService;
        this.stripeService = stripeService;
        this.queueEventService = queueEventService;
        this.settingService = settingService;
        this.socketUserService = socketUserService;
        this.mailerService = mailerService;
    }
    async findById(id) {
        const data = await this.TransactionModel.findById(id);
        return data;
    }
    async getCCbillPaymentGatewaySettings() {
        const flexformId = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.CCBILL_FLEXFORM_ID);
        const singleSubAccountNumber = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.CCBILL_SINGLE_SUB_ACCOUNT_NUMBER);
        const recurringSubAccountNumber = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.CCBILL_RECURRING_SUB_ACCOUNT_NUMBER);
        const salt = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.CCBILL_SALT);
        if (!flexformId ||
            !singleSubAccountNumber ||
            !recurringSubAccountNumber ||
            !salt) {
            throw new exceptions_1.MissingConfigPaymentException();
        }
        return {
            flexformId,
            singleSubAccountNumber,
            recurringSubAccountNumber,
            salt,
        };
    }
    async createSubscriptionPaymentTransaction(performer, subscriptionType, user, paymentGateway = "stripe", couponInfo = null) {
        const price = () => {
            switch (subscriptionType) {
                case constants_4.PAYMENT_TYPE.FREE_SUBSCRIPTION:
                    return 0;
                case constants_4.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION:
                    return performer.monthlyPrice;
                case constants_4.PAYMENT_TYPE.YEARLY_SUBSCRIPTION:
                    return performer.yearlyPrice;
                default:
                    return performer.monthlyPrice;
            }
        };
        const totalPrice = couponInfo
            ? price() - parseFloat((price() * couponInfo.value).toFixed(2))
            : price();
        return this.TransactionModel.create({
            paymentGateway,
            source: "user",
            sourceId: user._id,
            target: constants_4.PAYMENT_TARGET_TYPE.PERFORMER,
            targetId: performer._id,
            performerId: performer._id,
            type: subscriptionType,
            originalPrice: price(),
            totalPrice,
            products: [
                {
                    price: totalPrice,
                    quantity: 1,
                    name: `${subscriptionType} ${(performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username)}`,
                    description: `${subscriptionType} ${(performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username)} ${subscriptionType === constants_4.PAYMENT_TYPE.FREE_SUBSCRIPTION
                        ? `in ${performer === null || performer === void 0 ? void 0 : performer.durationFreeSubscriptionDays} days`
                        : ""}`,
                    productId: performer._id,
                    id: performer._id,
                    productType: constants_4.PAYMENT_TARGET_TYPE.PERFORMER,
                    performerId: performer._id,
                },
            ],
            couponInfo,
            status: constants_4.PAYMENT_STATUS.CREATED,
            paymentResponseInfo: null,
        });
    }
    async subscribePerformer(payload, user) {
        const { type, performerId, cardId } = payload;
        const paymentGateway = "pay2m";
        const performer = await this.performerService.findById(performerId);
        if (!performer)
            throw new kernel_1.EntityNotFoundException();
        if (type === constants_3.SUBSCRIPTION_TYPE.FREE) {
            const subscription = await this.subscriptionService.findOneSubscription({
                userId: user._id,
                performerId,
            });
            if (subscription && subscription.usedFreeSubscription) {
                throw new common_1.HttpException("You've subscribed for free already!", 422);
            }
        }
        const subscriptionType = type === constants_3.SUBSCRIPTION_TYPE.FREE
            ? constants_4.PAYMENT_TYPE.FREE_SUBSCRIPTION
            : type === constants_3.SUBSCRIPTION_TYPE.MONTHLY
                ? constants_4.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION
                : constants_4.PAYMENT_TYPE.YEARLY_SUBSCRIPTION;
        const transaction = await this.createSubscriptionPaymentTransaction(performer, subscriptionType, user, paymentGateway);
        if (paymentGateway === "pay2m") {
            const payment = await this.pay2mService.createPayment({
                amount: transaction.totalPrice,
                customerId: user.pay2m.customerId,
                recipientId: performer.pay2m.recipientId,
                product: transaction.products[0],
            });
            if (payment) {
                transaction.status =
                    transaction.type === constants_4.PAYMENT_TYPE.FREE_SUBSCRIPTION
                        ? constants_4.PAYMENT_STATUS.SUCCESS
                        : constants_4.PAYMENT_STATUS.CREATED;
                transaction.paymentResponseInfo = payment;
                transaction.invoiceId = payment.id;
                await this.subscriptionService.updateSubscriptionId(new dtos_1.PaymentDto(transaction), payment.id);
            }
            await transaction.save();
            return new dtos_1.PaymentDto(transaction).toResponse();
        }
        if (paymentGateway === "ccbill") {
            if (transaction.type === constants_4.PAYMENT_TYPE.FREE_SUBSCRIPTION) {
                transaction.status = constants_4.PAYMENT_STATUS.SUCCESS;
                await transaction.save();
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: constants_4.TRANSACTION_SUCCESS_CHANNEL,
                    eventName: constants_1.EVENT.CREATED,
                    data: new dtos_1.PaymentDto(transaction),
                }));
                await this.socketUserService.emitToUsers(transaction.sourceId, "payment_status_callback", {
                    redirectUrl: `/payment/success?transactionId=${transaction._id
                        .toString()
                        .slice(16, 24)}`,
                });
                return new dtos_1.PaymentDto(transaction).toResponse();
            }
            const { flexformId, recurringSubAccountNumber, salt } = await this.getCCbillPaymentGatewaySettings();
            return this.ccbillService.subscription({
                transactionId: transaction._id,
                price: transaction.totalPrice,
                flexformId,
                salt,
                recurringSubAccountNumber,
                subscriptionType,
            });
        }
        if (paymentGateway === "stripe") {
            if (!cardId) {
                throw new common_1.HttpException("Please add a payment card", 422);
            }
            const plan = await this.stripeService.createSubscriptionPlan(transaction, performer, user, cardId);
            if (plan) {
                transaction.status =
                    transaction.type === constants_4.PAYMENT_TYPE.FREE_SUBSCRIPTION
                        ? constants_4.PAYMENT_STATUS.SUCCESS
                        : constants_4.PAYMENT_STATUS.CREATED;
                transaction.paymentResponseInfo = plan;
                transaction.invoiceId = plan.latest_invoice;
                await this.subscriptionService.updateSubscriptionId(new dtos_1.PaymentDto(transaction), plan.id);
            }
            if (transaction.type === constants_4.PAYMENT_TYPE.FREE_SUBSCRIPTION) {
                transaction.status = constants_4.PAYMENT_STATUS.SUCCESS;
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: constants_4.TRANSACTION_SUCCESS_CHANNEL,
                    eventName: constants_1.EVENT.CREATED,
                    data: new dtos_1.PaymentDto(transaction),
                }));
                await this.socketUserService.emitToUsers(transaction.sourceId, "payment_status_callback", {
                    redirectUrl: `/payment/success?transactionId=${transaction._id
                        .toString()
                        .slice(16, 24)}`,
                });
            }
            await transaction.save();
            return new dtos_1.PaymentDto(transaction).toResponse();
        }
        return new dtos_1.PaymentDto(transaction).toResponse();
    }
    async createTokenPaymentTransaction(products, paymentGateway, totalPrice, user, couponInfo) {
        const paymentTransaction = new this.TransactionModel();
        paymentTransaction.originalPrice = totalPrice;
        paymentTransaction.paymentGateway = paymentGateway || "stripe";
        paymentTransaction.source = "user";
        paymentTransaction.sourceId = user._id;
        paymentTransaction.target = constants_4.PAYMENT_TARGET_TYPE.TOKEN_PACKAGE;
        paymentTransaction.targetId = products[0].productId;
        paymentTransaction.performerId = null;
        paymentTransaction.type = constants_4.PAYMENT_TYPE.TOKEN_PACKAGE;
        paymentTransaction.totalPrice = couponInfo
            ? totalPrice - parseFloat((totalPrice * couponInfo.value).toFixed(2))
            : totalPrice;
        paymentTransaction.products = products;
        paymentTransaction.paymentResponseInfo = null;
        paymentTransaction.status = constants_4.PAYMENT_STATUS.CREATED;
        paymentTransaction.couponInfo = couponInfo;
        await paymentTransaction.save();
        return paymentTransaction;
    }
    async buyTokens(payload, user) {
        const { couponCode, amount, cardId } = payload;
        const paymentGateway = "pay2m";
        const totalPrice = amount;
        const minWalletPrice = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.MINIMUM_WALLET_PRICE) || 10;
        const maxWalletPrice = settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.MAXIMUM_WALLET_PRICE) || 1000;
        if (totalPrice < minWalletPrice) {
            throw new common_1.HttpException(`Minimum top up amount is $${minWalletPrice}`, 422);
        }
        if (totalPrice > maxWalletPrice) {
            throw new common_1.HttpException(`Maximum top up amount is $${maxWalletPrice}`, 422);
        }
        const products = [
            {
                price: totalPrice,
                quantity: 1,
                name: "Wallet",
                description: `Top up Wallet $${amount}`,
                productId: null,
                productType: constants_4.PAYMENT_TARGET_TYPE.TOKEN_PACKAGE,
                performerId: null,
                tokens: amount,
            },
        ];
        let coupon = null;
        if (couponCode) {
            coupon = await this.couponService.applyCoupon(couponCode, user._id);
        }
        const transaction = await this.createTokenPaymentTransaction(products, paymentGateway, totalPrice, user, coupon);
        if (paymentGateway === "pay2m") {
            const paymentData = await this.pay2mService.createPayment({
                customerId: user.pay2m.customerId,
                amount: totalPrice,
                product: products[0],
            });
            transaction.invoiceId = paymentData.id;
            transaction.paymentResponseInfo = paymentData;
            await transaction.save();
            return new dtos_1.PaymentDto(transaction).toResponse();
        }
        if (paymentGateway === "ccbill") {
            const { flexformId, singleSubAccountNumber, salt } = await this.getCCbillPaymentGatewaySettings();
            return this.ccbillService.singlePurchase({
                salt,
                flexformId,
                singleSubAccountNumber,
                price: coupon ? totalPrice - totalPrice * coupon.value : totalPrice,
                transactionId: transaction._id,
            });
        }
        if (paymentGateway === "stripe") {
            if (!cardId) {
                throw new common_1.HttpException("Please add a payment card", 422);
            }
            const data = await this.stripeService.createSingleCharge({
                transaction,
                item: {
                    name: `Wallet - Top up $${amount}`,
                },
                user,
                cardId,
            });
            transaction.invoiceId =
                data.id || (data.invoice && data.invoice.toString());
            transaction.stripeClientSecret = data.client_secret;
            await transaction.save();
            return new dtos_1.PaymentDto(transaction).toResponse();
        }
        throw new exceptions_1.MissingConfigPaymentException();
    }
    async ccbillCancelSubscription(id, user) {
        const subscription = await this.subscriptionService.findById(id);
        if (!subscription) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!user.roles.includes("admin") &&
            `${subscription.userId}` !== `${user._id}`) {
            throw new common_1.ForbiddenException();
        }
        if (!subscription.subscriptionId) {
            subscription.status = constants_3.SUBSCRIPTION_STATUS.DEACTIVATED;
            await subscription.save();
            await Promise.all([
                this.performerService.updateSubscriptionStat(subscription.performerId, -1),
                this.userService.updateStats(subscription.userId, {
                    "stats.totalSubscriptions": -1,
                }),
            ]);
            await this.cancelSubscriptionMailer(subscription);
            return { success: true };
        }
        const { subscriptionId } = subscription;
        const [ccbillClientAccNo, ccbillDatalinkUsername, ccbillDatalinkPassword] = await Promise.all([
            this.settingService.getKeyValue(constants_2.SETTING_KEYS.CCBILL_CLIENT_ACCOUNT_NUMBER),
            this.settingService.getKeyValue(constants_2.SETTING_KEYS.CCBILL_DATALINK_USERNAME),
            this.settingService.getKeyValue(constants_2.SETTING_KEYS.CCBILL_DATALINK_PASSWORD),
        ]);
        if (!ccbillClientAccNo ||
            !ccbillDatalinkUsername ||
            !ccbillDatalinkPassword) {
            throw new exceptions_1.MissingConfigPaymentException();
        }
        const resp = await axios_1.default.get(`${ccbillCancelUrl}?subscriptionId=${subscriptionId}&username=${ccbillDatalinkUsername}&password=${ccbillDatalinkPassword}&action=cancelSubscription&clientAccnum=${ccbillClientAccNo}`);
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"1"\n'))) {
            subscription.status = constants_3.SUBSCRIPTION_STATUS.DEACTIVATED;
            subscription.updatedAt = new Date();
            await subscription.save();
            await Promise.all([
                this.performerService.updateSubscriptionStat(subscription.performerId, -1),
                this.userService.updateStats(subscription.userId, {
                    "stats.totalSubscriptions": -1,
                }),
            ]);
            return { success: true };
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"0"\n'))) {
            throw new common_1.HttpException("The requested action failed.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-1"\n'))) {
            throw new common_1.HttpException("The arguments provided to authenticate the merchant were invalid or missing.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-2"\n'))) {
            throw new common_1.HttpException("The subscription id provided was invalid or the subscription type is not supported by the requested action.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-3"\n'))) {
            throw new common_1.HttpException("No record was found for the given subscription.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-4"\n'))) {
            throw new common_1.HttpException("The given subscription was not for the account the merchant was authenticated on.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-5"\n'))) {
            throw new common_1.HttpException("The arguments provided for the requested action were invalid or missing.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-6"\n'))) {
            throw new common_1.HttpException("The requested action was invalid", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-7"\n'))) {
            throw new common_1.HttpException("There was an internal error or a database error and the requested action could not complete.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-8"\n'))) {
            throw new common_1.HttpException("The IP Address the merchant was attempting to authenticate on was not in the valid range.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-9"\n'))) {
            throw new common_1.HttpException("The merchant’s account has been deactivated for use on the Datalink system or the merchant is not permitted to perform the requested action", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-10"\n'))) {
            throw new common_1.HttpException("The merchant has not been set up to use the Datalink system.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-11"\n'))) {
            throw new common_1.HttpException("Subscription is not eligible for a discount, recurring price less than $5.00.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-12"\n'))) {
            throw new common_1.HttpException("The merchant has unsuccessfully logged into the system 3 or more times in the last hour. The merchant should wait an hour before attempting to login again and is advised to review the login information.", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-15"\n'))) {
            throw new common_1.HttpException("Merchant over refund threshold", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-16"\n'))) {
            throw new common_1.HttpException("Merchant over void threshold", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-23"\n'))) {
            throw new common_1.HttpException("Transaction limit reached", 400);
        }
        if ((resp === null || resp === void 0 ? void 0 : resp.data) && (resp === null || resp === void 0 ? void 0 : resp.data.includes('"results"\n"-24"\n'))) {
            throw new common_1.HttpException("Purchase limit reached", 400);
        }
        await this.cancelSubscriptionMailer(subscription);
        throw new common_1.HttpException("Cancel subscription has been fail, please try again later", 400);
    }
    async stripeCancelSubscription(id, user) {
        const subscription = await this.subscriptionService.findById(id);
        if (!subscription) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!user.roles.includes("admin") &&
            `${subscription.userId}` !== `${user._id}`) {
            throw new common_1.ForbiddenException();
        }
        if (!subscription.subscriptionId) {
            subscription.status = constants_3.SUBSCRIPTION_STATUS.DEACTIVATED;
            await subscription.save();
            await Promise.all([
                this.performerService.updateSubscriptionStat(subscription.performerId, -1),
                this.userService.updateStats(subscription.userId, {
                    "stats.totalSubscriptions": -1,
                }),
            ]);
            await this.cancelSubscriptionMailer(subscription);
            return { success: true };
        }
        await this.stripeService.deleteSubscriptionPlan(subscription);
        subscription.status = constants_3.SUBSCRIPTION_STATUS.DEACTIVATED;
        subscription.updatedAt = new Date();
        await subscription.save();
        await Promise.all([
            this.performerService.updateSubscriptionStat(subscription.performerId, -1),
            this.userService.updateStats(subscription.userId, {
                "stats.totalSubscriptions": -1,
            }),
        ]);
        await this.cancelSubscriptionMailer(subscription);
        return { success: true };
    }
    async systemCancelSubscription(id, user) {
        const subscription = await this.subscriptionService.findById(id);
        if (!subscription) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!user.roles.includes("admin") &&
            `${subscription.userId}` !== `${user._id}`) {
            throw new common_1.ForbiddenException();
        }
        subscription.status = constants_3.SUBSCRIPTION_STATUS.DEACTIVATED;
        subscription.updatedAt = new Date();
        await subscription.save();
        await Promise.all([
            this.performerService.updateSubscriptionStat(subscription.performerId, -1),
            this.userService.updateStats(subscription.userId, {
                "stats.totalSubscriptions": -1,
            }),
        ]);
        return { success: true };
    }
    async cancelSubscriptionMailer(subscription) {
        if (subscription.status !== constants_3.SUBSCRIPTION_STATUS.DEACTIVATED)
            return;
        const [user, performer, adminEmail] = await Promise.all([
            this.userService.findById(subscription.userId),
            this.performerService.findById(subscription.performerId),
            settings_1.SettingService.getValueByKey(constants_2.SETTING_KEYS.ADMIN_EMAIL),
        ]);
        adminEmail &&
            (await this.mailerService.send({
                subject: "Subscription Canceled",
                to: adminEmail,
                data: {
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                    subscriptionId: subscription.subscriptionId || subscription._id,
                },
                template: "admin-cancel-subscription",
            }));
        (performer === null || performer === void 0 ? void 0 : performer.email) &&
            (await this.mailerService.send({
                subject: "Subscription Canceled",
                to: performer === null || performer === void 0 ? void 0 : performer.email,
                data: {
                    userName: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username),
                    subscriptionId: subscription.subscriptionId || subscription._id,
                },
                template: "performer-cancel-subscription",
            }));
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => subscription_service_1.SubscriptionService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_2.PerformerService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_3.UserService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.CouponService))),
    __param(4, (0, common_1.Inject)(providers_1.PAYMENT_TRANSACTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        services_2.PerformerService,
        services_3.UserService,
        services_1.CouponService,
        mongoose_1.Model,
        ccbill_service_1.CCBillService,
        pay2m_service_1.Pay2mService,
        stripe_service_1.StripeService,
        kernel_1.QueueEventService,
        settings_1.SettingService,
        socket_user_service_1.SocketUserService,
        mailer_1.MailerService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map