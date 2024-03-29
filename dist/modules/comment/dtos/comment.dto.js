"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentDto = void 0;
const lodash_1 = require("lodash");
class CommentDto {
    constructor(data) {
        Object.assign(this, (0, lodash_1.pick)(data, [
            '_id',
            'objectId',
            'content',
            'createdBy',
            'createdAt',
            'updatedAt',
            'creator',
            'object',
            'isAuth',
            'recipientId',
            'objectType',
            'isLiked',
            'totalReply',
            'totalLike'
        ]));
    }
}
exports.CommentDto = CommentDto;
//# sourceMappingURL=comment.dto.js.map