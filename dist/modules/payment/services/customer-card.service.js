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
exports.CustomerCardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const kernel_1 = require("../../../kernel");
const providers_1 = require("../providers");
const stripe_service_1 = require("./stripe.service");
let CustomerCardService = class CustomerCardService {
    constructor(stripeService, paymentCustomerModel, paymentCardModel) {
        this.stripeService = stripeService;
        this.paymentCustomerModel = paymentCustomerModel;
        this.paymentCardModel = paymentCardModel;
    }
    findOneCustomer(query) {
        return this.paymentCustomerModel.findOne(query);
    }
    retrieveCustomer(query) {
        return this.paymentCustomerModel.findOne(query);
    }
    createCustomer(payload) {
        return this.paymentCustomerModel.create(payload);
    }
    findOneCard(query) {
        return this.paymentCardModel.findOne(query);
    }
    async updateOneCard(query, payload) {
        await this.paymentCardModel.updateOne(query, payload);
    }
    retrieveCard(query) {
        return this.paymentCardModel.findOne(query);
    }
    createCard(payload) {
        return this.paymentCardModel.create(payload);
    }
    async deleteCard(id, user) {
        const card = await this.paymentCardModel.findById(id);
        if (card.paymentGateway === 'stripe') {
            await this.stripeService.removeCard(user, card.token);
        }
        if (!card)
            throw new kernel_1.EntityNotFoundException();
        await this.paymentCardModel.deleteOne({ _id: card._id });
        return { deleted: true };
    }
    async findCards(req, user) {
        const query = {
            sourceId: user._id
        };
        if (req.paymentGateway) {
            query.paymentGateway = req.paymentGateway;
        }
        if (req.paymentGateway === 'stripe') {
            const stripeSecretKey = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.STRIPE_SECRET_KEY);
            query.isProduction = stripeSecretKey.includes('live');
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort || -1
        };
        const [data, total] = await Promise.all([
            this.paymentCardModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(req.limit)
                .skip(req.offset),
            this.paymentCardModel.countDocuments(query)
        ]);
        return {
            data, total
        };
    }
};
CustomerCardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => stripe_service_1.StripeService))),
    __param(1, (0, common_1.Inject)(providers_1.PAYMENT_CUSTOMER_MODEL_PROVIDER)),
    __param(2, (0, common_1.Inject)(providers_1.PAYMENT_CARD_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        mongoose_1.Model,
        mongoose_1.Model])
], CustomerCardService);
exports.CustomerCardService = CustomerCardService;
//# sourceMappingURL=customer-card.service.js.map