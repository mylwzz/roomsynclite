// src/lib/db/index.ts 
import { drizzle } from "drizzle-orm/postgres-js";
import postgres    from "postgres";
import * as schema from "./schema";

export const client = postgres(process.env.DATABASE_URL!, { prepare:false });
export const db = drizzle(client, { schema });

export { schema };
export const {
  users,
  profiles,
  likes,          
  passes,         
} = schema;