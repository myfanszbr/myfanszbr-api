"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_MESSAGE_CHANNEL = exports.MESSAGE_PRIVATE_STREAM_CHANNEL = exports.MESSAGE_EVENT = exports.MESSAGE_CHANNEL = exports.CONVERSATION_TYPE = exports.MESSAGE_TYPE = void 0;
exports.MESSAGE_TYPE = {
    TEXT: 'text',
    PHOTO: 'photo',
    VIDEO: 'video',
    AUDIO: 'audio',
    NOTIFY: 'notify',
    TIP: 'tip'
};
exports.CONVERSATION_TYPE = {
    PRIVATE: 'private',
    GROUP: 'group',
    PUBLIC: 'public'
};
exports.MESSAGE_CHANNEL = 'MESSAGE_CHANNEL';
exports.MESSAGE_EVENT = {
    CREATED: 'created',
    UPDATED: 'updated',
    DELETED: 'deleted'
};
exports.MESSAGE_PRIVATE_STREAM_CHANNEL = 'MESSAGE_PRIVATE_STREAM_CHANNEL';
exports.DELETE_MESSAGE_CHANNEL = 'DELETE_MESSAGE_CHANNEL';
//# sourceMappingURL=constants.js.map