
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- drop schema "quizzes" cascade;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE TABLE "quizzes" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text NOT NULL, PRIMARY KEY ("id") );
--
-- CREATE TABLE "questions" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "text" text NOT NULL, "quiz_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON UPDATE cascade ON DELETE cascade);
--
-- CREATE TABLE "answers" ("id" serial NOT NULL, "text" text NOT NULL, "is_correct" boolean NOT NULL, "question_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON UPDATE cascade ON DELETE cascade);
--
-- CREATE TABLE "poap_urls" ("id" serial NOT NULL, "url" text NOT NULL, "used" boolean NOT NULL DEFAULT false, "quiz_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON UPDATE cascade ON DELETE cascade);
--
-- alter table "poap_urls" add constraint "poap_urls_quiz_id_url_key" unique ("quiz_id", "url");
--
-- alter table "questions" drop column "created_at" cascade;
