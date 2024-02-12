export declare class UserRegisterPayload {
    name: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    username: string;
    gender: string;
    country: string;
    phone: string;
}
export declare class UserCreatePayload extends UserRegisterPayload {
    roles: string[];
    verifiedEmail: boolean;
    balance: number;
}
