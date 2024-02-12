"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryDto = void 0;
const lodash_1 = require("lodash");
class GalleryDto {
    constructor(init) {
        Object.assign(this, (0, lodash_1.pick)(init, [
            '_id',
            'performerId',
            'type',
            'title',
            'slug',
            'description',
            'status',
            'coverPhotoId',
            'price',
            'isSale',
            'coverPhoto',
            'performer',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt',
            'isBookMarked',
            'isSubscribed',
            'isBought',
            'stats',
            'numOfItems'
        ]));
    }
    static fromModel(model) {
        return new GalleryDto(model);
    }
}
exports.GalleryDto = GalleryDto;
//# sourceMappingURL=gallery.dto.js.map