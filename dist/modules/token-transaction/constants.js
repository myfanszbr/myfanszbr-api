"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OVER_PRODUCT_STOCK = exports.TOKEN_TRANSACTION_SUCCESS_CHANNEL = exports.PURCHASE_ITEM_TARGET_SOURCE = exports.ORDER_TOKEN_STATUS = exports.PURCHASE_ITEM_TARTGET_TYPE = exports.PURCHASE_ITEM_STATUS = exports.PurchaseItemType = exports.PURCHASE_ITEM_TYPE = void 0;
exports.PURCHASE_ITEM_TYPE = {
    VIDEO: 'video',
    PRODUCT: 'product',
    GALLERY: 'gallery',
    TIP: 'tip',
    FEED: 'feed',
    MESSAGE: 'message',
    PUBLIC_CHAT: 'public_chat',
    GROUP_CHAT: 'group_chat',
    PRIVATE_CHAT: 'private_chat',
    STREAM_TIP: 'stream_tip'
};
var PurchaseItemType;
(function (PurchaseItemType) {
    PurchaseItemType["VIDEO"] = "video";
    PurchaseItemType["PRODUCT"] = "product";
    PurchaseItemType["GALLERY"] = "gallery";
    PurchaseItemType["TIP"] = "tip";
    PurchaseItemType["FEED"] = "feed";
    PurchaseItemType["MESSAGE"] = "message";
    PurchaseItemType["GIFT"] = "gift";
    PurchaseItemType["PUBLIC_CHAT"] = "public_chat";
    PurchaseItemType["GROUP_CHAT"] = "group_chat";
    PurchaseItemType["PRIVATE_CHAT"] = "private_chat";
    PurchaseItemType["STREAM_TIP"] = "stream_tip";
})(PurchaseItemType = exports.PurchaseItemType || (exports.PurchaseItemType = {}));
exports.PURCHASE_ITEM_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    REFUNDED: 'refunded'
};
exports.PURCHASE_ITEM_TARTGET_TYPE = {
    PRODUCT: 'product',
    VIDEO: 'video',
    GALLERY: 'gallery',
    FEED: 'feed',
    MESSAGE: 'message',
    PERFORMER: 'performer',
    STREAM: 'stream'
};
exports.ORDER_TOKEN_STATUS = {
    PROCESSING: 'processing',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    REFUNDED: 'refunded'
};
var PURCHASE_ITEM_TARGET_SOURCE;
(function (PURCHASE_ITEM_TARGET_SOURCE) {
    PURCHASE_ITEM_TARGET_SOURCE["USER"] = "user";
})(PURCHASE_ITEM_TARGET_SOURCE = exports.PURCHASE_ITEM_TARGET_SOURCE || (exports.PURCHASE_ITEM_TARGET_SOURCE = {}));
exports.TOKEN_TRANSACTION_SUCCESS_CHANNEL = 'TOKEN_TRANSACTION_SUCCESS_CHANNEL';
exports.OVER_PRODUCT_STOCK = 'Not Enough Stock!';
//# sourceMappingURL=constants.js.map