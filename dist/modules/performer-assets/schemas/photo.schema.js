"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
exports.PhotoSchema = new mongoose_1.Schema({
    performerId: {
        type: mongoose_2.Types.ObjectId,
        index: true
    },
    galleryId: {
        type: mongoose_2.Types.ObjectId,
        index: true
    },
    fileId: mongoose_2.Types.ObjectId,
    title: {
        type: String
    },
    description: String,
    status: {
        type: String,
        default: 'active'
    },
    price: {
        type: Number,
        default: 0
    },
    processing: Boolean,
    isGalleryCover: {
        type: Boolean,
        default: false
    },
    createdBy: mongoose_2.Types.ObjectId,
    updatedBy: mongoose_2.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=photo.schema.js.map