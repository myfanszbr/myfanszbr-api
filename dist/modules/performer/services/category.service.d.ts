import { Model, Types } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { CategoryModel } from '../models';
import { CategoryCreatePayload, CategoryUpdatePayload } from '../payloads';
import { PerformerCategoryDto } from '../dtos';
export declare class CategoryService {
    private readonly categoryModel;
    constructor(categoryModel: Model<CategoryModel>);
    find(params: any): Promise<CategoryModel[]>;
    findByIdOrSlug(id: string | Types.ObjectId): Promise<CategoryModel>;
    generateSlug(name: string, id?: string | Types.ObjectId): any;
    create(payload: CategoryCreatePayload, user?: UserDto): Promise<PerformerCategoryDto>;
    update(id: string | Types.ObjectId, payload: CategoryUpdatePayload, user?: UserDto): Promise<PerformerCategoryDto>;
    delete(id: string | Types.ObjectId | CategoryModel): Promise<void>;
}
