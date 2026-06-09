export interface IUser {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    revoked_at?: string,
    role: string;
}

export interface ITokenPayload {
    id: string;
    email: string;
    role: string;
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

export interface CreateRefreshTokenDto {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
}