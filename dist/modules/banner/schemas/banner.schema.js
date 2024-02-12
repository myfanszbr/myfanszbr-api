"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
exports.BannerSchema = new mongoose_1.Schema({
    fileId: mongoose_2.Types.ObjectId,
    title: {
        type: String
    },
    link: String,
    description: { type: String },
    processing: Boolean,
    status: {
        type: String,
        default: 'active'
    },
    position: { type: String, default: 'top' },
    createdBy: mongoose_2.Types.ObjectId,
    updatedBy: mongoose_2.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=banner.schema.js.map