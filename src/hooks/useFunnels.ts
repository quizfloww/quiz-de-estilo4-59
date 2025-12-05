import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Funnel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  global_config: Record<string, any>;
  style_categories: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }> | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export const useFunnels = () => {
  return useQuery({
    queryKey: ['funnels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Funnel[];
    },
  });
};

export const useFunnel = (id: string | undefined) => {
  return useQuery({
    queryKey: ['funnel', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Funnel | null;
    },
    enabled: !!id,
  });
};

export const useCreateFunnel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (funnel: Partial<Funnel>) => {
      const { data, error } = await supabase
        .from('funnels')
        .insert({
          name: funnel.name || 'Novo Funil',
          slug: funnel.slug || `funil-${Date.now()}`,
          description: funnel.description,
          status: 'draft',
          global_config: funnel.global_config || {},
          style_categories: funnel.style_categories || [],
          cover_image: funnel.cover_image || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funnels'] });
      toast.success('Funil criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar funil: ' + error.message);
    },
  });
};

export const useUpdateFunnel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Funnel> & { id: string }) => {
      const { data, error } = await supabase
        .from('funnels')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['funnels'] });
      queryClient.invalidateQueries({ queryKey: ['funnel', data.id] });
      toast.success('Funil atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    },
  });
};

export const useDeleteFunnel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funnels'] });
      toast.success('Funil excluído!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir: ' + error.message);
    },
  });
};
