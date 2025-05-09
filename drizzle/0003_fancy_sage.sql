ALTER TYPE "public"."role" ADD VALUE 'admin';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'browsing' NOT NULL;