"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const kernel_1 = require("../../kernel");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const pubClient = (0, redis_1.createClient)((0, kernel_1.getConfig)('redis'));
        const subClient = pubClient.duplicate();
        const redisAdapter = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        Promise.all([pubClient.connect(), subClient.connect()]);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map