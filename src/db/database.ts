import { QueryResult, QueryResultRow, PoolClient } from "pg";

import pool from "@/db";

export interface QueryData {
    text: string;
    values: unknown[];
}

export const buildQuery = (
    sql: string,
    params: Record<string, unknown> = {},
): QueryData => {
    const values: unknown[] = [];

    const text = sql.replace(
        /:([a-zA-Z0-9_]+)/g,
        (_match: string, key: string) => {
            if (!(key in params)) {
                throw new Error(`Missing query parameter: ${key}`);
            }

            values.push(params[key]);

            return `$${values.length}`;
        },
    );

    return { text, values };
};

export const query = async <T extends QueryResultRow>(
    sql: string,
    params: unknown[] = [],
): Promise<T[]> => {
    const start = Date.now();

    try {
        const result = await pool.query<T>(sql, params);

        const duration = Date.now() - start;

        console.log(`Query executed in ${duration}ms`);

        return result.rows;
    } catch (error) {
        console.error("Database Error");
        console.error(sql);
        console.error(params);

        throw error;
    }
};

export const queryOne = async <T extends QueryResultRow>(
    sql: string,
    params: unknown[] = [],
): Promise<T | null> => {
    const rows = await query<T>(sql, params);

    return rows[0] ?? null;
};

export const execute = async (
    sql: string,
    params: unknown[] = [],
): Promise<QueryResult> => pool.query(sql, params);

export const transaction = async <T>(
    callback: (client: PoolClient) => Promise<T>,
): Promise<T> => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await callback(client);

        await client.query("COMMIT");

        return result;
    } catch (error) {
        await client.query("ROLLBACK");

        throw error;
    } finally {
        client.release();
    }
};

export const endPool = async (): Promise<void> => {
    await pool.end();
};
