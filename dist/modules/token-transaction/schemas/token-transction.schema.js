"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTransactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TokenTransactionSchema = new mongoose_1.Schema({
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
    sessionId: String,
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
            extraInfo: mongoose_1.Schema.Types.Mixed,
            tokens: Number
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
    status: {
        type: String,
        index: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=token-transction.schema.js.map