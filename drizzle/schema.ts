import { pgTable, serial, uuid, timestamp, text, integer, boolean, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const gender = pgEnum("gender", ['male', 'female', 'prefer_not_to_say'])
export const role = pgEnum("role", ['looking', 'offering', 'browsing'])


export const likes = pgTable("likes", {
	id: serial().primaryKey().notNull(),
	likerId: uuid("liker_id").notNull(),
	likedId: uuid("liked_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const profiles = pgTable("profiles", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: text().notNull(),
	age: integer().notNull(),
	gender: gender().notNull(),
	lookingFor: gender("looking_for").notNull(),
	role: role().notNull(),
	interests: text(),
	cleanlinessLevel: integer("cleanliness_level").notNull(),
	noiseTolerance: integer("noise_tolerance").notNull(),
	sleepTime: text("sleep_time").notNull(),
	wakeTime: text("wake_time").notNull(),
	hasPets: boolean("has_pets").notNull(),
	bio: text(),
	profilePicture: text("profile_picture"),
	location: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});
