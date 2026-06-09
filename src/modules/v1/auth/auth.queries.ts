export const FIND_BY_EMAIL = `SELECT id, email, password, role FROM users WHERE email = :email LIMIT 1`;

export const FIND_BY_ID = `SELECT id, email FROM users WHERE id = :id LIMIT 1`;

export const CREATE_USER = `INSERT INTO users ( name, email, password ) VALUES ( :name, :email, :password ) RETURNING id, email`

export const CREATE_REFRESH_TOKENS = `INSERT INTO refresh_tokens ( user_id, token_hash, expires_at ) VALUES ( :userId, :tokenHash, :expiresAt ) RETURNING *`

export const FIND_REFRESH_TOKEN_BY_HASH = `SELECT * FROM refresh_tokens WHERE token_hash = :tokenHash`

export const REVOKE_REFRESH_TOKEN = ` UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = :tokenHash`;