"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYOUT_REQUEST_EVENT = exports.PAYOUT_REQUEST_CHANEL = exports.SOURCE_TYPE = exports.STATUSES = void 0;
exports.STATUSES = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DONE: 'done'
};
exports.SOURCE_TYPE = {
    PERFORMER: 'performer',
    AGENT: 'agent'
};
exports.PAYOUT_REQUEST_CHANEL = 'PAYOUT_REQUEST_CHANEL';
var PAYOUT_REQUEST_EVENT;
(function (PAYOUT_REQUEST_EVENT) {
    PAYOUT_REQUEST_EVENT["CREATED"] = "CREATED";
    PAYOUT_REQUEST_EVENT["UPDATED"] = "UPDATED";
})(PAYOUT_REQUEST_EVENT = exports.PAYOUT_REQUEST_EVENT || (exports.PAYOUT_REQUEST_EVENT = {}));
//# sourceMappingURL=constants.js.map