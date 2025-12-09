CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: funnel_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.funnel_status AS ENUM (
    'draft',
    'published',
    'archived'
);


--
-- Name: stage_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.stage_type AS ENUM (
    'intro',
    'question',
    'strategic',
    'transition',
    'result'
);


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: funnel_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.funnel_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    funnel_id uuid,
    participant_name text,
    participant_email text,
    answers jsonb DEFAULT '[]'::jsonb,
    results jsonb DEFAULT '{}'::jsonb,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone
);


--
-- Name: funnel_stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.funnel_stages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    funnel_id uuid NOT NULL,
    type public.stage_type NOT NULL,
    title text NOT NULL,
    order_index integer NOT NULL,
    is_enabled boolean DEFAULT true,
    config jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: funnels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.funnels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    status public.funnel_status DEFAULT 'draft'::public.funnel_status,
    global_config jsonb DEFAULT '{}'::jsonb,
    style_categories jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    cover_image text
);


--
-- Name: participant_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    participant_id uuid,
    question_id uuid,
    option_id text,
    points integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: quiz_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text,
    email text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question_text text NOT NULL,
    question_order integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: stage_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stage_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    stage_id uuid NOT NULL,
    text text NOT NULL,
    image_url text,
    style_category text,
    points integer DEFAULT 1,
    order_index integer NOT NULL
);


--
-- Name: style_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.style_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    participant_id uuid,
    style_type_id text NOT NULL,
    points integer DEFAULT 0,
    percentage numeric(5,2) DEFAULT 0,
    is_primary boolean DEFAULT false,
    rank integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: utm_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.utm_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: funnel_responses funnel_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funnel_responses
    ADD CONSTRAINT funnel_responses_pkey PRIMARY KEY (id);


--
-- Name: funnel_stages funnel_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funnel_stages
    ADD CONSTRAINT funnel_stages_pkey PRIMARY KEY (id);


--
-- Name: funnels funnels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funnels
    ADD CONSTRAINT funnels_pkey PRIMARY KEY (id);


--
-- Name: funnels funnels_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funnels
    ADD CONSTRAINT funnels_slug_key UNIQUE (slug);


--
-- Name: participant_answers participant_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_answers
    ADD CONSTRAINT participant_answers_pkey PRIMARY KEY (id);


--
-- Name: quiz_participants quiz_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_participants
    ADD CONSTRAINT quiz_participants_pkey PRIMARY KEY (id);


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);


--
-- Name: stage_options stage_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stage_options
    ADD CONSTRAINT stage_options_pkey PRIMARY KEY (id);


--
-- Name: style_results style_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.style_results
    ADD CONSTRAINT style_results_pkey PRIMARY KEY (id);


--
-- Name: utm_analytics utm_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utm_analytics
    ADD CONSTRAINT utm_analytics_pkey PRIMARY KEY (id);


--
-- Name: idx_funnel_responses_funnel_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_funnel_responses_funnel_id ON public.funnel_responses USING btree (funnel_id);


--
-- Name: idx_funnel_stages_funnel_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_funnel_stages_funnel_id ON public.funnel_stages USING btree (funnel_id);


--
-- Name: idx_funnel_stages_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_funnel_stages_order ON public.funnel_stages USING btree (funnel_id, order_index);


--
-- Name: idx_funnels_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_funnels_slug ON public.funnels USING btree (slug);


--
-- Name: idx_funnels_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_funnels_status ON public.funnels USING btree (status);


--
-- Name: idx_stage_options_stage_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stage_options_stage_id ON public.stage_options USING btree (stage_id);


--
-- Name: funnels update_funnels_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_funnels_updated_at BEFORE UPDATE ON public.funnels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: funnel_responses funnel_responses_funnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funnel_responses
    ADD CONSTRAINT funnel_responses_funnel_id_fkey FOREIGN KEY (funnel_id) REFERENCES public.funnels(id) ON DELETE SET NULL;


--
-- Name: funnel_stages funnel_stages_funnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funnel_stages
    ADD CONSTRAINT funnel_stages_funnel_id_fkey FOREIGN KEY (funnel_id) REFERENCES public.funnels(id) ON DELETE CASCADE;


--
-- Name: participant_answers participant_answers_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_answers
    ADD CONSTRAINT participant_answers_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES public.quiz_participants(id) ON DELETE CASCADE;


