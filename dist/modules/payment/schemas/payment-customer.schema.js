"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCustomerSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PaymentCustomerSchema = new mongoose_1.Schema({
    source: {
        type: String,
        index: true
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
    customerId: String,
    name: String,
    email: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    collection: 'paymentcustomers'
});
//# sourceMappingURL=payment-customer.schema.js.map