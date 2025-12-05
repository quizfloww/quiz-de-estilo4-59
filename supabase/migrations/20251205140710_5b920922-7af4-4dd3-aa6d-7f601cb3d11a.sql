-- Tabela para analytics de UTM
CREATE TABLE public.utm_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.utm_analytics ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserções anônimas (tracking de visitantes)
CREATE POLICY "Allow anonymous inserts" ON public.utm_analytics
  FOR INSERT WITH CHECK (true);

-- Política para leitura pública (para analytics)
CREATE POLICY "Allow public read" ON public.utm_analytics
  FOR SELECT USING (true);

-- Tabela para questões do quiz
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quiz_questions" ON public.quiz_questions
  FOR SELECT USING (true);

-- Tabela para participantes do quiz
CREATE TABLE public.quiz_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.quiz_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert quiz_participants" ON public.quiz_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read quiz_participants" ON public.quiz_participants
  FOR SELECT USING (true);

-- Tabela para respostas dos participantes
CREATE TABLE public.participant_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.quiz_participants(id) ON DELETE CASCADE,
  question_id UUID,
  option_id TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.participant_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert participant_answers" ON public.participant_answers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read participant_answers" ON public.participant_answers
  FOR SELECT USING (true);

-- Tabela para resultados de estilo
CREATE TABLE public.style_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.quiz_participants(id) ON DELETE CASCADE,
  style_type_id TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  percentage NUMERIC(5,2) DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.style_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert style_results" ON public.style_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read style_results" ON public.style_results
  FOR SELECT USING (true);