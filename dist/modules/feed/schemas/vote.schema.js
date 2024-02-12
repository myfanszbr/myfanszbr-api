"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteSchema = void 0;
const mongoose_1 = require("mongoose");
exports.VoteSchema = new mongoose_1.Schema({
    fromSourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    fromSource: {
        type: String,
        index: true
    },
    targetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    targetSource: {
        type: String,
        index: true
    },
    refId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=vote.schema.js.map