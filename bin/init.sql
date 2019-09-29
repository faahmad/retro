-- Create the tables for the db schema
CREATE TABLE IF NOT EXISTS "user" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "first_name" varchar,
  "last_name" varchar,
  "avatar_url" varchar,
  "email" varchar,
  "phone" varchar,
  "google_account_id" varchar NOT NULL,
  "stripe_customer_id" varchar NOT NULL,
  "data" jsonb
);

CREATE TABLE IF NOT EXISTS "user_role" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "role_id" int NOT NULL,
  "user_id" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "subscription" (
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

CREATE TABLE IF NOT EXISTS "role" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "role_type" varchar
);

CREATE TABLE IF NOT EXISTS "workspace" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "name" varchar NOT NULL,
  "icon_url" varchar,
  "admin_id" int NOT NULL,
  "data" jsonb
);

CREATE TABLE IF NOT EXISTS "workspace_user" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "workspace_id" int NOT NULL,
  "user_id" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "team" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "name" varchar NOT NULL,
  "workspace_id" int NOT NULL,
  "admin_id" int NOT NULL,
  "data" jsonb
);

CREATE TABLE IF NOT EXISTS "team_user" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "team_id" int NOT NULL,
  "user_id" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "retro" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "team_id" int NOT NULL,
  "name" varchar NOT NULL,
  "data" jsonb 
);

CREATE TABLE IF NOT EXISTS "retro_item" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "retro_id" int NOT NULL,
  "description" text NOT NULL,
  "status" int NOT NULL,
  "data" jsonb
);

CREATE TABLE IF NOT EXISTS "retro_item_vote" (
  "id" serial PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT Now(),
  "updated_at" TIMESTAMPTZ,
  "retro_item_id" int NOT NULL,
  "decision" int NOT NULL
);

-- Add external references to each table

ALTER TABLE "user_role" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");
ALTER TABLE "user_role" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "subscription" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "workspace" ADD FOREIGN KEY ("admin_id") REFERENCES "user" ("id");
ALTER TABLE "workspace_user" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspace" ("id");
ALTER TABLE "workspace_user" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "team" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspace" ("id");
ALTER TABLE "team" ADD FOREIGN KEY ("admin_id") REFERENCES "user" ("id");
ALTER TABLE "team_user" ADD FOREIGN KEY ("team_id") REFERENCES "team" ("id");
ALTER TABLE "team_user" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "retro" ADD FOREIGN KEY ("team_id") REFERENCES "team" ("id");
ALTER TABLE "retro_item" ADD FOREIGN KEY ("retro_id") REFERENCES "retro" ("id");
ALTER TABLE "retro_item_vote" ADD FOREIGN KEY ("retro_item_id") REFERENCES "retro_item" ("id");

-- Insert Sample Roles
INSERT INTO public.role (id, created_at, updated_at, role_type) VALUES (1, '2019-09-29 10:48:45.888348-07', NULL, 'ADMIN');
INSERT INTO public.role (id, created_at, updated_at, role_type) VALUES (2, '2019-09-29 10:48:45.888348-07', NULL, 'VIEWER');

