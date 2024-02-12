"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningSchema = void 0;
const mongoose = require("mongoose");
exports.EarningSchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    performerId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    sourceType: {
        type: String,
        index: true
    },
    type: {
        type: String,
        index: true
    },
    grossPrice: {
        type: Number,
        default: 0
    },
    netPrice: {
        type: Number,
        default: 0
    },
    siteCommission: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false,
        index: true
    },
    paymentGateway: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paidAt: {
        type: Date
    },
    isToken: {
        type: Boolean,
        default: true
    }
});
//# sourceMappingURL=earning.schema.js.map