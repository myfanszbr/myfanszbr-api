"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationDto = void 0;
const lodash_1 = require("lodash");
class ConversationDto {
    constructor(data) {
        Object.assign(this, (0, lodash_1.pick)(data, [
            '_id',
            'type',
            'name',
            'recipients',
            'lastMessage',
            'lastSenderId',
            'lastMessageCreatedAt',
            'meta',
            'createdAt',
            'updatedAt',
            'recipientInfo',
            'totalNotSeenMessages',
            'isSubscribed',
            'isBlocked',
            'streamId',
            'performerId'
        ]));
    }
    getRoomName() {
        return `conversation-${this.type}-${this._id}`;
    }
}
exports.ConversationDto = ConversationDto;
//# sourceMappingURL=conversation.dto.js.map