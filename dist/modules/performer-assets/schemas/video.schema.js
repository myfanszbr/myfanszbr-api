"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
exports.VideoSchema = new mongoose_1.Schema({
    performerId: {
        type: mongoose_2.Types.ObjectId,
        index: true
    },
    participantIds: [
        { index: true, type: String }
    ],
    fileId: mongoose_2.Types.ObjectId,
    type: {
        type: String,
        index: true
    },
    title: {
        type: String
    },
    slug: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true
    },
    description: String,
    status: {
        type: String,
        default: 'active'
    },
    tags: [
        { type: String, index: true }
    ],
    isSchedule: {
        type: Boolean,
        default: false
    },
    isSale: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    processing: Boolean,
    teaserProcessing: Boolean,
    thumbnailId: mongoose_2.Types.ObjectId,
    teaserId: mongoose_2.Types.ObjectId,
    stats: {
        likes: {
            type: Number,
            default: 0
        },
        bookmarks: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        }
    },
    createdBy: mongoose_2.Types.ObjectId,
    updatedBy: mongoose_2.Types.ObjectId,
    scheduledAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=video.schema.js.map