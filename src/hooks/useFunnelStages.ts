import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type StageType = Database['public']['Enums']['stage_type'];

export interface FunnelStage {
  id: string;
  funnel_id: string;
  type: StageType;
  title: string;
  order_index: number;
  is_enabled: boolean;
  config: Record<string, any>;
  created_at: string;
}

export interface StageOption {
  id: string;
  stage_id: string;
  text: string;
  image_url: string | null;
  style_category: string | null;
  points: number;
  order_index: number;
}

export const useFunnelStages = (funnelId: string | undefined) => {
  return useQuery({
    queryKey: ['funnel-stages', funnelId],
    queryFn: async () => {
      if (!funnelId) return [];
      const { data, error } = await supabase
        .from('funnel_stages')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as FunnelStage[];
    },
    enabled: !!funnelId,
  });
};

// Hook que carrega stages COM suas opções para exibição no editor
export const useFunnelStagesWithOptions = (funnelId: string | undefined) => {
  return useQuery({
    queryKey: ['funnel-stages-with-options', funnelId],
    queryFn: async () => {
      if (!funnelId) return [];
      
      // 1. Buscar stages
      const { data: stages, error: stagesError } = await supabase
        .from('funnel_stages')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('order_index', { ascending: true });

      if (stagesError) throw stagesError;
      if (!stages || stages.length === 0) return [];

      // 2. Buscar todas as opções para essas stages
      const stageIds = stages.map(s => s.id);
      const { data: options, error: optionsError } = await supabase
        .from('stage_options')
        .select('*')
        .in('stage_id', stageIds)
        .order('order_index', { ascending: true });

      if (optionsError) throw optionsError;

      // 3. Mapear opções para cada stage (no formato esperado pelo preview)
      return stages.map(stage => {
        const stageOptions = (options || [])
          .filter(opt => opt.stage_id === stage.id)
          .map(opt => ({
            id: opt.id,
            text: opt.text,
            imageUrl: opt.image_url,
            styleCategory: opt.style_category,
            points: opt.points,
          }));

        const existingConfig = (stage.config as Record<string, any>) || {};
        
        return {
          ...stage,
          config: {
            ...existingConfig,
            options: stageOptions.length > 0 ? stageOptions : existingConfig.options,
          },
        } as FunnelStage;
      });
    },
    enabled: !!funnelId,
  });
};

export const useStageOptions = (stageId: string | undefined) => {
  return useQuery({
    queryKey: ['stage-options', stageId],
    queryFn: async () => {
      if (!stageId) return [];
      const { data, error } = await supabase
        .from('stage_options')
        .select('*')
        .eq('stage_id', stageId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as StageOption[];
    },
    enabled: !!stageId,
  });
};

export const useCreateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stage: Omit<FunnelStage, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('funnel_stages')
        .insert({
          funnel_id: stage.funnel_id,
          type: stage.type,
          title: stage.title,
          order_index: stage.order_index,
          is_enabled: stage.is_enabled ?? true,
          config: stage.config || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['funnel-stages', data.funnel_id] });
    },
    onError: (error) => {
      toast.error('Erro ao criar etapa: ' + error.message);
    },
  });
};

export const useUpdateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FunnelStage> & { id: string }) => {
      const { data, error } = await supabase
        .from('funnel_stages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['funnel-stages', data.funnel_id] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar etapa: ' + error.message);
    },
  });
};

export const useReorderStages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ funnelId, stages }: { funnelId: string; stages: { id: string; order_index: number }[] }) => {
      // Update all stages in parallel
      const updates = stages.map(stage => 
        supabase
          .from('funnel_stages')
          .update({ order_index: stage.order_index })
          .eq('id', stage.id)
      );
      
      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;
      
      return { funnelId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['funnel-stages', data.funnelId] });
    },
    onError: (error) => {
      toast.error('Erro ao reordenar etapas: ' + error.message);
    },
  });
};

export const useDeleteStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, funnelId }: { id: string; funnelId: string }) => {
      const { error } = await supabase
        .from('funnel_stages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { funnelId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['funnel-stages', data.funnelId] });
      toast.success('Etapa excluída!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir: ' + error.message);
    },
  });
};

export const useCreateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (option: Omit<StageOption, 'id'>) => {
      const { data, error } = await supabase
        .from('stage_options')
        .insert(option)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stage-options', data.stage_id] });
    },
    onError: (error) => {
      toast.error('Erro ao criar opção: ' + error.message);
    },
  });
};

export const useUpdateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StageOption> & { id: string }) => {
      const { data, error } = await supabase
        .from('stage_options')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stage-options', data.stage_id] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar opção: ' + error.message);
    },
  });
};

export const useReorderOptions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stageId, options }: { stageId: string; options: { id: string; order_index: number }[] }) => {
      const updates = options.map(option => 
        supabase
          .from('stage_options')
          .update({ order_index: option.order_index })
          .eq('id', option.id)
      );
      
      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;
      
      return { stageId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stage-options', data.stageId] });
    },
    onError: (error) => {
      toast.error('Erro ao reordenar opções: ' + error.message);
    },
  });
};

export const useDeleteOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, stageId }: { id: string; stageId: string }) => {
      const { error } = await supabase
        .from('stage_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { stageId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stage-options', data.stageId] });
    },
    onError: (error) => {
      toast.error('Erro ao excluir opção: ' + error.message);
    },
  });
};
