"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingDto = void 0;
const lodash_1 = require("lodash");
class SettingDto {
    constructor(data) {
        this.public = false;
        this.type = 'text';
        this.visible = true;
        data && Object.assign(this, (0, lodash_1.pick)(data, [
            '_id', 'key', 'value', 'oldValue', 'name', 'description', 'type', 'visible', 'public', 'meta', 'createdAt', 'updatedAt', 'extra',
            'autoload', 'ordering', 'group'
        ]));
    }
    getValue() {
        if (this.type === 'text' && !this.value) {
            return '';
        }
        return this.value;
    }
}
exports.SettingDto = SettingDto;
//# sourceMappingURL=setting.dto.js.map