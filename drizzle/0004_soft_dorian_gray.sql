CREATE TABLE "passes" (
	"id" serial PRIMARY KEY NOT NULL,
	"passer_id" text NOT NULL,
	"passed_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "passes" ADD CONSTRAINT "passes_passer_id_users_id_fk" FOREIGN KEY ("passer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passes" ADD CONSTRAINT "passes_passed_id_users_id_fk" FOREIGN KEY ("passed_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;