/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { DataResponse } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { ProductService } from '../services/product.service';
import { ProductSearchService } from '../services/product-search.service';
import { ProductSearchRequest } from '../payloads';
export declare class UserProductsController {
    private readonly authService;
    private readonly productService;
    private readonly productSearchService;
    constructor(authService: AuthService, productService: ProductService, productSearchService: ProductSearchService);
    search(req: ProductSearchRequest): Promise<DataResponse<{
        total: number;
        data: {
            _id: import("mongoose").Types.ObjectId;
            performerId: import("mongoose").Types.ObjectId;
            digitalFileId: import("mongoose").Types.ObjectId;
            image: string;
            type: string;
            name: string;
            slug: string;
            description: string;
            status: string;
            price: number;
            stock: number;
            performer: any;
            createdBy: import("mongoose").Types.ObjectId;
            updatedBy: import("mongoose").Types.ObjectId;
            createdAt: Date;
            updatedAt: Date;
            isBookMarked: boolean;
            stats: {
                likes: number;
                bookmarks: number;
                comments: number;
                views: number;
            };
        }[];
    }>>;
    details(id: string, user: UserDto): Promise<DataResponse<{
        _id: import("mongoose").Types.ObjectId;
        performerId: import("mongoose").Types.ObjectId;
        digitalFileId: import("mongoose").Types.ObjectId;
        image: string;
        type: string;
        name: string;
        slug: string;
        description: string;
        status: string;
        price: number;
        stock: number;
        performer: any;
        createdBy: import("mongoose").Types.ObjectId;
        updatedBy: import("mongoose").Types.ObjectId;
        createdAt: Date;
        updatedAt: Date;
        isBookMarked: boolean;
        stats: {
            likes: number;
            bookmarks: number;
            comments: number;
            views: number;
        };
    }>>;
    getDownloadLink(id: string, user: UserDto, req: any): Promise<DataResponse<{
        downloadLink: string;
    }>>;
    checkAuth(request: any): Promise<DataResponse<boolean>>;
}
