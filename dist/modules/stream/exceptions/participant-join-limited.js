"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantJoinLimitException = void 0;
const common_1 = require("@nestjs/common");
class ParticipantJoinLimitException extends common_1.HttpException {
    constructor() {
        super('Participants have reached the limitation!', 400);
    }
}
exports.ParticipantJoinLimitException = ParticipantJoinLimitException;
//# sourceMappingURL=participant-join-limited.js.map