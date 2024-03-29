import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { FileService } from 'src/modules/file/services';
import { BannerDto } from '../dtos';
import { BannerCreatePayload, BannerUpdatePayload } from '../payloads';
import { BannerModel } from '../models';
export declare const BANNER_CHANNEL = "BANNER_CHANNEL";
export declare class BannerService {
    private readonly bannerModel;
    private readonly fileService;
    constructor(bannerModel: Model<BannerModel>, fileService: FileService);
    create(file: FileDto, payload: BannerCreatePayload, creator?: UserDto): Promise<BannerDto>;
    update(id: string | Types.ObjectId, payload: BannerUpdatePayload, updater?: UserDto): Promise<BannerDto>;
    details(id: string | Types.ObjectId): Promise<BannerDto>;
    delete(id: string | Types.ObjectId): Promise<boolean>;
}
