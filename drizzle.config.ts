// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: [
    "./src/lib/db/schema.ts",  // →  profiles + likes (your app tables)
    "./auth-schema.ts",        // →  users, sessions, accounts, verifications
  ],

  out:      "./drizzle",      
  dialect:  "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! }
});
