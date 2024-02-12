"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCardSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PaymentCardSchema = new mongoose_1.Schema({
    source: {
        type: String
    },
    sourceId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    paymentGateway: {
        type: String,
        default: 'stripe'
    },
    isProduction: {
        type: Boolean,
        default: false
    },
    customerId: {
        type: String
    },
    holderName: String,
    last4Digits: String,
    brand: String,
    month: String,
    year: String,
    token: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    collection: 'paymentcards'
});
//# sourceMappingURL=payment-card.schema.js.map