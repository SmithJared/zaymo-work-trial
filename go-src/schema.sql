-- URL Shortener Database Schema
-- Run this SQL in your Supabase SQL editor

create table urls (
  id bigint generated always as identity primary key,
  long_url text not null,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone,  -- optional: null means never expires
  click_count integer default 0,        -- track clicks on each redirect
  batch_id uuid                         -- optional: groups URLs shortened together
);

-- Indexes for performance
create index idx_urls_created_at on urls(created_at);  -- for analytics queries
create index idx_urls_batch_id on urls(batch_id);      -- for batch operations
