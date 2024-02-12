/// <reference types="node" />
import * as AWS from 'aws-sdk';
import { QueueEventService } from 'src/kernel';
import { SettingService } from 'src/modules/settings';
import { StorageEngine } from 'multer';
import { Body, ObjectCannedACL, Delete } from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';
import { MulterS3Options, MultiUploadMulterS3Options, S3ServiceConfigurationOptions } from '../interfaces';
export declare class S3Service {
    static listObjects(params: AWS.S3.ListObjectsRequest, options?: S3ServiceConfigurationOptions): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.ListObjectsOutput, AWS.AWSError>>;
    static getObject(params: AWS.S3.GetObjectRequest, options?: S3ServiceConfigurationOptions): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>>;
    static createReadStream(params: AWS.S3.GetObjectRequest, options?: S3ServiceConfigurationOptions): import("stream").Readable;
    static deleteObject(params: AWS.S3.DeleteObjectRequest, options?: S3ServiceConfigurationOptions): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError>>;
    static deleteObjects(params: AWS.S3.DeleteObjectsRequest, options?: S3ServiceConfigurationOptions): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.DeleteObjectsOutput, AWS.AWSError>>;
    static getSignedUrlPromise(params: any, options?: S3ServiceConfigurationOptions, operation?: string): Promise<string>;
    static getSignedUrl(params: any, options?: S3ServiceConfigurationOptions, operation?: string): string;
    static upload(params: AWS.S3.PutObjectRequest, configurationOption?: S3ServiceConfigurationOptions, uploadOptions?: AWS.S3.ManagedUpload.ManagedUploadOptions): Promise<AWS.S3.ManagedUpload.SendData>;
    static getEndpoint(): string;
}
export declare class S3ConfigurationService {
    private readonly settingService;
    private readonly queueEventService;
    static s3ConfigurationOptions: S3ServiceConfigurationOptions;
    private Bucket;
    constructor(settingService: SettingService, queueEventService: QueueEventService);
    private subscribeChange;
    private setCredential;
    getCredential(): S3ServiceConfigurationOptions;
    private setBucket;
    getBucket(): string;
    update(): Promise<void>;
    checkSetting(): Promise<boolean>;
}
export declare class S3StorageService {
    private readonly s3ConfigurationService;
    private readonly config;
    constructor(s3ConfigurationService: S3ConfigurationService, config: ConfigService);
    checkSetting(): Promise<boolean>;
    createMulterS3Storage(options: MulterS3Options): StorageEngine;
    createMultiUploadMulterS3Storage(options: MultiUploadMulterS3Options): StorageEngine;
    upload(Key: string, ACL: ObjectCannedACL, file: Body, mimeType: string): Promise<AWS.S3.ManagedUpload.SendData>;
    getObject(Key: string): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>>;
    deleteObjects(del: Delete): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.DeleteObjectsOutput, AWS.AWSError>>;
}
