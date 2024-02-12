"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthLoginSchema = void 0;
const mongoose = require("mongoose");
exports.OAuthLoginSchema = new mongoose.Schema({
    source: {
        type: String,
        default: 'user'
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    provider: {
        type: String
    },
    value: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'oauthloginsocials'
});
//# sourceMappingURL=oauth.schema.js.map