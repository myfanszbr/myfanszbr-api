"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanSchema = void 0;
const mongoose_1 = require("mongoose");
exports.SubscriptionPlanSchema = new mongoose_1.Schema({
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    paymentGateway: {
        type: String,
        default: 'stripe'
    },
    subscriptionType: {
        type: String,
        enum: ['free_subscription', 'monthly_subscription', 'yearly_subscription']
    },
    price: {
        type: Number,
        default: 0
    },
    planId: {
        type: String
    },
    metaData: {
        type: mongoose_1.Schema.Types.Mixed
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=subscription-plan.schema.js.map