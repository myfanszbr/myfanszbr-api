"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledStreamNotificationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ScheduledStreamNotificationSchema = new mongoose_1.Schema({
    feedId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    scheduledAt: {
        type: Date,
        index: -1
    },
    notified: {
        type: Boolean,
        default: false,
        index: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    collection: 'scheduled-streaming-notifications'
});
//# sourceMappingURL=scheduled-stream-notification.schema.js.map