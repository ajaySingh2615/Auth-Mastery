import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  // Where is your schema? — Drizzle reads this to generate migrations
  schema: "./src/common/db/schema/index.ts",

  // Where should generated migration SQL files go?
  // Each migration = one .sql file with the changes
  out: "./drizzle",

  // Which database are we using?
  dialect: "postgresql",

  // How to connect — uses DATABASE_URL from .env
  // Note: we use process.env directly here, not our env.ts
  // Because drizzle.config.ts runs outside of our app (via drizzle-kit CLI)
  // our Zod validation in env.ts won't run here
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // The '!' is TypeScript's "non-null assertion"
    // It means: "I know this might be undefined, but trust me it's not"
    // We use it here because we know DATABASE_URL is in .env
    // It's okay to use '!' sparingly — but never overuse it
    // overusing '!' defeats the purpose of TypeScript
  },

  // Log every SQL query Drizzle generates — useful for learning and debugging
  verbose: true,

  // Strict mode — Drizzle will ask for confirmation before dangerous operations
  // like dropping a table or deleting a column
  strict: true,
});
