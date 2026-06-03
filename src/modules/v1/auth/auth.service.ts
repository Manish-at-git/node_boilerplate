import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "@/config";
import ApiError from "@/utils/ApiError";
import httpStatus from "@/constants/httpStatus";

import * as authRepository from "./auth.repository";

import type {
    IAuthTokens,
    IRegisterBody,
    ILoginBody,
    ITokenPayload,
} from "./auth.types";

const generateTokens = (payload: ITokenPayload): IAuthTokens => {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
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
    });
};

const verifyRefreshToken = ( token: string ): ITokenPayload => {
    return jwt.verify(
        token,
        env.JWT_REFRESH_SECRET,
    ) as ITokenPayload;
};

const refresh = ( refreshToken: string ): IAuthTokens => {
    const payload = verifyRefreshToken(refreshToken);

    return generateTokens({
        id: payload.id,
        email: payload.email,
    });
};

export default {
    register,
    login,
    verifyRefreshToken,
    refresh
};
