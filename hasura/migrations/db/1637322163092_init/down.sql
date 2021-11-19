
alter table "quizzes"."questions" alter column "created_at" set default now();
alter table "quizzes"."questions" alter column "created_at" drop not null;
alter table "quizzes"."questions" add column "created_at" timestamptz;

alter table "quizzes"."poap_urls" drop constraint "poap_urls_quiz_id_url_key";

DROP TABLE "quizzes"."poap_urls";

DROP TABLE "quizzes"."answers";

DROP TABLE "quizzes"."questions";

DROP TABLE "quizzes"."quizzes";

drop schema "quizzes" cascade;
