import type { Request, Response } from 'express';

import ApiResponse from '@/utils/ApiResponse';
import httpStatus from '@/constants/httpStatus';
import type { IRegisterBody, ILoginBody } from './auth.types';
import authService from './auth.service';
import { cookieConfig } from "@/config/cookies";
import { ApiError } from '@/utils';

const register = async (req: Request, res: Response): Promise<void> => {
    const tokens = await authService.register(req.body as IRegisterBody);
    ApiResponse.success(res, tokens, httpStatus.CREATED, 'Registered successfully');
};

const login = async (req: Request, res: Response): Promise<void> => {
    const tokens = await authService.login(req.body as ILoginBody);

    // if you want to use cookies
    res.cookie( "accessToken", tokens.accessToken, cookieConfig.accessToken );
    res.cookie( "refreshToken", tokens.refreshToken, cookieConfig.refreshToken);

    console.log(res.getHeaders());

    ApiResponse.success(res, null, httpStatus.OK, 'Logged in successfully');
};

const refresh = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Refresh token missing",
        );
    }
    const tokens = authService.refresh(refreshToken);
    res.cookie( "accessToken", tokens.accessToken, cookieConfig.accessToken );
    ApiResponse.success( res, null, httpStatus.OK, "Token refreshed" );
};


export default { 
    register, 
    login, 
    refresh 
};