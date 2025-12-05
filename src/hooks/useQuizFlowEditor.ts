import { useState, useCallback, useEffect } from 'react';
import { QuizFlowConfig, QuizFlowStage, QuizFlowOption } from '@/types/quizFlow';
import { loadQuizFlowConfig, saveQuizFlowConfig, defaultQuizFlowConfig } from '@/data/quizFlowConfig';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useQuizFlowEditor = () => {
  const [config, setConfig] = useState<QuizFlowConfig>(defaultQuizFlowConfig);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(true);

  // Load config on mount
  useEffect(() => {
    const loaded = loadQuizFlowConfig();
    setConfig(loaded);
    if (loaded.stages.length > 0) {
      setActiveStageId(loaded.stages[0].id);
    }
    setLoading(false);
  }, []);

  // Auto-save when config changes
  useEffect(() => {
    if (!loading && isDirty) {
      saveQuizFlowConfig(config);
      setIsDirty(false);
    }
  }, [config, isDirty, loading]);

  const getActiveStage = useCallback((): QuizFlowStage | null => {
    return config.stages.find(s => s.id === activeStageId) || null;
  }, [config.stages, activeStageId]);

  const updateConfig = useCallback((updates: Partial<QuizFlowConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  const addStage = useCallback((type: QuizFlowStage['type'], afterStageId?: string) => {
    const newStage: QuizFlowStage = {
      id: uuidv4(),
      type,
      order: config.stages.length,
      title: `Nova ${type === 'question' ? 'Questão' : type === 'strategic' ? 'Questão Estratégica' : type === 'intro' ? 'Introdução' : type === 'transition' ? 'Transição' : 'Resultado'}`,
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        ...(type === 'question' || type === 'strategic' ? {
          question: 'Nova pergunta',
          displayType: 'text' as const,
          multiSelect: 1,
          autoAdvance: type === 'strategic',
          options: [
            { id: uuidv4(), text: 'Opção 1' },
            { id: uuidv4(), text: 'Opção 2' },
            { id: uuidv4(), text: 'Opção 3' },
            { id: uuidv4(), text: 'Opção 4' }
          ]
        } : {}),
        ...(type === 'intro' ? {
          subtitle: 'Subtítulo da introdução',
          buttonText: 'Continuar',
          inputLabel: 'NOME',
          inputPlaceholder: 'Digite seu nome...'
        } : {}),
        ...(type === 'transition' ? {
          transitionTitle: 'Título da transição',
          transitionSubtitle: 'Subtítulo',
          transitionMessage: 'Mensagem motivacional'
        } : {}),
        ...(type === 'result' ? {
          resultLayout: 'modern' as const,
          showPercentages: true,
          ctaText: 'Ver oferta',
          ctaUrl: '/oferta'
        } : {})
      }
    };

    let newStages = [...config.stages];
    if (afterStageId) {
      const index = newStages.findIndex(s => s.id === afterStageId);
      if (index !== -1) {
        newStages.splice(index + 1, 0, newStage);
      } else {
        newStages.push(newStage);
      }
    } else {
      newStages.push(newStage);
    }

    // Reorder
    newStages = newStages.map((s, i) => ({ ...s, order: i }));

    updateConfig({ stages: newStages });
    setActiveStageId(newStage.id);
    toast.success('Etapa adicionada');
    return newStage.id;
  }, [config.stages, updateConfig]);

  const updateStage = useCallback((stageId: string, updates: Partial<QuizFlowStage>) => {
    setConfig(prev => ({
      ...prev,
      stages: prev.stages.map(s => 
        s.id === stageId ? { ...s, ...updates } : s
      )
    }));
    setIsDirty(true);
  }, []);

  const updateStageConfig = useCallback((stageId: string, configUpdates: Partial<QuizFlowStage['config']>) => {
    setConfig(prev => ({
      ...prev,
      stages: prev.stages.map(s => 
        s.id === stageId ? { ...s, config: { ...s.config, ...configUpdates } } : s
      )
    }));
    setIsDirty(true);
  }, []);

  const deleteStage = useCallback((stageId: string) => {
    const stage = config.stages.find(s => s.id === stageId);
    if (!stage) return;

    let newStages = config.stages.filter(s => s.id !== stageId);
    newStages = newStages.map((s, i) => ({ ...s, order: i }));

    updateConfig({ stages: newStages });

    if (activeStageId === stageId && newStages.length > 0) {
      setActiveStageId(newStages[0].id);
    }

    toast.success('Etapa removida');
  }, [config.stages, activeStageId, updateConfig]);

  const duplicateStage = useCallback((stageId: string) => {
    const stage = config.stages.find(s => s.id === stageId);
    if (!stage) return;

    const newStage: QuizFlowStage = {
      ...JSON.parse(JSON.stringify(stage)),
      id: uuidv4(),
      title: `${stage.title} (cópia)`,
      order: stage.order + 1
    };

    // Update option IDs
    if (newStage.config.options) {
      newStage.config.options = newStage.config.options.map(opt => ({
        ...opt,
        id: uuidv4()
      }));
    }

    let newStages = [...config.stages];
    const index = newStages.findIndex(s => s.id === stageId);
    newStages.splice(index + 1, 0, newStage);
    newStages = newStages.map((s, i) => ({ ...s, order: i }));

    updateConfig({ stages: newStages });
    setActiveStageId(newStage.id);
    toast.success('Etapa duplicada');
    return newStage.id;
  }, [config.stages, updateConfig]);

  const moveStage = useCallback((draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;

    const stages = [...config.stages];
    const draggedIndex = stages.findIndex(s => s.id === draggedId);
    const targetIndex = stages.findIndex(s => s.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [dragged] = stages.splice(draggedIndex, 1);
    stages.splice(targetIndex, 0, dragged);

    const reordered = stages.map((s, i) => ({ ...s, order: i }));
    updateConfig({ stages: reordered });
  }, [config.stages, updateConfig]);

  const addOption = useCallback((stageId: string) => {
    const stage = config.stages.find(s => s.id === stageId);
    if (!stage || !stage.config.options) return;

    const newOption: QuizFlowOption = {
      id: uuidv4(),
      text: `Opção ${stage.config.options.length + 1}`
    };

    updateStageConfig(stageId, {
      options: [...stage.config.options, newOption]
    });
  }, [config.stages, updateStageConfig]);

  const updateOption = useCallback((stageId: string, optionId: string, updates: Partial<QuizFlowOption>) => {
    const stage = config.stages.find(s => s.id === stageId);
    if (!stage || !stage.config.options) return;

    updateStageConfig(stageId, {
      options: stage.config.options.map(opt =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      )
    });
  }, [config.stages, updateStageConfig]);

  const deleteOption = useCallback((stageId: string, optionId: string) => {
    const stage = config.stages.find(s => s.id === stageId);
    if (!stage || !stage.config.options) return;

    updateStageConfig(stageId, {
      options: stage.config.options.filter(opt => opt.id !== optionId)
    });
  }, [config.stages, updateStageConfig]);

  const moveOption = useCallback((stageId: string, draggedId: string, targetId: string) => {
    const stage = config.stages.find(s => s.id === stageId);
    if (!stage || !stage.config.options) return;

    const options = [...stage.config.options];
    const draggedIndex = options.findIndex(o => o.id === draggedId);
    const targetIndex = options.findIndex(o => o.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [dragged] = options.splice(draggedIndex, 1);
    options.splice(targetIndex, 0, dragged);

    updateStageConfig(stageId, { options });
  }, [config.stages, updateStageConfig]);

  const saveConfig = useCallback(() => {
    saveQuizFlowConfig(config);
    setIsDirty(false);
    toast.success('Configuração salva');
  }, [config]);

  const resetConfig = useCallback(() => {
    // Clear localStorage first to ensure fresh config loads
    localStorage.removeItem('quiz-flow-config');
    // Re-import the default config from the module (this gets the latest version)
    setConfig({ ...defaultQuizFlowConfig });
    setIsDirty(true);
    if (defaultQuizFlowConfig.stages.length > 0) {
      setActiveStageId(defaultQuizFlowConfig.stages[0].id);
    }
    toast.success('Configuração resetada para o padrão com todas as questões!');
  }, []);

  return {
    config,
    activeStageId,
    isDirty,
    previewMode,
    loading,
    getActiveStage,
    setActiveStageId,
    setPreviewMode,
    updateConfig,
    addStage,
    updateStage,
    updateStageConfig,
    deleteStage,
    duplicateStage,
    moveStage,
    addOption,
    updateOption,
    deleteOption,
    moveOption,
    saveConfig,
    resetConfig
  };
};
