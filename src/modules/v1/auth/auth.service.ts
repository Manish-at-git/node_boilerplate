import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '@/config';
import ApiError from '@/utils/ApiError';
import httpStatus from '@/constants/httpStatus';

import * as authRepository from './auth.repository';

import type {
  IAuthTokens,
  IRegisterBody,
  ILoginBody,
  ITokenPayload,
} from './auth.types';

const generateTokens = (
  payload: ITokenPayload,
): IAuthTokens => {
  const accessToken = jwt.sign(
    payload,
    env.JWT_SECRET,
    { expiresIn: '30m' },
  );

  const refreshToken = jwt.sign(
    payload,
    env.JWT_SECRET,
    { expiresIn: '30d' },
  );

  return {
    accessToken,
    refreshToken,
  };
};

const register = async (
  body: IRegisterBody,
): Promise<IAuthTokens> => {
  const existingUser =
    await authRepository.findByEmail(
      body.email,
    );

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Email already in use',
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      body.password,
      10,
    );

  const user =
    await authRepository.createUser(
      body.name,
      body.email,
      hashedPassword,
    );

  return generateTokens({
    id: user.id,
    email: user.email,
  });
};

const login = async (
  body: ILoginBody,
): Promise<IAuthTokens> => {
  const user =
    await authRepository.findByEmail(
      body.email,
    );

  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Invalid credentials',
    );
  }

  const isMatch =
    await bcrypt.compare(
      body.password,
      user.password,
    );

  if (!isMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Invalid credentials',
    );
  }

  return generateTokens({
    id: user.id,
    email: user.email,
  });
};

export default {
  register,
  login,
};