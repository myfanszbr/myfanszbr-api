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
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const stripe_1 = require("stripe");
const providers_1 = require("../providers");
const constants_2 = require("../constants");
const customer_card_service_1 = require("./customer-card.service");
let StripeService = class StripeService {
    constructor(customerCardService, subscriptionPlanModel) {
        this.customerCardService = customerCardService;
        this.subscriptionPlanModel = subscriptionPlanModel;
    }
    getCredentials() {
        const secretKey = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.STRIPE_SECRET_KEY);
        const stripe = new stripe_1.default(secretKey, {
            apiVersion: '2022-11-15'
        });
        return stripe;
    }
    checkProduction() {
        const secretKey = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.STRIPE_SECRET_KEY);
        return secretKey.includes('live');
    }
    async retrieveCustomer(user) {
        const stripe = this.getCredentials();
        const isProduction = this.checkProduction();
        const query = {
            source: user.isPerformer ? 'performer' : 'user',
            sourceId: user._id,
            paymentGateway: 'stripe',
            isProduction
        };
        let customer = await this.customerCardService.findOneCustomer(query);
        if (customer)
            return customer;
        const data = await stripe.customers.create({
            email: user.email,
            name: (user.firstName && user.lastName && `${user.firstName} ${user.lastName}`) || user.name || user.username,
            description: `Create customer ${user.name || user.username}`
        });
        customer = await this.customerCardService.createCustomer(Object.assign(Object.assign({}, query), { createdAt: new Date(), updatedAt: new Date(), customerId: data.id, name: data.name, email: data.email }));
        return customer;
    }
    async authoriseCard(user, payload) {
        var _a;
        const { last4Digits, holderName, year, month, brand, token } = payload;
        try {
            const stripe = this.getCredentials();
            const customer = await this.retrieveCustomer(user);
            const query = {
                source: user.isPerformer ? 'performer' : 'user',
                sourceId: user._id,
                customerId: customer.customerId,
                paymentGateway: 'stripe',
                isProduction: this.checkProduction(),
                last4Digits,
                year,
                month,
                brand
            };
            let card = await this.customerCardService.findOneCard(query);
            if (card)
                throw new common_1.HttpException('Duplicated payment card!', 422);
            const data = await stripe.customers.createSource(customer.customerId, {
                source: token
            });
            card = await this.customerCardService.createCard(Object.assign(Object.assign({}, query), { createdAt: new Date(), updatedAt: new Date(), holderName: holderName || (user.firstName && user.lastName && `${user.firstName} ${user.lastName}`) || user.name, token: data.id }));
            return card;
        }
        catch (e) {
            throw new common_1.HttpException(((_a = e === null || e === void 0 ? void 0 : e.raw) === null || _a === void 0 ? void 0 : _a.message) || (e === null || e === void 0 ? void 0 : e.response) || e || 'Authorise card on Stripe error, please try again later', 400);
        }
    }
    async removeCard(user, cardId) {
        var _a;
        try {
            const stripe = this.getCredentials();
            const customer = await this.retrieveCustomer(user);
            const deleted = await stripe.customers.deleteSource(customer.customerId, cardId);
            return deleted;
        }
        catch (e) {
            throw new common_1.HttpException(((_a = e === null || e === void 0 ? void 0 : e.raw) === null || _a === void 0 ? void 0 : _a.message) || (e === null || e === void 0 ? void 0 : e.response) || 'Remove card on Stripe error, please try again later', 400);
        }
    }
    async getStripeProduct(performer, type) {
        var _a;
        try {
            const stripe = this.getCredentials();
            const name = type === constants_2.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION ? 'Monthly subscription' : type === constants_2.PAYMENT_TYPE.YEARLY_SUBSCRIPTION ? 'Yearly subscription' : `Free subscription in ${performer === null || performer === void 0 ? void 0 : performer.durationFreeSubscriptionDays} days`;
            const price = type === constants_2.PAYMENT_TYPE.MONTHLY_SUBSCRIPTION ? performer.monthlyPrice : type === constants_2.PAYMENT_TYPE.YEARLY_SUBSCRIPTION ? performer.yearlyPrice : 0;
            const plan = await this.subscriptionPlanModel.findOne({
                performerId: performer._id,
                subscriptionType: type,
                price
            });
            if (plan)
                return plan;
            const stripeProduct = await stripe.products.create({
                name: `${name} ${(performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username) || `${performer === null || performer === void 0 ? void 0 : performer.firstName} ${performer === null || performer === void 0 ? void 0 : performer.lastName}`}`,
                description: `${name} ${(performer === null || performer === void 0 ? void 0 : performer.name) || (performer === null || performer === void 0 ? void 0 : performer.username) || `${performer === null || performer === void 0 ? void 0 : performer.firstName} ${performer === null || performer === void 0 ? void 0 : performer.lastName}`}`
            });
            const newProduct = await this.subscriptionPlanModel.create({
                performerId: performer._id,
                subscriptionType: type,
                price,
                planId: stripeProduct.id,
                metaData: stripeProduct
            });
            return newProduct;
        }
        catch (e) {
            throw new common_1.HttpException(((_a = e === null || e === void 0 ? void 0 : e.raw) === null || _a === void 0 ? void 0 : _a.message) || (e === null || e === void 0 ? void 0 : e.response) || 'Create a subscription plan on Stripe error, please try again later', 400);
        }
    }
    async createSubscriptionPlan(transaction, performer, user, cardId) {
        var _a;
        try {
            const stripe = this.getCredentials();
            const product = await this.getStripeProduct(performer, transaction.type);
            const customer = await this.retrieveCustomer(user);
            const price = transaction.type === constants_2.PAYMENT_TYPE.FREE_SUBSCRIPTION ? performer.monthlyPrice : transaction.totalPrice;
            const plan = await stripe.subscriptions.create({
                customer: customer.customerId,
                default_payment_method: cardId,
                items: [
                    {
                        price_data: {
                            currency: 'usd',
                            unit_amount: 100 * price,
                            product: product.planId,
                            recurring: {
                                interval: 'day',
                                interval_count: transaction.type === constants_2.PAYMENT_TYPE.YEARLY_SUBSCRIPTION ? 365 : 30
                            }
                        }
                    }
                ],
                metadata: {
                    transactionId: transaction._id.toString()
                },
                trial_period_days: transaction.type === constants_2.PAYMENT_TYPE.FREE_SUBSCRIPTION ? performer.durationFreeSubscriptionDays : 0
            });
            return plan;
        }
        catch (e) {
            throw new common_1.HttpException(((_a = e === null || e === void 0 ? void 0 : e.raw) === null || _a === void 0 ? void 0 : _a.message) || (e === null || e === void 0 ? void 0 : e.response) || 'Create a subscription plan on Stripe error, please try again later', 400);
        }
    }
    async deleteSubscriptionPlan(subscription) {
        var _a;
        try {
            const stripe = this.getCredentials();
            const plan = await stripe.subscriptions.retrieve(subscription.subscriptionId);
            plan && await stripe.subscriptions.del(plan.id);
            return true;
        }
        catch (e) {
            throw new common_1.HttpException(((_a = e === null || e === void 0 ? void 0 : e.raw) === null || _a === void 0 ? void 0 : _a.message) || (e === null || e === void 0 ? void 0 : e.response) || 'Delete a subscription plan on Stripe error, please try again later', 400);
        }
    }
    async createSingleCharge(payload) {
        var _a;
        try {
            const { transaction, item, user, cardId } = payload;
            const stripe = this.getCredentials();
            const customer = await this.retrieveCustomer(user);
            const charge = await stripe.paymentIntents.create({
                amount: transaction.totalPrice * 100,
                currency: 'usd',
                customer: customer.customerId,
                payment_method: cardId,
                description: `${(user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username)} purchase ${transaction.type} ${item.name}`,
                metadata: {
                    transactionId: transaction._id.toString()
                },
                receipt_email: user.email,
                setup_future_usage: 'off_session'
            });
            return charge;
        }
        catch (e) {
            throw new common_1.HttpException(((_a = e === null || e === void 0 ? void 0 : e.raw) === null || _a === void 0 ? void 0 : _a.message) || (e === null || e === void 0 ? void 0 : e.response) || 'Charge error, please try again later', 400);
        }
    }
};
StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => customer_card_service_1.CustomerCardService))),
    __param(1, (0, common_1.Inject)(providers_1.SUBSCRIPTION_PLAN_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [customer_card_service_1.CustomerCardService,
        mongoose_1.Model])
], StripeService);
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map