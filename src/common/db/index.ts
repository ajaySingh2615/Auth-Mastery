import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@common/config/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
});

export const db = drizzle(pool);

export const connectDB = async (): Promise<void> => {
  let client;

  try {
    client = await pool.connect();
    console.log(`Database connected successfully`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
};
