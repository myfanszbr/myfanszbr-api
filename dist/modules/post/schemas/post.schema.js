"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
exports.PostSchema = new mongoose_1.Schema({
    authorId: mongoose_2.Types.ObjectId,
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
        unique: true
    },
    ordering: { type: Number, default: 0 },
    content: String,
    shortDescription: String,
    categoryIds: [
        {
            type: mongoose_2.Types.ObjectId,
            default: []
        }
    ],
    categorySearchIds: [
        {
            type: mongoose_2.Types.ObjectId,
            default: []
        }
    ],
    status: {
        type: String,
        default: 'draft'
    },
    image: {
        type: mongoose_1.Schema.Types.Mixed
    },
    createdBy: mongoose_2.Types.ObjectId,
    updatedBy: mongoose_2.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=post.schema.js.map