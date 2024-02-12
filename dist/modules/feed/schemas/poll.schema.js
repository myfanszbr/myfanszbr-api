"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PollSchema = new mongoose_1.Schema({
    fromRef: {
        type: String
    },
    refId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    description: {
        type: String
    },
    totalVote: { type: Number, default: 0 },
    expiredAt: {
        type: Date, default: Date.now
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=poll.schema.js.map