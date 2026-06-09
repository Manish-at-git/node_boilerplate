import { buildQuery, queryOne } from "@/db/database";

import * as queries from "./auth.queries";
import { CreateRefreshTokenDto, IUser } from "./auth.types";

export const findByEmail = async (email: string): Promise<IUser | null> => {
    const { text, values } = buildQuery(queries.FIND_BY_EMAIL, {
        email,
    });

    return queryOne<IUser>(text, values);
};

export const findById = async (id: number): Promise<IUser | null> => {
    const { text, values } = buildQuery(queries.FIND_BY_ID, {
        id,
    });

    return queryOne<IUser>(text, values);
};

export const createUser = async (
    name: string,
    email: string,
    password: string,
): Promise<IUser> => {
    const queryData = buildQuery(queries.CREATE_USER, {
        name,
        email,
        password,
    });

    const user = await queryOne<IUser>(queryData.text, queryData.values);

    if (!user) {
        throw new Error("Failed to create user");
    }

    return user;
};


export const createRefreshToken = async (data: CreateRefreshTokenDto) => {
    const { text, values } = buildQuery(queries.CREATE_REFRESH_TOKENS, {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
    });

    const refreshToken = await queryOne<IUser>(text, values);

    if (!refreshToken) {
        throw new Error("Failed to create token");
    }

    return refreshToken;
};

export const findRefreshTokenByHash = async ( tokenHash: string ) => {
    const { text, values } = buildQuery( queries.FIND_REFRESH_TOKEN_BY_HASH, { tokenHash });
    const result = await queryOne<IUser>(text, values);
    return result || null;
};

export const revokeRefreshToken = async ( tokenHash: string ): Promise<void> => {
    const { text, values } = buildQuery( queries.REVOKE_REFRESH_TOKEN, { tokenHash } );

    await queryOne(text, values);
};