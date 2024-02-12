"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingFieldsException = exports.InvalidFeedTypeException = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
class InvalidFeedTypeException extends kernel_1.RuntimeException {
    constructor(msg = 'Invalid feed type', error = 'INVALID_FEED_TYPE') {
        super(msg, error, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidFeedTypeException = InvalidFeedTypeException;
class MissingFieldsException extends kernel_1.RuntimeException {
    constructor(msg = 'Missing required properties', error = 'MISSING_REQUIRED_PROPS') {
        super(msg, error, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.MissingFieldsException = MissingFieldsException;
//# sourceMappingURL=invalid-type.exception.js.map