-- Adicionar coluna cover_image na tabela funnels
ALTER TABLE public.funnels 
ADD COLUMN cover_image TEXT DEFAULT NULL;