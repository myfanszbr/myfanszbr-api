"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = void 0;
const mongoose_1 = require("mongoose");
exports.OrderSchema = new mongoose_1.Schema({
    transactionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    orderNumber: {
        type: String
    },
    shippingCode: {
        type: String
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    productInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    unitPrice: {
        type: Number,
        default: 1
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: Number,
        default: 1
    },
    deliveryAddressId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    deliveryAddress: {
        type: String
    },
    deliveryStatus: {
        type: String,
        index: true
    },
    userNote: {
        type: String
    },
    phoneNumber: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=order.schema.js.map