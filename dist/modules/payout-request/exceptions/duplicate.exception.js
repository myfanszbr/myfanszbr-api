"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateRequestException = void 0;
const common_1 = require("@nestjs/common");
class DuplicateRequestException extends common_1.HttpException {
    constructor() {
        super('Please wait for the current request get paid first!', 422);
    }
}
exports.DuplicateRequestException = DuplicateRequestException;
//# sourceMappingURL=duplicate.exception.js.map