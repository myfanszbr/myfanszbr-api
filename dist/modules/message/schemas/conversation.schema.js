"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const schema = new mongoose_2.Schema({
    type: {
        type: String,
        index: true
    },
    name: String,
    lastMessage: String,
    lastSenderId: mongoose_2.Schema.Types.ObjectId,
    lastMessageCreatedAt: Date,
    recipients: [{
            _id: false,
            source: String,
            sourceId: mongoose_2.Schema.Types.ObjectId
        }],
    meta: mongoose_2.Schema.Types.Mixed,
    streamId: mongoose_1.Types.ObjectId,
    performerId: mongoose_1.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
schema.index({ recipients: 1 });
exports.ConversationSchema = schema;
//# sourceMappingURL=conversation.schema.js.map