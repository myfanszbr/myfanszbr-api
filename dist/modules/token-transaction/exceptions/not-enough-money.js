"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotEnoughMoneyException = void 0;
const common_1 = require("@nestjs/common");
class NotEnoughMoneyException extends common_1.HttpException {
    constructor() {
        super('You have an insufficient wallet balance. Please top up.', 422);
    }
}
exports.NotEnoughMoneyException = NotEnoughMoneyException;
//# sourceMappingURL=not-enough-money.js.map