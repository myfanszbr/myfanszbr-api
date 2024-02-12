"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutRequestSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../constants");
exports.payoutRequestSchema = new mongoose_1.Schema({
    source: {
        index: true,
        type: String,
        enum: [constants_1.SOURCE_TYPE.PERFORMER, constants_1.SOURCE_TYPE.AGENT],
        default: constants_1.SOURCE_TYPE.PERFORMER
    },
    sourceId: {
        index: true,
        type: mongoose_2.Types.ObjectId
    },
    paymentAccountType: {
        type: String,
        index: true,
        default: 'stripe'
    },
    requestNote: {
        type: String
    },
    adminNote: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'done'],
        default: 'pending',
        index: true
    },
    requestTokens: {
        type: Number,
        default: 0
    },
    tokenConversionRate: {
        type: Number,
        default: 1
    },
    payoutId: {
        type: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=payout-request.schema.js.map