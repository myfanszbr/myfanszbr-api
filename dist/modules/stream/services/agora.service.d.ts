import { ConfigService } from '@nestjs/config';
export declare class AgoraService {
    private readonly configService;
    constructor(configService: ConfigService);
    buildTokenWithAccount(channelName: string, account: string, role?: number): string;
}
