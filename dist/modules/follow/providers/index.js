"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followProviders = exports.FOLLOW_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const follow_schema_1 = require("../schemas/follow.schema");
exports.FOLLOW_MODEL_PROVIDER = 'FOLLOW_MODEL_PROVIDER';
exports.followProviders = [
    {
        provide: exports.FOLLOW_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Follows', follow_schema_1.FollowSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map