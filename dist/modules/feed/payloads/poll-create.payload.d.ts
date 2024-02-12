export declare class PollCreatePayload {
    description: string;
    expiredAt: Date;
    performerId: string;
}
export declare class VoteCreatePayload {
    targetSource: string;
    targetId: string;
}
