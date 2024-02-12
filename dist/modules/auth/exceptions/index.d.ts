import { HttpException } from '@nestjs/common';
export declare class AccountExistedException extends HttpException {
    constructor();
}
export declare class AccountInactiveException extends HttpException {
    constructor();
}
export declare class AccountNotFoundxception extends HttpException {
    constructor();
}
export declare class AuthErrorException extends HttpException {
    constructor();
}
export declare class EmailNotVerifiedException extends HttpException {
    constructor();
}
export declare class PasswordIncorrectException extends HttpException {
    constructor();
}
