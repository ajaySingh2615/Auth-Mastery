CREATE TYPE "public"."authProvider" AS ENUM('local', 'google', 'Phone');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now
        ();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now
        ();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "auth_provider" "authProvider" DEFAULT 'local' NOT NULL;