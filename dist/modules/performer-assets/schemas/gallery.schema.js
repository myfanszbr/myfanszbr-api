"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GallerySchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
exports.GallerySchema = new mongoose_1.Schema({
    performerId: { type: mongoose_2.Types.ObjectId, index: true },
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
    price: {
        type: Number,
        default: 0
    },
    isSale: {
        type: Boolean,
        default: false
    },
    numOfItems: {
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
    coverPhotoId: mongoose_2.Types.ObjectId,
    createdBy: mongoose_2.Types.ObjectId,
    updatedBy: mongoose_2.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=gallery.schema.js.map