import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
export declare class FeedFileService {
    private readonly fileService;
    constructor(fileService: FileService);
    validateTeaser(video: FileDto): Promise<any>;
    validatePhoto(photo: FileDto): Promise<any>;
    validateVideo(video: FileDto): Promise<any>;
    validateAudio(audio: FileDto): Promise<any>;
}
