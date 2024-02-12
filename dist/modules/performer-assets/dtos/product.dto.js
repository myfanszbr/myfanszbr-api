"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDto = void 0;
const lodash_1 = require("lodash");
class ProductDto {
    constructor(init) {
        Object.assign(this, (0, lodash_1.pick)(init, [
            '_id',
            'performerId',
            'digitalFileId',
            'digitalFileUrl',
            'imageId',
            'image',
            'type',
            'name',
            'slug',
            'description',
            'status',
            'price',
            'stock',
            'performer',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt',
            'isBookMarked',
            'stats'
        ]));
    }
    toPublic() {
        return {
            _id: this._id,
            performerId: this.performerId,
            digitalFileId: this.digitalFileId,
            image: this.image,
            type: this.type,
            name: this.name,
            slug: this.slug,
            description: this.description,
            status: this.status,
            price: this.price,
            stock: this.stock,
            performer: this.performer,
            createdBy: this.createdBy,
            updatedBy: this.updatedBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isBookMarked: this.isBookMarked,
            stats: this.stats
        };
    }
}
exports.ProductDto = ProductDto;
//# sourceMappingURL=product.dto.js.map