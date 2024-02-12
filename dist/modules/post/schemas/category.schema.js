"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
exports.CategorySchema = new mongoose_1.Schema({
    type: {
        type: String,
        index: true
    },
    parentId: {
        type: mongoose_2.Types.ObjectId,
        index: true
    },
    title: String,
    slug: {
        type: String,
        index: true
    },
    description: String,
    createdBy: mongoose_2.Types.ObjectId,
    updatedBy: mongoose_2.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=category.schema.js.map