--
-- Name: stage_options stage_options_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stage_options
    ADD CONSTRAINT stage_options_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.funnel_stages(id) ON DELETE CASCADE;


--
-- Name: style_results style_results_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.style_results
    ADD CONSTRAINT style_results_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES public.quiz_participants(id) ON DELETE CASCADE;


--
-- Name: funnels Admin can read all funnels; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can read all funnels" ON public.funnels FOR SELECT USING (true);


--
-- Name: utm_analytics Allow anonymous inserts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous inserts" ON public.utm_analytics FOR INSERT WITH CHECK (true);


--
-- Name: utm_analytics Allow public read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read" ON public.utm_analytics FOR SELECT USING (true);


--
-- Name: funnels Anyone can create funnels; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create funnels" ON public.funnels FOR INSERT WITH CHECK (true);


--
-- Name: funnel_stages Anyone can delete funnel_stages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete funnel_stages" ON public.funnel_stages FOR DELETE USING (true);


--
-- Name: funnels Anyone can delete funnels; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete funnels" ON public.funnels FOR DELETE USING (true);


--
-- Name: stage_options Anyone can delete stage_options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete stage_options" ON public.stage_options FOR DELETE USING (true);


--
-- Name: funnel_stages Anyone can insert funnel_stages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert funnel_stages" ON public.funnel_stages FOR INSERT WITH CHECK (true);


--
-- Name: stage_options Anyone can insert stage_options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert stage_options" ON public.stage_options FOR INSERT WITH CHECK (true);


--
-- Name: funnel_stages Anyone can update funnel_stages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update funnel_stages" ON public.funnel_stages FOR UPDATE USING (true);


--
-- Name: funnels Anyone can update funnels; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update funnels" ON public.funnels FOR UPDATE USING (true);


--
-- Name: funnel_responses Anyone can update responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update responses" ON public.funnel_responses FOR UPDATE USING (true);


--
-- Name: stage_options Anyone can update stage_options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update stage_options" ON public.stage_options FOR UPDATE USING (true);


--
-- Name: funnel_responses Public can insert responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can insert responses" ON public.funnel_responses FOR INSERT WITH CHECK (true);


--
-- Name: funnels Public can read published funnels; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read published funnels" ON public.funnels FOR SELECT USING ((status = 'published'::public.funnel_status));


--
-- Name: funnel_responses Public can read responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read responses" ON public.funnel_responses FOR SELECT USING (true);


--
-- Name: participant_answers Public insert participant_answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public insert participant_answers" ON public.participant_answers FOR INSERT WITH CHECK (true);


--
-- Name: quiz_participants Public insert quiz_participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public insert quiz_participants" ON public.quiz_participants FOR INSERT WITH CHECK (true);


--
-- Name: style_results Public insert style_results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public insert style_results" ON public.style_results FOR INSERT WITH CHECK (true);


--
-- Name: funnel_stages Public read funnel_stages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read funnel_stages" ON public.funnel_stages FOR SELECT USING (true);


--
-- Name: participant_answers Public read participant_answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read participant_answers" ON public.participant_answers FOR SELECT USING (true);


--
-- Name: quiz_participants Public read quiz_participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read quiz_participants" ON public.quiz_participants FOR SELECT USING (true);


--
-- Name: quiz_questions Public read quiz_questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read quiz_questions" ON public.quiz_questions FOR SELECT USING (true);


--
-- Name: stage_options Public read stage_options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read stage_options" ON public.stage_options FOR SELECT USING (true);


--
-- Name: style_results Public read style_results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read style_results" ON public.style_results FOR SELECT USING (true);


--
-- Name: funnel_responses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.funnel_responses ENABLE ROW LEVEL SECURITY;

--
-- Name: funnel_stages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.funnel_stages ENABLE ROW LEVEL SECURITY;

--
-- Name: funnels; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

--
-- Name: participant_answers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.participant_answers ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quiz_participants ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_questions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

--
-- Name: stage_options; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.stage_options ENABLE ROW LEVEL SECURITY;

--
-- Name: style_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.style_results ENABLE ROW LEVEL SECURITY;

--
-- Name: utm_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.utm_analytics ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


