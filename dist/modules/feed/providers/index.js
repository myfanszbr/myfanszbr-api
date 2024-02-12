"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledStreamNotificationProviders = exports.voteProviders = exports.pollProviders = exports.feedProviders = exports.SCHEDULED_STREAM_NOTIFICATION_PROVIDER = exports.VOTE_PROVIDER = exports.POLL_PROVIDER = exports.FEED_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.FEED_PROVIDER = 'FEED_PROVIDER';
exports.POLL_PROVIDER = 'POLL_PROVIDER';
exports.VOTE_PROVIDER = 'VOTE_PROVIDER';
exports.SCHEDULED_STREAM_NOTIFICATION_PROVIDER = 'SCHEDULED_STREAM_NOTIFICATION_PROVIDER';
exports.feedProviders = [
    {
        provide: exports.FEED_PROVIDER,
        useFactory: (connection) => connection.model('Feed', schemas_1.FeedSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
exports.pollProviders = [
    {
        provide: exports.POLL_PROVIDER,
        useFactory: (connection) => connection.model('Poll', schemas_1.PollSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
exports.voteProviders = [
    {
        provide: exports.VOTE_PROVIDER,
        useFactory: (connection) => connection.model('Vote', schemas_1.VoteSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
exports.scheduledStreamNotificationProviders = [
    {
        provide: exports.SCHEDULED_STREAM_NOTIFICATION_PROVIDER,
        useFactory: (connection) => connection.model('ScheduledStreamNotifications', schemas_1.ScheduledStreamNotificationSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map