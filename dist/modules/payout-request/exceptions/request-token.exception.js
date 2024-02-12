"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRequestTokenException = void 0;
const common_1 = require("@nestjs/common");
class InvalidRequestTokenException extends common_1.HttpException {
    constructor() {
        super('Requested tokens is greater than your balance, please check again', 422);
    }
}
exports.InvalidRequestTokenException = InvalidRequestTokenException;
//# sourceMappingURL=request-token.exception.js.map