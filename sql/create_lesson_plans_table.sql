-- Supabase SQL: Create lesson_plans table

create table if not exists lesson_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  subject text not null,
  class_level text not null,
  topic text not null,
  duration text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);
