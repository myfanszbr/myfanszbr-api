/// <reference types="multer" />
/// <reference types="multer-s3" />
export declare function transformException(error: Error | undefined): Error;
export interface IMulterUploadedFile extends Express.Multer.File, Express.MulterS3.File {
}
