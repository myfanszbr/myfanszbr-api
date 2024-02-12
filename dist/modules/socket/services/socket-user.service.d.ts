import { RedisService } from '@liaoliaots/nestjs-redis';
import { Types } from 'mongoose';
import { AgendaService, QueueEventService } from 'src/kernel';
export declare const CONNECTED_USER_REDIS_KEY = "connected_users";
export declare const CONNECTED_ROOM_REDIS_KEY = "user:";
export declare class SocketUserService {
    private readonly agenda;
    private readonly queueEventService;
    private readonly redisService;
    server: any;
    constructor(agenda: AgendaService, queueEventService: QueueEventService, redisService: RedisService);
    private defineJobs;
    private scheduleOfflineSockets;
    addConnection(sourceId: string | Types.ObjectId, socketId: string): Promise<void>;
    userGetAllConnectedRooms(id: string): Promise<string[]>;
    removeConnection(sourceId: string | Types.ObjectId, socketId: string): Promise<number>;
    addConnectionToRoom(roomId: string, id: string, value: any): Promise<void>;
    removeConnectionFromRoom(roomId: string, userId: string): Promise<void>;
    getConnectionValue(roomId: string, id: string): Promise<string>;
    getRoomUserConnections(roomId: string): Promise<Record<string, string>>;
    countRoomUserConnections(roomId: string): Promise<number>;
    emitToUsers(userIds: string | string[] | Types.ObjectId | Types.ObjectId[], eventName: string, data: any): Promise<void>;
    emitToRoom(roomName: string, eventName: string, data: any): Promise<void>;
}
