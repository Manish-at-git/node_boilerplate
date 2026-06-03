import { Pool, QueryResult, QueryResultRow, PoolClient } from "pg";
import pool from "@/db";
import { logger } from "@/config";

type DbClient = Pool | PoolClient;
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
    dbPool: DbClient = pool,
): Promise<T[]> => {
    // const start = Date.now();

    try {
        const result = await dbPool.query<T>(sql, params);

        // const duration = Date.now() - start;
        // console.log(`Query executed in ${duration}ms`);

        return result.rows;
    } catch (error) {
        logger.error({ err: error, sql, params }, "Database query failed" );
        throw error;
    }
};

export const queryOne = async <T extends QueryResultRow>(
    sql: string,
    params: unknown[] = [],
    dbPool: DbClient = pool,
): Promise<T | null> => {
    const rows = await query<T>(sql, params, dbPool);

    return rows[0] ?? null;
};

export const execute = async <T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
    dbPool: DbClient = pool,
): Promise<QueryResult<T>> => dbPool.query<T>(sql, params);

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
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error("Rollback failed", rollbackError);
        }

        throw error;
    } finally {
        client.release();
    }
};

export const endPool = async (): Promise<void> => {
    await pool.end();
};
