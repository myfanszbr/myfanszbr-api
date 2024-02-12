"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../kernel/constants");
exports.FeedSchema = new mongoose_1.Schema({
    type: {
        type: String,
        index: true
    },
    fromSourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    fromSource: {
        type: String,
        index: true
    },
    title: String,
    slug: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true
    },
    text: String,
    pollDescription: String,
    fileIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            _id: false
        }],
    pollIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            _id: false
        }],
    pollExpiredAt: {
        type: Date,
        default: Date.now
    },
    streamingScheduled: {
        type: Date
    },
    teaserId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    thumbnailId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    status: {
        type: String,
        index: true,
        default: constants_1.STATUS.ACTIVE
    },
    isPinned: { type: Boolean, default: false },
    pinnedAt: { type: Date },
    totalLike: { type: Number, default: 0 },
    totalComment: { type: Number, default: 0 },
    isSale: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    isSchedule: { type: Boolean, default: false },
    scheduleAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=feed.schema.js.map