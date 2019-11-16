-- Create the tables for the db schema
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "first_name" varchar,
  "last_name" varchar,
  "photo_url" varchar,
  "email" varchar,
  "phone" varchar,
  "google_account_id" varchar NOT NULL,
  "stripe_customer_id" varchar NOT NULL,
  "data" jsonb
);

CREATE TABLE IF NOT EXISTS "user_roles" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "role_id" int NOT NULL,
  "user_id" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "user_id" int NOT NULL,
  "stripe_subscription_id" varchar NOT NULL,
  "stripe_plan_id" varchar NOT NULL,
  "subscription_start" TIMESTAMPTZ NOT NULL,
  "subscription_expiration" TIMESTAMPTZ NOT NULL,
  "data" jsonb
);

CREATE TABLE IF NOT EXISTS "roles" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "role_type" varchar
);

CREATE TABLE IF NOT EXISTS "workspaces" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "name" varchar NOT NULL,
  "icon_url" varchar,
  "admin_id" int NOT NULL,
  "data" jsonb
);

CREATE TABLE IF NOT EXISTS "workspace_users" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "workspace_id" int NOT NULL,
  "user_id" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "teams" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "name" varchar NOT NULL,
  "workspace_id" int NOT NULL,
  "admin_id" int NOT NULL,
  "data" jsonb
);

CREATE TABLE IF NOT EXISTS "team_users" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "team_id" int NOT NULL,
  "user_id" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "retros" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "team_id" int NOT NULL,
  "name" varchar NOT NULL,
  "data" jsonb 
);

CREATE TABLE IF NOT EXISTS "retro_items" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "retro_id" int NOT NULL,
  "description" text NOT NULL,
  "status" int NOT NULL,
  "data" jsonb
);

CREATE TABLE IF NOT EXISTS "retro_item_votes" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "retro_item_id" int NOT NULL,
  "decision" int NOT NULL
);

-- Add external foreign keys to each table
ALTER TABLE "user_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");
ALTER TABLE "user_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "subscriptions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "workspaces" ADD FOREIGN KEY ("admin_id") REFERENCES "users" ("id");
ALTER TABLE "workspace_users" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id");
ALTER TABLE "workspace_users" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "teams" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id");
ALTER TABLE "teams" ADD FOREIGN KEY ("admin_id") REFERENCES "users" ("id");
ALTER TABLE "team_users" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
ALTER TABLE "team_users" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "retros" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
ALTER TABLE "retro_items" ADD FOREIGN KEY ("retro_id") REFERENCES "retros" ("id");
ALTER TABLE "retro_item_votes" ADD FOREIGN KEY ("retro_item_id") REFERENCES "retro_items" ("id");