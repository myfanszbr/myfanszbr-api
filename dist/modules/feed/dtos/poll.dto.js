"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollDto = void 0;
const lodash_1 = require("lodash");
class PollDto {
    constructor(data) {
        Object.assign(this, (0, lodash_1.pick)(data, [
            '_id',
            'createdBy',
            'totalVote',
            'description',
            'expiredAt',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.PollDto = PollDto;
//# sourceMappingURL=poll.dto.js.map