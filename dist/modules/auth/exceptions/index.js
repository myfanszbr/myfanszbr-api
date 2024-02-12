"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordIncorrectException = exports.EmailNotVerifiedException = exports.AuthErrorException = exports.AccountNotFoundxception = exports.AccountInactiveException = exports.AccountExistedException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class AccountExistedException extends common_1.HttpException {
    constructor() {
        super(constants_1.ACCOUNT_EXISTED, 422);
    }
}
exports.AccountExistedException = AccountExistedException;
class AccountInactiveException extends common_1.HttpException {
    constructor() {
        super(constants_1.ACCOUNT_INACTIVE, 403);
    }
}
exports.AccountInactiveException = AccountInactiveException;
class AccountNotFoundxception extends common_1.HttpException {
    constructor() {
        super(constants_1.ACCOUNT_NOT_FOUND, 404);
    }
}
exports.AccountNotFoundxception = AccountNotFoundxception;
class AuthErrorException extends common_1.HttpException {
    constructor() {
        super(constants_1.CANNOT_AUTHENTICATE, 403);
    }
}
exports.AuthErrorException = AuthErrorException;
class EmailNotVerifiedException extends common_1.HttpException {
    constructor() {
        super(constants_1.EMAIL_NOT_VERIFIED, 422);
    }
}
exports.EmailNotVerifiedException = EmailNotVerifiedException;
class PasswordIncorrectException extends common_1.HttpException {
    constructor() {
        super(constants_1.PASSWORD_INCORRECT, 422);
    }
}
exports.PasswordIncorrectException = PasswordIncorrectException;
//# sourceMappingURL=index.js.map