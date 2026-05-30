import type { Request, Response } from 'express';

import ApiResponse from '@/utils/ApiResponse';
import httpStatus from '@/constants/httpStatus';
import type { IRegisterBody, ILoginBody } from './auth.types';
import authService from './auth.service';

const register = async (req: Request, res: Response): Promise<void> => {
  const tokens = await authService.register(req.body as IRegisterBody);
  ApiResponse.success(res, tokens, httpStatus.CREATED, 'Registered successfully');
};

const login = async (req: Request, res: Response): Promise<void> => {
  const tokens = await authService.login(req.body as ILoginBody);
  ApiResponse.success(res, tokens, httpStatus.OK, 'Logged in successfully');
};

export default { register, login };