-- URL Shortener Database Schema
-- Run this SQL in your Supabase SQL editor

create table urls (
  id bigint generated always as identity primary key,
  long_url text not null,
  created_at timestamp with time zone default now(),
  expires_at DATETIME,               -- optional: null means never expires
  click_count INTEGER DEFAULT 0      -- optional: increment on each redirect
  batch_id uuid -- optional: null means no batch
);

-- Optional: Add an index on created_at for analytics queries
create index idx_urls_created_at on urls(created_at);

-- Future enhancement: Add batch_id for batch caching optimization
-- alter table urls add column batch_id uuid;
-- create index idx_urls_batch_id on urls(batch_id);

-- Future enhancement: Add click tracking
-- alter table urls add column click_count bigint default 0;

-- Future enhancement: Add expiry dates
-- alter table urls add column expires_at timestamp with time zone;
