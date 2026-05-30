import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '@/config';
import pool from '@/db';
import ApiError from '@/utils/ApiError';
import httpStatus from '@/constants/httpStatus';
import type { IAuthTokens, IRegisterBody, ILoginBody, ITokenPayload, IUser } from './auth.types';

const generateTokens = (payload: ITokenPayload): IAuthTokens => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '30m' });
  const refreshToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

const register = async (body: IRegisterBody): Promise<IAuthTokens> => {
  const existing = await pool.query<IUser>('SELECT id FROM users WHERE email = $1', [body.email]);
  if (existing.rowCount && existing.rowCount > 0) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already in use');
  }

  const hashed = await bcrypt.hash(body.password, 10);
  const result = await pool.query<IUser>(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email',
    [body.name, body.email, hashed],
  );

  const user = result.rows[0];
  return generateTokens({ id: user.id, email: user.email });
};

const login = async (body: ILoginBody): Promise<IAuthTokens> => {
  const result = await pool.query<IUser>('SELECT * FROM users WHERE email = $1', [body.email]);
  const user = result.rows[0];

  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');

  const isMatch = await bcrypt.compare(body.password, user.password);
  if (!isMatch) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');

  return generateTokens({ id: user.id, email: user.email });
};

export default { register, login };