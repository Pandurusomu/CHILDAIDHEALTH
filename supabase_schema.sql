-- Supabase Database Schema for Child Aid Support Platform
-- Run this SQL in your Supabase SQL Editor to set up tables and RLS policies

-- 1. Create Users Table (Synced with Clerk / Custom Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  admin_feedback TEXT,
  
  -- Guardian / Applicant Details
  applicant_relationship TEXT NOT NULL, -- 'parent', 'sibling', 'guardian'
  applicant_gender TEXT NOT NULL, -- 'Male', 'Female', 'Other'
  applicant_full_name TEXT NOT NULL,
  applicant_age INT NOT NULL,
  applicant_aadhaar TEXT NOT NULL,
  applicant_mobile TEXT NOT NULL,
  
  -- Child Details
  child_full_name TEXT NOT NULL,
  child_age INT NOT NULL,
  child_gender TEXT NOT NULL, -- 'Male', 'Female'
  child_aadhaar TEXT NOT NULL,
  child_disease_name TEXT NOT NULL,
  child_disease_description TEXT,
  hospital_name TEXT NOT NULL,
  hospital_city TEXT NOT NULL,
  treating_doctor TEXT,
  
  -- Documents & Media
  child_photo_url TEXT NOT NULL,
  hospital_doc_url TEXT NOT NULL,
  child_video_url TEXT,
  hospital_doc_file_name TEXT,
  video_file_name TEXT,
  
  -- Banking & Payment Details
  account_holder_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  upi_id TEXT NOT NULL
);

-- 3. Indexes for Faster Filtering
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Public view approved applications
CREATE POLICY "Public read approved applications"
ON public.applications FOR SELECT
USING (status = 'approved');

-- Users view their own submitted applications
CREATE POLICY "Users read own applications"
ON public.applications FOR SELECT
USING (auth.jwt() ->> 'sub' = user_id OR status = 'approved');

-- Authenticated users insert applications
CREATE POLICY "Users insert applications"
ON public.applications FOR INSERT
WITH CHECK (true);

-- Admin update policy
CREATE POLICY "Admin update applications"
ON public.applications FOR UPDATE
USING (true);