-- Insert Sample Users
INSERT INTO public."user" (id, created_at, updated_at, first_name, last_name, avatar_url, email, phone, google_account_id, stripe_customer_id) VALUES (1, '2019-09-28 15:41:52.994985-07', NULL, 'Jane', 'Doe', 'https://images.pexels.com/photos/594421/pexels-photo-594421.jpeg?h=350&auto=compress&cs=tinysrgb', 'jane@tmail.com', '13104567891', '1234', '1234');
INSERT INTO public."user" (id, created_at, updated_at, first_name, last_name, avatar_url, email, phone, google_account_id, stripe_customer_id) VALUES (2, '2019-09-28 15:42:40.035345-07', NULL, 'Kristin', 'Smith', 'https://images.pexels.com/photos/61100/pexels-photo-61100.jpeg?h=350&auto=compress&cs=tinysrgb', 'kristin@tmail.com', '13104567892', '1235', '1235');
INSERT INTO public."user" (id, created_at, updated_at, first_name, last_name, avatar_url, email, phone, google_account_id, stripe_customer_id) VALUES (3, '2019-09-28 15:43:47.068368-07', NULL, 'James', 'Fruitpie', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?h=350&auto=compress&cs=tinysrgb', 'jame@tmail.com', '13104567893', '1236', '1236');
INSERT INTO public."user" (id, created_at, updated_at, first_name, last_name, avatar_url, email, phone, google_account_id, stripe_customer_id) VALUES (4, '2019-09-28 15:47:53.833312-07', NULL, 'Jeffery', 'Smitabaker', 'https://i.imgur.com/rSV6yqu.jpg', 'jeffery@tmail.com', '13104567894', '1237', '1237');

-- Insert Sample User to Role Mappings
INSERT INTO public.user_role (id, created_at, updated_at, role_id, user_id) VALUES (1, '2019-09-29 10:49:30.977546-07', NULL, 1, 1);
INSERT INTO public.user_role (id, created_at, updated_at, role_id, user_id) VALUES (2, '2019-09-29 10:49:30.977546-07', NULL, 1, 2);
INSERT INTO public.user_role (id, created_at, updated_at, role_id, user_id) VALUES (3, '2019-09-29 10:49:30.977546-07', NULL, 2, 3);
INSERT INTO public.user_role (id, created_at, updated_at, role_id, user_id) VALUES (4, '2019-09-29 10:49:30.977546-07', NULL, 2, 4);

-- Insert Sample User's Subscription
INSERT INTO public.subscription (id, created_at, updated_at, user_id, stripe_subscription_id, stripe_plan_id, subscription_start, subscription_expiration) VALUES (1, '2019-09-29 10:54:18.159391-07', NULL, 1, '12345', '123', '2019-09-29 00:00:00-07', '2019-10-29 00:00:00-07');
INSERT INTO public.subscription (id, created_at, updated_at, user_id, stripe_subscription_id, stripe_plan_id, subscription_start, subscription_expiration) VALUES (2, '2019-09-29 10:54:18.159391-07', NULL, 2, '12346', '124', '2019-09-29 00:00:00-07', '2019-10-29 00:00:00-07');

-- Insert Sample Workspaces
INSERT INTO public.workspace (id, created_at, updated_at, name, icon_url, admin_id) VALUES (3, '2019-09-29 10:47:51.395433-07', NULL, 'Awesome Company', 'https://i.imgur.com/kJCWUAo.jpg', 2);
INSERT INTO public.workspace (id, created_at, updated_at, name, icon_url, admin_id) VALUES (2, '2019-09-29 10:47:51.395433-07', NULL, 'Great Company', 'https://images.pexels.com/photos/594421/pexels-photo-594421.jpeg?h=350&auto=compress&cs=tinysrgb', 1);

-- Insert Sample Workspace to User Mappings
INSERT INTO public.workspace_user (id, created_at, updated_at, workspace_id, user_id) VALUES (2, '2019-09-29 10:48:15.072831-07', NULL, 2, 1);
INSERT INTO public.workspace_user (id, created_at, updated_at, workspace_id, user_id) VALUES (3, '2019-09-29 10:48:15.072831-07', NULL, 3, 2);
INSERT INTO public.workspace_user (id, created_at, updated_at, workspace_id, user_id) VALUES (4, '2019-09-29 10:48:15.072831-07', NULL, 2, 3);
INSERT INTO public.workspace_user (id, created_at, updated_at, workspace_id, user_id) VALUES (5, '2019-09-29 10:48:15.072831-07', NULL, 3, 4);

-- Insert Sample Teams
INSERT INTO public.team (id, created_at, updated_at, name, workspace_id, admin_id) VALUES (1, '2019-09-29 10:51:32.766989-07', NULL, 'product', 2, 1);
INSERT INTO public.team (id, created_at, updated_at, name, workspace_id, admin_id) VALUES (2, '2019-09-29 10:51:32.766989-07', NULL, 'engineering 1', 2, 1);
INSERT INTO public.team (id, created_at, updated_at, name, workspace_id, admin_id) VALUES (3, '2019-09-29 10:51:32.766989-07', NULL, 'engineering 2', 2, 3);
INSERT INTO public.team (id, created_at, updated_at, name, workspace_id, admin_id) VALUES (4, '2019-09-29 10:51:32.766989-07', NULL, 'product', 3, 2);
INSERT INTO public.team (id, created_at, updated_at, name, workspace_id, admin_id) VALUES (5, '2019-09-29 10:51:32.766989-07', NULL, ' awesome engineers 1', 3, 2);
INSERT INTO public.team (id, created_at, updated_at, name, workspace_id, admin_id) VALUES (6, '2019-09-29 10:51:32.766989-07', NULL, 'awesome engineers 2', 3, 2);

-- Insert Sample Team to User Mappings
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (1, '2019-09-29 10:56:35.193806-07', NULL, 1, 1);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (2, '2019-09-29 10:56:35.193806-07', NULL, 2, 1);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (3, '2019-09-29 10:56:35.193806-07', NULL, 3, 1);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (4, '2019-09-29 10:56:35.193806-07', NULL, 1, 3);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (5, '2019-09-29 10:56:35.193806-07', NULL, 2, 3);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (6, '2019-09-29 10:56:35.193806-07', NULL, 3, 3);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (7, '2019-09-29 10:56:35.193806-07', NULL, 4, 2);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (8, '2019-09-29 10:56:35.193806-07', NULL, 5, 2);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (9, '2019-09-29 10:56:35.193806-07', NULL, 6, 2);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (10, '2019-09-29 10:56:35.193806-07', NULL, 4, 4);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (11, '2019-09-29 10:56:35.193806-07', NULL, 5, 4);
INSERT INTO public.team_user (id, created_at, updated_at, team_id, user_id) VALUES (12, '2019-09-29 10:56:35.193806-07', NULL, 6, 4);

-- Insert Sample Retros
INSERT INTO public.retro (id, created_at, updated_at, team_id, name) VALUES (1, '2019-09-29 10:58:27.40515-07', NULL, 1, 'Product 1');
INSERT INTO public.retro (id, created_at, updated_at, team_id, name) VALUES (2, '2019-09-29 10:58:27.40515-07', NULL, 2, 'Engineering 1');
INSERT INTO public.retro (id, created_at, updated_at, team_id, name) VALUES (3, '2019-09-29 10:58:27.40515-07', NULL, 3, 'Engineering 2');
INSERT INTO public.retro (id, created_at, updated_at, team_id, name) VALUES (4, '2019-09-29 10:59:21.908448-07', NULL, 4, 'Other Product 1');
INSERT INTO public.retro (id, created_at, updated_at, team_id, name) VALUES (5, '2019-09-29 10:59:21.908448-07', NULL, 5, 'Other Engineering 2');
INSERT INTO public.retro (id, created_at, updated_at, team_id, name) VALUES (6, '2019-09-29 10:59:21.908448-07', NULL, 6, 'Other Engineering 3');

-- Insert Sample Retro Items
-- Status: 1 - Good | 2 - Bad | 3 - To-do | 4 - Question
INSERT INTO public.retro_item (id, created_at, updated_at, retro_id, description, status) VALUES (1, '2019-09-29 11:03:45.618375-07', NULL, 1, 'We did not clean up our tech debt', 2);
INSERT INTO public.retro_item (id, created_at, updated_at, retro_id, description, status) VALUES (2, '2019-09-29 11:03:45.618375-07', NULL, 1, 'We shipped that big ass feature', 1);
INSERT INTO public.retro_item (id, created_at, updated_at, retro_id, description, status) VALUES (3, '2019-09-29 11:03:45.618375-07', NULL, 1, 'Add new engineers to GIT', 3);
INSERT INTO public.retro_item (id, created_at, updated_at, retro_id, description, status) VALUES (4, '2019-09-29 11:03:45.618375-07', NULL, 1, 'Who is responsible for deployment', 4);
INSERT INTO public.retro_item (id, created_at, updated_at, retro_id, description, status) VALUES (5, '2019-09-29 11:05:29.241714-07', NULL, 4, 'We launched our Kubernetes cluster', 1);
INSERT INTO public.retro_item (id, created_at, updated_at, retro_id, description, status) VALUES (6, '2019-09-29 11:05:29.241714-07', NULL, 4, 'Executives are mad about our velocity', 2);
INSERT INTO public.retro_item (id, created_at, updated_at, retro_id, description, status) VALUES (7, '2019-09-29 11:05:29.241714-07', NULL, 4, 'Add our computers to asset management', 3);
INSERT INTO public.retro_item (id, created_at, updated_at, retro_id, description, status) VALUES (8, '2019-09-29 11:05:29.241714-07', NULL, 4, 'Who owns that feature?', 4);

-- Insert Sample Retro Item's Votes
-- Decision: 1 - Up | 2 - Down 
INSERT INTO public.retro_item_vote (id, created_at, updated_at, retro_item_id, decision) VALUES (1, '2019-09-29 11:06:41.888423-07', NULL, 1, 1);
INSERT INTO public.retro_item_vote (id, created_at, updated_at, retro_item_id, decision) VALUES (2, '2019-09-29 11:06:41.888423-07', NULL, 5, 1);
