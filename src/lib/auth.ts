// src/lib/auth.ts  
import {
  pgTable, pgEnum, serial, text, integer, boolean, timestamp,
} from "drizzle-orm/pg-core";
import { drizzle }        from "drizzle-orm/postgres-js";
import postgres           from "postgres";

import { betterAuth }     from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { cookies }        from "next/headers";
import { eq }             from "drizzle-orm";


   export const roleEnum   = pgEnum("role",   ["looking", "offering", "browsing", "admin"]);
   export const genderEnum = pgEnum("gender", ["male", "female", "prefer_not_to_say"]);

/* — auth tables — */
export const users = pgTable("users", {
  id:            text("id").primaryKey(), // NanoID
  name:          text("name").notNull(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image:         text("image"),
  createdAt:     timestamp("created_at").defaultNow(),
  updatedAt:     timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id:        text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token:     text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId:    text("user_id").notNull()
                           .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id:         text("id").primaryKey(),
  accountId:  text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId:     text("user_id").notNull()
                           .references(() => users.id, { onDelete: "cascade" }),
  accessToken:           text("access_token"),
  refreshToken:          text("refresh_token"),
  idToken:               text("id_token"),
  accessTokenExpiresAt:  timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope:                 text("scope"),
  password:              text("password"),
  createdAt:             timestamp("created_at").defaultNow(),
  updatedAt:             timestamp("updated_at").defaultNow(),
});

export const verifications = pgTable("verifications", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").defaultNow(),
  updatedAt:  timestamp("updated_at").defaultNow(),
});

/* — app tables — */
export const profiles = pgTable("profiles", {
  id:               serial("id").primaryKey(),
  userId:           text("user_id").notNull()
                                 .references(() => users.id, { onDelete: "cascade" }),
  name:             text("name").notNull(),
  age:              integer("age").notNull(),
  gender:           genderEnum("gender").notNull(),
  lookingFor:       genderEnum("looking_for").notNull(),
  role:             roleEnum("role").notNull(),
  interests:        text("interests"),
  cleanlinessLevel: integer("cleanliness_level").notNull(),
  noiseTolerance:   integer("noise_tolerance").notNull(),
  sleepTime:        text("sleep_time").notNull(),
  wakeTime:         text("wake_time").notNull(),
  hasPets:          boolean("has_pets").notNull(),
  bio:              text("bio"),
  profilePicture:   text("profile_picture"),
  location:         text("location"),
  createdAt:        timestamp("created_at").defaultNow(),
  updatedAt:        timestamp("updated_at").defaultNow(),
});

export const likes = pgTable("likes", {
  id:       serial("id").primaryKey(),
  likerId:  text("liker_id").notNull()
                            .references(() => users.id, { onDelete: "cascade" }),
  likedId:  text("liked_id").notNull()
                            .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ──────────────────────────────────────────────────────────
   2.  Drizzle DB instance
   ────────────────────────────────────────────────────────── */
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client, {
  schema: {
    users, sessions, accounts, verifications,
    profiles, likes,
  },
});

/* ──────────────────────────────────────────────────────────
   3.  Better-Auth instance  (NOTE the singular keys!)
   ────────────────────────────────────────────────────────── */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user:         users,
      session:      sessions,
      account:      accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

/* ──────────────────────────────────────────────────────────
   4.  Helper → session + profile
   ────────────────────────────────────────────────────────── */
   export async function getSessionWithProfile() {
    // Next.js 15 => cookies() must be awaited
    const store = await cookies();
    const raw   = store.toString();
    const hdrs  = new Headers([["cookie", raw]]);
  
    const session = await auth.api.getSession({ headers: hdrs });
    if (!session?.user?.id) return { session: null, profile: null };
  
    const profile = await db.query.profiles.findFirst({
      where: (p) => eq(p.userId, session.user.id),
    });
  
    return { session, profile };
  }