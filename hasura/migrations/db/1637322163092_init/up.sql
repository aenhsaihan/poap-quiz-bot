
create schema "quizzes";

CREATE TABLE "quizzes"."quizzes" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text NOT NULL, PRIMARY KEY ("id") );

CREATE TABLE "quizzes"."questions" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "text" text NOT NULL, "quiz_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("quiz_id") REFERENCES "quizzes"."quizzes"("id") ON UPDATE cascade ON DELETE cascade);

CREATE TABLE "quizzes"."answers" ("id" serial NOT NULL, "text" text NOT NULL, "is_correct" boolean NOT NULL, "question_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("question_id") REFERENCES "quizzes"."questions"("id") ON UPDATE cascade ON DELETE cascade);

CREATE TABLE "quizzes"."poap_urls" ("id" serial NOT NULL, "url" text NOT NULL, "used" boolean NOT NULL DEFAULT false, "quiz_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("quiz_id") REFERENCES "quizzes"."quizzes"("id") ON UPDATE cascade ON DELETE cascade);

alter table "quizzes"."poap_urls" add constraint "poap_urls_quiz_id_url_key" unique ("quiz_id", "url");

alter table "quizzes"."questions" drop column "created_at" cascade;
