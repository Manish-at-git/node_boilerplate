import { buildQuery, queryOne } from '@/db/database';

import * as queries from './auth.queries';
import { IUser } from './auth.types';

export const findByEmail = async (
  email: string,
): Promise<IUser | null> => {
  const { text, values } = buildQuery(
    queries.FIND_BY_EMAIL,
    {
      email,
    },
  );

  return queryOne<IUser>(
    text,
    values,
  );
};

export const findById = async (
  id: number,
): Promise<IUser | null> => {
  const { text, values } = buildQuery(
    queries.FIND_BY_ID,
    {
      id,
    },
  );

  return queryOne<IUser>(
    text,
    values,
  );
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
): Promise<IUser> => {
  const queryData = buildQuery(
    queries.CREATE_USER,
    {
      name,
      email,
      password,
    },
  );

  const user = await queryOne<IUser>(
    queryData.text,
    queryData.values,
  );

  if (!user) {
    throw new Error('Failed to create user');
  }

  return user;
};