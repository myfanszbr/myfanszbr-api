"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDto = void 0;
const _ = require("lodash");
class StreamDto {
    constructor(data) {
        Object.assign(this, _.pick(data, [
            '_id',
            'performerId',
            'performerInfo',
            'title',
            'description',
            'type',
            'sessionId',
            'isStreaming',
            'streamingTime',
            'lastStreamingTime',
            'isFree',
            'price',
            'createdAt',
            'updatedAt',
            'stats',
            'isSubscribed',
            'conversationId',
            'hasPurchased'
        ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            title: this.title,
            description: this.description,
            isStreaming: this.isStreaming,
            isFree: this.isFree,
            price: this.price,
            performerId: this.performerId,
            performerInfo: this.performerInfo,
            type: this.type,
            sessionId: this.sessionId,
            stats: this.stats,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isSubscribed: this.isSubscribed,
            conversationId: this.conversationId,
            hasPurchased: this.hasPurchased
        };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), { streamingTime: this.streamingTime, lastStreamingTime: this.lastStreamingTime });
    }
}
exports.StreamDto = StreamDto;
//# sourceMappingURL=stream.dto.js.map