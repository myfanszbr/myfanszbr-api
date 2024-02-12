import { RuntimeException } from 'src/kernel';
export declare class InvalidFeedTypeException extends RuntimeException {
    constructor(msg?: string | object, error?: string);
}
export declare class MissingFieldsException extends RuntimeException {
    constructor(msg?: string | object, error?: string);
}
