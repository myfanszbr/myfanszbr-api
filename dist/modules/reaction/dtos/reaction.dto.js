"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionDto = void 0;
const lodash_1 = require("lodash");
class ReactionDto {
    constructor(data) {
        Object.assign(this, (0, lodash_1.pick)(data, [
            '_id',
            'source',
            'action',
            'objectId',
            'objectInfo',
            'objectType',
            'createdBy',
            'creator',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.ReactionDto = ReactionDto;
//# sourceMappingURL=reaction.dto.js.map