import pg, {
  type PoolClient,
  type QueryResult,
  type QueryResultRow,
} from "pg";
import { config } from "./index.js";

const { Pool } = pg;

if (!config.databaseUrl) {
  throw new Error(
    "DATABASE_URL chưa được cấu hình. Hãy cập nhật backend/.env trước khi chạy.",
  );
}

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (error) => {
  console.error("PostgreSQL pool error:", error);
});

export function query<Row extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<QueryResult<Row>> {
  return pool.query<Row>(text, values);
}

export async function withTransaction<T>(
  operation: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function checkDatabaseConnection(): Promise<void> {
  await query("SELECT 1");
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
}
