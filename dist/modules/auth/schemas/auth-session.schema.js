"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSessionSchema = void 0;
const mongoose = require("mongoose");
exports.AuthSessionSchema = new mongoose.Schema({
    source: {
        type: String,
        default: 'user'
    },
    sourceId: {
        type: mongoose.Types.ObjectId,
        index: true,
        unique: true
    },
    token: {
        type: String,
        index: true
    },
    expiryAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'auth_sessions'
});
//# sourceMappingURL=auth-session.schema.js.map