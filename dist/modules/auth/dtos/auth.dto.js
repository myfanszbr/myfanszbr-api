"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCreateDto = void 0;
class AuthCreateDto {
    constructor(data) {
        this.source = 'user';
        this.type = 'password';
        this.source = data.source || 'user';
        this.type = data.type || 'password';
        this.sourceId = data.sourceId;
        this.key = data.key;
        this.value = data.value;
    }
}
exports.AuthCreateDto = AuthCreateDto;
//# sourceMappingURL=auth.dto.js.map