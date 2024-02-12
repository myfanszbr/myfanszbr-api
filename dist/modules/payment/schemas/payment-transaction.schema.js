"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTransactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PaymentTransactionSchema = new mongoose_1.Schema({
    paymentGateway: {
        type: String
    },
    source: {
        type: String,
        index: true
    },
    sourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    target: {
        type: String,
        index: true
    },
    targetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    type: {
        type: String,
        index: true
    },
    products: [
        {
            _id: false,
            name: String,
            description: String,
            price: Number,
            productType: String,
            productId: mongoose_1.Schema.Types.ObjectId,
            quantity: Number,
            tokens: Number,
            extraInfo: mongoose_1.Schema.Types.Mixed
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
    originalPrice: {
        type: Number,
        default: 0
    },
    paymentResponseInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    invoiceId: String,
    stripeClientSecret: String,
    status: {
        type: String,
        index: true
    },
    couponInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=payment-transaction.schema.js.map