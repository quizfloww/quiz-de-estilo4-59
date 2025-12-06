-- =====================================================
-- SECURITY FIX: Restrict RLS policies for admin tables
-- =====================================================
-- This migration fixes overly permissive RLS policies that allowed
-- anonymous users to DELETE/UPDATE/INSERT on admin-only tables.
--
-- Strategy:
-- 1. Public users (quiz takers) can only READ published funnels
-- 2. Public users can INSERT responses/answers (to take the quiz)
-- 3. Only authenticated users (admins) can manage funnels/stages/options
-- =====================================================

-- =====================================================
-- DROP INSECURE POLICIES
-- =====================================================

-- Funnels: Remove policies that allow anyone to create/update/delete
DROP POLICY IF EXISTS "Anyone can create funnels" ON public.funnels;
DROP POLICY IF EXISTS "Anyone can update funnels" ON public.funnels;
DROP POLICY IF EXISTS "Anyone can delete funnels" ON public.funnels;
DROP POLICY IF EXISTS "Admin can read all funnels" ON public.funnels;

-- Funnel Stages: Remove policies that allow anyone to insert/update/delete
DROP POLICY IF EXISTS "Anyone can insert funnel_stages" ON public.funnel_stages;
DROP POLICY IF EXISTS "Anyone can update funnel_stages" ON public.funnel_stages;
DROP POLICY IF EXISTS "Anyone can delete funnel_stages" ON public.funnel_stages;

-- Stage Options: Remove policies that allow anyone to insert/update/delete
DROP POLICY IF EXISTS "Anyone can insert stage_options" ON public.stage_options;
DROP POLICY IF EXISTS "Anyone can update stage_options" ON public.stage_options;
DROP POLICY IF EXISTS "Anyone can delete stage_options" ON public.stage_options;

-- Funnel Responses: Remove policy that allows anyone to update
DROP POLICY IF EXISTS "Anyone can update responses" ON public.funnel_responses;

-- =====================================================
-- CREATE SECURE POLICIES FOR FUNNELS
-- =====================================================

-- Public: Can only read published funnels (already exists, keeping it)
-- Policy "Public can read published funnels" already exists and is secure

-- Authenticated (Admin): Full access to funnels
CREATE POLICY "Authenticated users can manage funnels"
ON public.funnels
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- CREATE SECURE POLICIES FOR FUNNEL_STAGES
-- =====================================================

-- Public: Can read stages of published funnels only
DROP POLICY IF EXISTS "Public read funnel_stages" ON public.funnel_stages;
CREATE POLICY "Public can read stages of published funnels"
ON public.funnel_stages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.funnels f
    WHERE f.id = funnel_stages.funnel_id
    AND f.status = 'published'
  )
);

-- Authenticated (Admin): Full access to funnel_stages
CREATE POLICY "Authenticated users can manage funnel_stages"
ON public.funnel_stages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- CREATE SECURE POLICIES FOR STAGE_OPTIONS
-- =====================================================

-- Public: Can read options of stages belonging to published funnels
DROP POLICY IF EXISTS "Public read stage_options" ON public.stage_options;
CREATE POLICY "Public can read options of published funnels"
ON public.stage_options
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.funnel_stages fs
    JOIN public.funnels f ON f.id = fs.funnel_id
    WHERE fs.id = stage_options.stage_id
    AND f.status = 'published'
  )
);

-- Authenticated (Admin): Full access to stage_options
CREATE POLICY "Authenticated users can manage stage_options"
ON public.stage_options
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- SECURE POLICIES FOR FUNNEL_RESPONSES
-- =====================================================

-- Public can insert and read responses (for taking the quiz)
-- Policy "Public can insert responses" already exists and is acceptable
-- Policy "Public can read responses" - make it more restrictive

-- Only allow reading own responses (based on session or email)
-- For now, keep public read for analytics, but authenticated can update
CREATE POLICY "Authenticated users can manage responses"
ON public.funnel_responses
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- GRANT STATEMENTS FOR SERVICE ROLE
-- =====================================================
-- Note: The service_role bypasses RLS by default, which is the
-- intended behavior for server-side operations.

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "Public can read published funnels" ON public.funnels IS 
'Allows public users to view only published funnels for taking the quiz';

COMMENT ON POLICY "Authenticated users can manage funnels" ON public.funnels IS 
'Allows authenticated admin users full CRUD access to funnels';

COMMENT ON POLICY "Public can read stages of published funnels" ON public.funnel_stages IS 
'Allows public users to see stages only for published funnels';

COMMENT ON POLICY "Authenticated users can manage funnel_stages" ON public.funnel_stages IS 
'Allows authenticated admin users full CRUD access to funnel stages';

COMMENT ON POLICY "Public can read options of published funnels" ON public.stage_options IS 
'Allows public users to see options only for stages of published funnels';

COMMENT ON POLICY "Authenticated users can manage stage_options" ON public.stage_options IS 
'Allows authenticated admin users full CRUD access to stage options';
