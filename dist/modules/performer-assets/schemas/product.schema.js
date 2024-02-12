"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
exports.ProductSchema = new mongoose_1.Schema({
    performerId: {
        type: mongoose_2.Types.ObjectId,
        index: true
    },
    digitalFileId: mongoose_2.Types.ObjectId,
    imageId: mongoose_2.Types.ObjectId,
    name: {
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
    type: {
        type: String,
        default: 'physical'
    },
    status: {
        type: String,
        default: 'active'
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=product.schema.js.map