"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var S3ConfigurationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageService = exports.S3ConfigurationService = exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const multerS3 = require("multer-s3");
const path_1 = require("path");
const config_1 = require("@nestjs/config");
const contants_1 = require("../contants");
class S3Service {
    static listObjects(params, options) {
        const s3 = new AWS.S3(options);
        return s3.listObjects(params).promise();
    }
    static getObject(params, options) {
        const s3 = new AWS.S3(options);
        return s3.getObject(params).promise();
    }
    static createReadStream(params, options) {
        const s3 = new AWS.S3(options);
        return s3.getObject(params).createReadStream();
    }
    static deleteObject(params, options) {
        const s3 = new AWS.S3(options);
        return s3.deleteObject(params).promise();
    }
    static deleteObjects(params, options) {
        const s3 = new AWS.S3(options);
        return s3.deleteObjects(params).promise();
    }
    static getSignedUrlPromise(params, options, operation = 'getObject') {
        const s3 = new AWS.S3(options);
        return s3.getSignedUrlPromise(operation, params);
    }
    static getSignedUrl(params, options, operation = 'getObject') {
        const s3 = new AWS.S3(options);
        const signedUrl = s3.getSignedUrl(operation, params);
        return signedUrl;
    }
    static upload(params, configurationOption, uploadOptions) {
        const s3 = new AWS.S3(configurationOption);
        return s3.upload(params, uploadOptions).promise();
    }
    static getEndpoint() {
        return settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.AWS_S3_BUCKET_ENDPOINT);
    }
}
exports.S3Service = S3Service;
let S3ConfigurationService = S3ConfigurationService_1 = class S3ConfigurationService {
    constructor(settingService, queueEventService) {
        this.settingService = settingService;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe(constants_1.SETTING_CHANNEL, 'HANDLE_S3_SETTINGS_CHANGE', this.subscribeChange.bind(this));
        this.update();
    }
    async subscribeChange(event) {
        const { value, key } = event.data;
        const options = S3ConfigurationService_1.s3ConfigurationOptions;
        switch (key) {
            case constants_1.SETTING_KEYS.AWS_S3_ACCESS_KEY_ID:
                AWS.config.update({ accessKeyId: value });
                this.setCredential(Object.assign(Object.assign({}, options), { accessKeyId: value }));
                break;
            case constants_1.SETTING_KEYS.AWS_S3_SECRET_ACCESS_KEY:
                AWS.config.update({ secretAccessKey: value });
                this.setCredential(Object.assign(Object.assign({}, options), { secretAccessKey: value }));
                break;
            case constants_1.SETTING_KEYS.AWS_S3_BUCKET_ENDPOINT:
                S3ConfigurationService_1.s3ConfigurationOptions.endpoint = value;
                this.setCredential(Object.assign(Object.assign({}, options), { endpoint: value }));
                break;
            case constants_1.SETTING_KEYS.AWS_S3_BUCKET_NAME:
                S3ConfigurationService_1.s3ConfigurationOptions.params.Bucket = value;
                this.setBucket(value);
                break;
            case constants_1.SETTING_KEYS.AWS_S3_REGION_NAME:
                AWS.config.update({ region: value });
                this.setCredential(Object.assign(Object.assign({}, options), { region: value }));
                break;
            default:
                break;
        }
    }
    setCredential(options) {
        S3ConfigurationService_1.s3ConfigurationOptions = options;
    }
    getCredential() {
        return S3ConfigurationService_1.s3ConfigurationOptions;
    }
    setBucket(Bucket) {
        this.Bucket = Bucket;
    }
    getBucket() {
        return this.Bucket;
    }
    async update() {
        const [accessKeyId, secretAccessKey, region, endpoint, Bucket] = await Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_ACCESS_KEY_ID),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_SECRET_ACCESS_KEY),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_REGION_NAME),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_BUCKET_ENDPOINT),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_BUCKET_NAME)
        ]);
        const options = {
            signatureVersion: 'v4',
            accessKeyId,
            secretAccessKey,
            region,
            endpoint
        };
        AWS.config.update(options);
        this.setBucket(Bucket);
        this.setCredential(options);
    }
    async checkSetting() {
        const [enabled, accessKeyId, secretAccessKey, region, endpoint, bucket] = await Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_ENABLE),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_ACCESS_KEY_ID),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_SECRET_ACCESS_KEY),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_REGION_NAME),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_BUCKET_ENDPOINT),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.AWS_S3_BUCKET_NAME)
        ]);
        if (!enabled || !accessKeyId || !secretAccessKey || !region || !endpoint || !bucket) {
            return false;
        }
        return true;
    }
};
S3ConfigurationService.s3ConfigurationOptions = {
    params: {}
};
S3ConfigurationService = S3ConfigurationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_1.SettingService,
        kernel_1.QueueEventService])
], S3ConfigurationService);
exports.S3ConfigurationService = S3ConfigurationService;
let S3StorageService = class S3StorageService {
    constructor(s3ConfigurationService, config) {
        this.s3ConfigurationService = s3ConfigurationService;
        this.config = config;
    }
    checkSetting() {
        return this.s3ConfigurationService.checkSetting();
    }
    createMulterS3Storage(options) {
        const credential = this.s3ConfigurationService.getCredential();
        const bucket = this.s3ConfigurationService.getBucket();
        const s3 = new AWS.S3(credential);
        const { acl, fileName } = options;
        const { config: { endpoint, region } } = s3;
        const folderPath = acl === contants_1.S3ObjectCannelACL.PublicRead ? 'public' : 'protected';
        return multerS3({
            s3,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: (req, file, cb) => cb(null, Object.assign(Object.assign({}, file), { bucket: bucket || process.env.AWS_S3_BUCKET_NAME, endpoint,
                region, expires: this.config.get('s3.expires').toString() })),
            bucket: (req, file, cb) => cb(null, bucket || process.env.AWS_S3_BUCKET_NAME),
            key: (req, file, cb) => {
                if (fileName) {
                    return cb(null, (0, path_1.join)(folderPath, fileName));
                }
                return cb(null, (0, path_1.join)(folderPath, kernel_1.MulterHelper.formatFileName(file)));
            },
            acl: (req, file, cb) => cb(null, acl)
        });
    }
    createMultiUploadMulterS3Storage(options) {
        const credential = this.s3ConfigurationService.getCredential();
        const bucket = this.s3ConfigurationService.getBucket();
        const s3 = new AWS.S3(credential);
        const { acls } = options;
        const { config: { endpoint, region } } = s3;
        return multerS3({
            s3,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: (req, file, cb) => cb(null, Object.assign(Object.assign({}, file), { bucket: bucket || process.env.AWS_S3_BUCKET_NAME, endpoint,
                region, expires: this.config.get('s3.expires').toString() })),
            bucket: (req, file, cb) => cb(null, bucket || process.env.AWS_S3_BUCKET_NAME),
            key: (req, file, cb) => {
                const folderPath = acls[file.fieldname] === contants_1.S3ObjectCannelACL.PublicRead
                    ? 'public'
                    : 'protected';
                return cb(null, (0, path_1.join)(folderPath, kernel_1.MulterHelper.formatFileName(file)));
            },
            acl: (req, file, cb) => cb(null, acls[file.fieldname] || contants_1.S3ObjectCannelACL.PublicRead)
        });
    }
    upload(Key, ACL, file, mimeType) {
        const credential = this.s3ConfigurationService.getCredential();
        const Bucket = this.s3ConfigurationService.getBucket();
        const folderPath = ACL === 'public-read' ? 'public' : 'protected';
        const { endpoint, region } = credential;
        return S3Service.upload({
            Bucket,
            Key: (0, path_1.join)(folderPath, Key),
            ACL,
            Body: file,
            ContentType: mimeType,
            Metadata: {
                mimeType,
                endpoint: endpoint.toString(),
                region,
                bucket: Bucket,
                expires: this.config.get('s3.expires').toString()
            }
        }, credential);
    }
    getObject(Key) {
        const credential = this.s3ConfigurationService.getCredential();
        const Bucket = this.s3ConfigurationService.getBucket();
        return S3Service.getObject({ Bucket, Key }, credential);
    }
    deleteObjects(del) {
        const credential = this.s3ConfigurationService.getCredential();
        const Bucket = this.s3ConfigurationService.getBucket();
        return S3Service.deleteObjects({ Bucket, Delete: del }, credential);
    }
};
S3StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [S3ConfigurationService,
        config_1.ConfigService])
], S3StorageService);
exports.S3StorageService = S3StorageService;
//# sourceMappingURL=s3.service.js.map