"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFileName = void 0;
const StringHelper = require("./string.helper");
const formatFileName = (file) => {
    const ext = (StringHelper.getExt(file.originalname) || '').toLocaleLowerCase();
    const orgName = StringHelper.getFileName(file.originalname, true);
    const randomText = StringHelper.randomString(5);
    return (StringHelper.createAlias(`${randomText}-${orgName}`).toLocaleLowerCase()
        + ext);
};
exports.formatFileName = formatFileName;
//# sourceMappingURL=multer.helper.js.map