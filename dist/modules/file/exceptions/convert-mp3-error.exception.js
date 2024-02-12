"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertMp3ErrorException = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
class ConvertMp3ErrorException extends kernel_1.RuntimeException {
    constructor(error = 'convert mp3 error!') {
        super('Convert mp3 error', error, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ConvertMp3ErrorException = ConvertMp3ErrorException;
//# sourceMappingURL=convert-mp3-error.exception.js.map