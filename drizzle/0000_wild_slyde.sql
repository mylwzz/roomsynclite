CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'prefer_not_to_say');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('looking', 'offering', 'browsing');--> statement-breakpoint
CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"liker_id" uuid NOT NULL,
	"liked_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"gender" "gender" NOT NULL,
	"looking_for" "gender" NOT NULL,
	"role" "role" NOT NULL,
	"interests" text,
	"cleanliness_level" integer NOT NULL,
	"noise_tolerance" integer NOT NULL,
	"sleep_time" text NOT NULL,
	"wake_time" text NOT NULL,
	"has_pets" boolean NOT NULL,
	"bio" text,
	"profile_picture" text,
	"location" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
