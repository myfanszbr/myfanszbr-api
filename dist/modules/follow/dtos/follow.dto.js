"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowDto = void 0;
const lodash_1 = require("lodash");
class FollowDto {
    constructor(data) {
        Object.assign(this, (0, lodash_1.pick)(data, [
            '_id',
            'followerId',
            'followingId',
            'followerInfo',
            'followingInfo',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.FollowDto = FollowDto;
//# sourceMappingURL=follow.dto.js.map