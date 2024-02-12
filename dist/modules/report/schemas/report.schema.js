"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = void 0;
const mongoose = require("mongoose");
const constants_1 = require("../constants");
exports.ReportSchema = new mongoose.Schema({
    title: String,
    description: String,
    source: {
        type: String,
        default: 'user',
        index: true
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    performerId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    target: {
        type: String,
        default: constants_1.REPORT_TARGET.FEED,
        index: true
    },
    targetId: {
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
//# sourceMappingURL=report.schema.js.map