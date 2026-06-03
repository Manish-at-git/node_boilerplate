export const FIND_BY_EMAIL = `SELECT id, email, password FROM users WHERE email = :email LIMIT 1`;

export const FIND_BY_ID = `SELECT id, email FROM users WHERE id = :id LIMIT 1`;

export const CREATE_USER = `INSERT INTO users ( name, email, password ) VALUES ( :name, :email, :password ) RETURNING id, email`