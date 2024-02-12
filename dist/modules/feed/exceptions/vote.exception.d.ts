import { RuntimeException } from 'src/kernel';
export declare class AlreadyVotedException extends RuntimeException {
    constructor(msg?: string | object, error?: string);
}
export declare class PollExpiredException extends RuntimeException {
    constructor(msg?: string | object, error?: string);
}
