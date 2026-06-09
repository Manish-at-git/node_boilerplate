import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "@/config";
import ApiError from "@/utils/ApiError";
import httpStatus from "@/constants/httpStatus";

import * as authRepository from "./auth.repository";
import common from "@/utils/common";

import type {
    IAuthTokens,
    IRegisterBody,
    ILoginBody,
    ITokenPayload,
} from "./auth.types";

const generateTokens = async (payload: ITokenPayload): Promise<IAuthTokens> => {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    });

    const tokenHash = common.hashToken(refreshToken);

    await authRepository.createRefreshToken({
        userId: payload.id,
        tokenHash: tokenHash,
        expiresAt: new Date( Date.now() + 30 * 24 * 60 * 60 * 100),
    });

    return {
        accessToken,
        refreshToken,
    };
};

const register = async (body: IRegisterBody): Promise<IAuthTokens> => {
    const existingUser = await authRepository.findByEmail(body.email);

    if (existingUser) {
        throw new ApiError(httpStatus.CONFLICT, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await authRepository.createUser(
        body.name,
        body.email,
        hashedPassword,
    );

    return generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
    });
};

const login = async (body: ILoginBody): Promise<IAuthTokens> => {
    const user = await authRepository.findByEmail(body.email);

    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    return generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
    });
};

const verifyRefreshToken = (token: string): ITokenPayload => {
    return jwt.verify(
        token,
        env.JWT_REFRESH_SECRET,
    ) as ITokenPayload;
};

const refresh = async (
    refreshToken: string
): Promise<IAuthTokens> => {
    const payload = verifyRefreshToken(refreshToken);

    const tokenHash = common.hashToken(refreshToken);

    const storedToken =
        await authRepository.findRefreshTokenByHash(
            tokenHash
        );

    if (!storedToken) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Invalid refresh token"
        );
    }

    if (storedToken.revoked_at) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Token revoked"
        );
    }

    await authRepository.revokeRefreshToken(
        tokenHash
    );

    return await generateTokens({
        id: payload.id,
        email: payload.email,
        role: payload.role
    });
};


const logout = async ( refreshToken: string ): Promise<void> => {
    const tokenHash = common.hashToken( refreshToken );
    await authRepository.revokeRefreshToken( tokenHash );
};


export default {
    register,
    login,
    verifyRefreshToken,
    refresh,
    logout
};
