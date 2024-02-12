import { Types } from 'mongoose';
import { FileDto } from './file.dto';
export declare class FileResponseDto {
    _id?: string | Types.ObjectId;
    url?: string;
    thumbnailUrl?: string;
    static fromFile(file: FileDto): FileResponseDto;
}
