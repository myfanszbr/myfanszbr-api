"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamSchema = void 0;
const mongoose_1 = require("mongoose");
exports.StreamSchema = new mongoose_1.Schema({
    performerId: { type: mongoose_1.Types.ObjectId, index: true },
    type: { type: String, index: true },
    sessionId: { type: String, index: true },
    isStreaming: { type: Number, default: 0 },
    lastStreamingTime: Date,
    streamingTime: {
        type: Number,
        default: 0
    },
    stats: {
        members: { type: Number, default: 0 },
        likes: { type: Number, default: 0 }
    },
    isFree: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    title: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=stream.schema.js.map