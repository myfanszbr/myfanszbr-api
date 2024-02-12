import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { UserDto } from 'src/modules/user/dtos';
import { ProductModel } from '../models';
import { ProductDto } from '../dtos';
import { ProductSearchRequest } from '../payloads';
export declare class ProductSearchService {
    private readonly performerService;
    private readonly productModel;
    private readonly fileService;
    constructor(performerService: PerformerService, productModel: Model<ProductModel>, fileService: FileService);
    adminSearch(req: ProductSearchRequest): Promise<PageableData<ProductDto>>;
    performerSearch(req: ProductSearchRequest, user: UserDto): Promise<PageableData<ProductDto>>;
    userSearch(req: ProductSearchRequest): Promise<PageableData<ProductDto>>;
}
