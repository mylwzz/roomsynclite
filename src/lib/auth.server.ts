// src/lib/auth.ts  
import {
  pgTable, pgEnum, serial, text, integer, boolean, timestamp,
} from "drizzle-orm/pg-core";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "./db.server";
import {
  users, sessions, accounts, verifications,
} from "./db/schema";

// ─── ENUMS ───────────────────────────────────────────────────────────
export const roleEnum   = pgEnum("role",   ["looking","offering","browsing","admin"]);
export const genderEnum = pgEnum("gender", ["male","female","prefer_not_to_say"]);

// ─── AUTH TABLES ─────────────────────────────────────────────────────
export const usersTable = pgTable("users", {
  id:            text("id").primaryKey(),
  name:          text("name").notNull(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image:         text("image"),
  role:          roleEnum("role").notNull().default("browsing"),
  createdAt:     timestamp("created_at").defaultNow(),
  updatedAt:     timestamp("updated_at").defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
  id:        text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token:     text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId:    text("user_id").notNull()
                           .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id:                   text("id").primaryKey(),
  accountId:            text("account_id").notNull(),
  providerId:           text("provider_id").notNull(),
  userId:               text("user_id").notNull()
                                   .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken:          text("access_token"),
  refreshToken:         text("refresh_token"),
  idToken:              text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope:                text("scope"),
  password:             text("password"),
  createdAt:            timestamp("created_at").defaultNow(),
  updatedAt:            timestamp("updated_at").defaultNow(),
});

export const verificationsTable = pgTable("verifications", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").defaultNow(),
  updatedAt:  timestamp("updated_at").defaultNow(),
});

// ─── APP PROFILES & REACTIONS ────────────────────────────────────────
export const profilesTable = pgTable("profiles", {
  id:               serial("id").primaryKey(),
  userId:           text("user_id").notNull()
                                 .references(() => usersTable.id, { onDelete: "cascade" }),
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

export const likesTable = pgTable("likes", {
  id:        serial("id").primaryKey(),
  likerId:   text("liker_id").notNull()
               .references(() => usersTable.id, { onDelete: "cascade" }),
  likedId:   text("liked_id").notNull()
               .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const passesTable = pgTable("passes", {
  id:         serial("id").primaryKey(),
  passerId:   text("passer_id").notNull()
                .references(() => usersTable.id, { onDelete: "cascade" }),
  passedId:   text("passed_id").notNull()
                .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt:  timestamp("created_at").defaultNow(),
});

// ─── DB & AUTH INSTANCES ─────────────────────────────────────────────
export const dbSchema = { usersTable, sessionsTable, accountsTable, verificationsTable, profilesTable, likesTable, passesTable };

type Session = {
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  } | null;
};

type User = {
  id: string;
  role: string;
};

type SessionResult = {
  session: Session | null;
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }) => ({
      ...session,
      user: { ...session.user, role: user.role },
    }),
  },
});

// ─── HELPERS ─────────────────────────────────────────────────────────
export async function getSessionWithProfile() {
  const store = await cookies();
  const raw = store.toString();
  const headers = new Headers([["cookie", raw]]);

  const result = await auth.api.getSession({ headers }) as SessionResult;
  const session = result?.session;
  if (!session?.user?.id) return { session: null, profile: null };

  const profile = await db.query.profiles.findFirst({
    where: (p) => eq(p.userId, session.user!.id),
  });
  return { session, profile };
}