-- Criar enum para status do funil
CREATE TYPE public.funnel_status AS ENUM ('draft', 'published', 'archived');

-- Criar enum para tipos de etapa
CREATE TYPE public.stage_type AS ENUM ('intro', 'question', 'strategic', 'transition', 'result');

-- 1. Tabela principal de Funis
CREATE TABLE public.funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  status funnel_status DEFAULT 'draft',
  global_config JSONB DEFAULT '{}',
  style_categories JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Etapas do Funil
CREATE TABLE public.funnel_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE NOT NULL,
  type stage_type NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Opções (para questões)
CREATE TABLE public.stage_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID REFERENCES public.funnel_stages(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT,
  style_category TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL
);

-- 4. Tabela de Respostas dos Participantes
CREATE TABLE public.funnel_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE SET NULL,
  participant_name TEXT,
  participant_email TEXT,
  answers JSONB DEFAULT '[]',
  results JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX idx_funnels_slug ON public.funnels(slug);
CREATE INDEX idx_funnels_status ON public.funnels(status);
CREATE INDEX idx_funnel_stages_funnel_id ON public.funnel_stages(funnel_id);
CREATE INDEX idx_funnel_stages_order ON public.funnel_stages(funnel_id, order_index);
CREATE INDEX idx_stage_options_stage_id ON public.stage_options(stage_id);
CREATE INDEX idx_funnel_responses_funnel_id ON public.funnel_responses(funnel_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_funnels_updated_at
  BEFORE UPDATE ON public.funnels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies para funnels
-- Leitura pública para funis publicados
CREATE POLICY "Public can read published funnels"
  ON public.funnels FOR SELECT
  USING (status = 'published');

-- Inserção pública (para criação inicial - depois pode restringir com auth)
CREATE POLICY "Anyone can create funnels"
  ON public.funnels FOR INSERT
  WITH CHECK (true);

-- Atualização pública (depois pode restringir com auth)
CREATE POLICY "Anyone can update funnels"
  ON public.funnels FOR UPDATE
  USING (true);

-- Deleção pública (depois pode restringir com auth)
CREATE POLICY "Anyone can delete funnels"
  ON public.funnels FOR DELETE
  USING (true);

-- Policy para admin ver todos os funis (incluindo drafts)
CREATE POLICY "Admin can read all funnels"
  ON public.funnels FOR SELECT
  USING (true);

-- RLS Policies para funnel_stages
CREATE POLICY "Public read funnel_stages"
  ON public.funnel_stages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert funnel_stages"
  ON public.funnel_stages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update funnel_stages"
  ON public.funnel_stages FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete funnel_stages"
  ON public.funnel_stages FOR DELETE
  USING (true);

-- RLS Policies para stage_options
CREATE POLICY "Public read stage_options"
  ON public.stage_options FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert stage_options"
  ON public.stage_options FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update stage_options"
  ON public.stage_options FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete stage_options"
  ON public.stage_options FOR DELETE
  USING (true);

-- RLS Policies para funnel_responses
CREATE POLICY "Public can insert responses"
  ON public.funnel_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read responses"
  ON public.funnel_responses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update responses"
  ON public.funnel_responses FOR UPDATE
  USING (true);