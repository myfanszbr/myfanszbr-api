import { IConvertOptions, IConvertResponse } from './video.service';
export declare class AudioFileService {
    convert2Mp3(filePath: string, options?: IConvertOptions): Promise<IConvertResponse>;
}
