export interface IUser {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
}

export interface ITokenPayload {
    id: string;
    email: string;
}

export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface IRegisterBody {
    name: string;
    email: string;
    password: string;
}

export interface ILoginBody {
    email: string;
    password: string;
}
