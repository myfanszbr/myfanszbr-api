export declare class SelfUpdatePayload {
    name: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
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
    bodyType: string;
    sexualOrientation: string;
    isFreeSubscription: boolean;
    durationFreeSubscriptionDays: number;
    monthlyPrice: number;
    yearlyPrice: number;
    publicChatPrice: number;
    dateOfBirth: string;
    activateWelcomeVideo: boolean;
}
export declare class PerformerUpdatePayload extends SelfUpdatePayload {
    status: string;
    verifiedEmail: boolean;
    verifiedAccount: boolean;
    verifiedDocument: boolean;
    isFeatured: boolean;
    commissionPercentage: number;
    balance: number;
}
