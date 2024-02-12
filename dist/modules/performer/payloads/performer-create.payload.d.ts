export declare class PerformerRegisterPayload {
    name: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    phoneCode: string;
    gender: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;
    address: string;
    languages: string[];
    categoryIds: string[];
    height: string;
    weight: string;
    hair: string;
    pubicHair: string;
    butt: string;
    ethnicity: string;
    bio: string;
    eyes: string;
    sexualOrientation: string;
    isFreeSubscription: boolean;
    monthlyPrice: number;
    yearlyPrice: number;
    publicChatPrice: number;
    dateOfBirth: string;
    avatarId: string;
    idVerificationId: string;
    documentVerificationId: string;
}
export declare class PerformerCreatePayload extends PerformerRegisterPayload {
    status: string;
    verifiedEmail: boolean;
    verifiedAccount: boolean;
    verifiedDocument: boolean;
    isFeatured: boolean;
    commissionPercentage: number;
    balance: number;
}
