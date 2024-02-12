import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class WSGuard implements CanActivate {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
