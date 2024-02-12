"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedDto = void 0;
const lodash_1 = require("lodash");
class FeedDto {
    constructor(data) {
        Object.assign(this, (0, lodash_1.pick)(data, [
            '_id',
            'type',
            'fromSourceId',
            'fromSource',
            'title',
            'slug',
            'text',
            'pollDescription',
            'fileIds',
            'pollIds',
            'totalLike',
            'totalComment',
            'createdAt',
            'updatedAt',
            'isLiked',
            'isBookMarked',
            'performer',
            'files',
            'polls',
            'isSale',
            'price',
            'isSubscribed',
            'isBought',
            'pollExpiredAt',
            'teaserId',
            'teaser',
            'thumbnailId',
            'thumbnail',
            'isPinned',
            'pinnedAt',
            'status',
            'isSchedule',
            'scheduleAt',
            'streamingScheduled',
            'isFollowed'
        ]));
    }
}
exports.FeedDto = FeedDto;
//# sourceMappingURL=feed.dto.js.map