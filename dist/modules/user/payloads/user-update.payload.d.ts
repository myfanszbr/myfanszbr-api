export declare class UserUpdatePayload {
    firstName: string;
    lastName: string;
    phone: string;
    name: string;
    email: string;
    username: string;
    gender: string;
    country: string;
    password: string;
}
export declare class AdminUpdatePayload extends UserUpdatePayload {
    roles: string[];
    verifiedEmail: boolean;
    balance: number;
}
