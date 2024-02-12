"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowSchema = void 0;
const mongoose = require("mongoose");
exports.FollowSchema = new mongoose.Schema({
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=follow.schema.js.map