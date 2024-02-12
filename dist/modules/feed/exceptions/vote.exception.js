"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollExpiredException = exports.AlreadyVotedException = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
class AlreadyVotedException extends kernel_1.RuntimeException {
    constructor(msg = 'You have already voted it', error = 'ALREADY_VOTED') {
        super(msg, error, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
exports.AlreadyVotedException = AlreadyVotedException;
class PollExpiredException extends kernel_1.RuntimeException {
    constructor(msg = 'The poll is now closed', error = 'ALREADY_EXPIRED_TO_VOTE') {
        super(msg, error, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.PollExpiredException = PollExpiredException;
//# sourceMappingURL=vote.exception.js.map