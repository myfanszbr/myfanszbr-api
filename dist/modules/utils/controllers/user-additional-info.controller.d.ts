import { DataResponse } from 'src/kernel';
import { UserAdditionalInfoService } from '../services/user-additional-info.service';
export declare class UserAdditionalInfoController {
    private readonly userAdditionalInfoService;
    constructor(userAdditionalInfoService: UserAdditionalInfoService);
    getBodyInfo(): DataResponse<{
        heights: {
            value: string;
            text: string;
        }[];
        weights: {
            value: string;
            text: string;
        }[];
        ages: {
            value: string;
            text: string;
        }[];
        butts: {
            value: string;
            text: string;
        }[];
        eyes: {
            value: string;
            text: string;
        }[];
        ethnicities: {
            value: string;
            text: string;
        }[];
        genders: {
            value: string;
            text: string;
        }[];
        hairs: {
            value: string;
            text: string;
        }[];
        pubicHairs: {
            value: string;
            text: string;
        }[];
        bodyTypes: {
            value: string;
            text: string;
        }[];
        sexualOrientations: {
            value: string;
            text: string;
        }[];
    }>;
}
