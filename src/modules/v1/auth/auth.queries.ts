export const FIND_BY_EMAIL = `
  SELECT
    id,
    email,
    password,
    role
  FROM users
  WHERE email = $1
  LIMIT 1
`;

export const FIND_BY_ID = `
  SELECT
    id,
    email,
    role
  FROM users
  WHERE id = $1
  LIMIT 1
`;

export const CREATE_USER = `
    INSERT INTO users (
      name,
      email,
      password
    )
    VALUES (
      $1,
      $2,
      $3
    )
    RETURNING
      id,
      email`