"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSchema = void 0;
const mongoose_1 = require("mongoose");
const contants_1 = require("../../storage/contants");
exports.FileSchema = new mongoose_1.Schema({
    type: {
        type: String,
        index: true
    },
    name: String,
    description: String,
    mimeType: String,
    server: { type: String, index: true, default: contants_1.Storage.DiskStorage },
    path: String,
    absolutePath: String,
    width: Number,
    height: Number,
    duration: Number,
    size: Number,
    status: String,
    encoding: String,
    thumbnails: mongoose_1.Schema.Types.Mixed,
    refItems: [{
            itemId: mongoose_1.Types.ObjectId,
            itemType: String,
            _id: false
        }],
    acl: {
        type: String,
        index: true
    },
    metadata: mongoose_1.Schema.Types.Mixed,
    error: mongoose_1.Schema.Types.Mixed,
    createdBy: mongoose_1.Types.ObjectId,
    updatedBy: mongoose_1.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=file.schema.js.map