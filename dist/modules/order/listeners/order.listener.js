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
exports.OrderListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../token-transaction/constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../performer-assets/services");
const constants_3 = require("../../performer-assets/constants");
const providers_1 = require("../providers");
const constants_4 = require("../constants");
const ORDER_TOPIC = 'ORDER_TOPIC';
let OrderListener = class OrderListener {
    constructor(productService, orderModel, shippingAddressModel, queueEventService) {
        this.productService = productService;
        this.orderModel = orderModel;
        this.shippingAddressModel = shippingAddressModel;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe(constants_1.TOKEN_TRANSACTION_SUCCESS_CHANNEL, ORDER_TOPIC, this.handleListen.bind(this));
    }
    async handleListen(event) {
        if (event.eventName !== constants_2.EVENT.CREATED) {
            return;
        }
        const transaction = event.data;
        if (!transaction || transaction.status !== constants_1.PURCHASE_ITEM_STATUS.SUCCESS || ((transaction === null || transaction === void 0 ? void 0 : transaction.type) !== constants_1.PURCHASE_ITEM_TYPE.PRODUCT)) {
            return;
        }
        const { shippingInfo } = transaction;
        const proIds = transaction.products.map((p) => p.productId);
        const products = await this.productService.findByIds(proIds);
        const ids = products.map((p) => `${p === null || p === void 0 ? void 0 : p._id}`);
        if (!ids || !ids.length) {
            return;
        }
        let quantity = 0;
        let totalPrice = 0;
        const newProds = transaction.products.filter((p) => ids.includes(p.productId));
        newProds.forEach((p) => {
            quantity += p.quantity;
            totalPrice += parseFloat(p.price);
        });
        const address = (shippingInfo === null || shippingInfo === void 0 ? void 0 : shippingInfo.deliveryAddressId) && await this.shippingAddressModel.findById(shippingInfo === null || shippingInfo === void 0 ? void 0 : shippingInfo.deliveryAddressId);
        const deliveryAddress = address ? `${((address === null || address === void 0 ? void 0 : address.name) || '').toUpperCase()} - ${address === null || address === void 0 ? void 0 : address.streetNumber} ${(address === null || address === void 0 ? void 0 : address.streetAddress) || ''}, ${(address === null || address === void 0 ? void 0 : address.ward) || ''}, ${(address === null || address === void 0 ? void 0 : address.district) || ''}, ${(address === null || address === void 0 ? void 0 : address.city) || ''}, ${(address === null || address === void 0 ? void 0 : address.state) || ''} ${(address === null || address === void 0 ? void 0 : address.zipCode) || ''}, ${(address === null || address === void 0 ? void 0 : address.country) || ''}` : '';
        await this.orderModel.create({
            transactionId: transaction._id,
            performerId: transaction.performerId,
            userId: transaction.sourceId,
            orderNumber: transaction._id.toString().slice(16, 24).toUpperCase(),
            shippingCode: '',
            productId: newProds[0].productId,
            unitPrice: products[0].price,
            quantity,
            totalPrice,
            deliveryAddressId: (shippingInfo === null || shippingInfo === void 0 ? void 0 : shippingInfo.deliveryAddressId) || null,
            deliveryAddress,
            deliveryStatus: newProds[0].productType === constants_3.PRODUCT_TYPE.DIGITAL ? constants_4.ORDER_STATUS.DELIVERED : constants_4.ORDER_STATUS.PROCESSING,
            phoneNumber: shippingInfo === null || shippingInfo === void 0 ? void 0 : shippingInfo.phoneNumber,
            userNote: shippingInfo === null || shippingInfo === void 0 ? void 0 : shippingInfo.userNote,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
};
OrderListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.ProductService))),
    __param(1, (0, common_1.Inject)(providers_1.ORDER_MODEL_PROVIDER)),
    __param(2, (0, common_1.Inject)(providers_1.SHIPPING_ADDRESS_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.ProductService,
        mongoose_1.Model,
        mongoose_1.Model,
        kernel_1.QueueEventService])
], OrderListener);
exports.OrderListener = OrderListener;
//# sourceMappingURL=order.listener.js.map