import { CanvasBlock, CanvasOption } from '@/types/canvasBlocks';
import { FunnelStage } from '@/hooks/useFunnelStages';
import { v4 as uuidv4 } from 'uuid';

export const convertStageToBlocks = (stage: FunnelStage, totalStages: number, currentIndex: number): CanvasBlock[] => {
  const blocks: CanvasBlock[] = [];
  const config = (stage.config as Record<string, any>) || {};
  let order = 0;

  // Calcular progresso
  const progress = totalStages > 0 ? ((currentIndex + 1) / totalStages) * 100 : 0;

  // 1. Header Block (sempre presente)
  blocks.push({
    id: `${stage.id}-header`,
    type: 'header',
    order: order++,
    content: {
      showLogo: config.showLogo !== false,
      logoUrl: config.logoUrl || 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
      showProgress: config.showProgress !== false,
      showBackButton: config.allowBack !== false,
      progress,
    },
  });

  // 2. Heading Block baseado no tipo
  if (stage.type === 'question' || stage.type === 'strategic') {
    blocks.push({
      id: `${stage.id}-heading`,
      type: 'heading',
      order: order++,
      content: {
        text: config.question || stage.title,
        fontSize: '2xl',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });
  } else if (stage.type === 'intro') {
    blocks.push({
      id: `${stage.id}-heading`,
      type: 'heading',
      order: order++,
      content: {
        text: config.title || stage.title || 'Teste de Estilo Pessoal',
        fontSize: '3xl',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });
  } else if (stage.type === 'transition') {
    blocks.push({
      id: `${stage.id}-heading`,
      type: 'heading',
      order: order++,
      content: {
        text: config.transitionTitle || stage.title || 'Enquanto calculamos o seu resultado...',
        fontSize: '2xl',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });
  }

  // 3. Image Block (se houver)
  if (config.imageUrl) {
    blocks.push({
      id: `${stage.id}-image`,
      type: 'image',
      order: order++,
      content: {
        imageUrl: config.imageUrl,
        imageAlt: 'Imagem',
        maxWidth: '384px',
        borderRadius: '0.5rem',
      },
    });
  }

  // 4. Text Block (subtítulo ou mensagem de transição)
  if (config.subtitle) {
    blocks.push({
      id: `${stage.id}-subtitle`,
      type: 'text',
      order: order++,
      content: {
        text: config.subtitle,
        fontSize: 'base',
        textAlign: 'center',
      },
    });
  }

  if (config.transitionSubtitle) {
    blocks.push({
      id: `${stage.id}-transition-subtitle`,
      type: 'text',
      order: order++,
      content: {
        text: config.transitionSubtitle,
        fontSize: 'base',
        textAlign: 'center',
      },
    });
  }

  if (config.transitionMessage) {
    blocks.push({
      id: `${stage.id}-transition-message`,
      type: 'text',
      order: order++,
      content: {
        text: config.transitionMessage,
        fontSize: 'sm',
        textAlign: 'center',
      },
      style: {
        marginTop: '1rem',
      },
    });
  }

  // 5. Input Block (para intro)
  if (stage.type === 'intro') {
    blocks.push({
      id: `${stage.id}-input`,
      type: 'input',
      order: order++,
      content: {
        label: config.inputLabel || 'NOME',
        placeholder: config.inputPlaceholder || 'Digite seu nome aqui...',
        inputType: 'text',
        required: true,
      },
    });
  }

  // 6. Spacer antes das opções
  if (config.options && config.options.length > 0) {
    blocks.push({
      id: `${stage.id}-spacer`,
      type: 'spacer',
      order: order++,
      content: {
        height: '1rem',
      },
    });
  }

  // 7. Options Block (para questões)
  if (config.options && config.options.length > 0) {
    const hasImages = config.options.some((opt: any) => opt.imageUrl);
    
    blocks.push({
      id: `${stage.id}-options`,
      type: 'options',
      order: order++,
      content: {
        displayType: hasImages ? 'both' : 'text',
        multiSelect: config.multiSelect || 1,
        autoAdvance: config.autoAdvance !== false,
        options: config.options.map((opt: any) => ({
          id: opt.id,
          text: opt.text,
          imageUrl: opt.imageUrl,
          styleCategory: opt.styleCategory,
          points: opt.points || 1,
        })),
        columns: hasImages ? 2 : 1,
      },
    });
  }

  // 8. Button Block
  blocks.push({
    id: `${stage.id}-button`,
    type: 'button',
    order: order++,
    content: {
      buttonText: config.buttonText || 'Continuar',
      buttonVariant: 'primary',
      fullWidth: true,
    },
  });

  return blocks;
};

export const createEmptyBlock = (type: CanvasBlock['type']): CanvasBlock => {
  const id = uuidv4();
  
  const defaultContent: Record<CanvasBlock['type'], CanvasBlock['content']> = {
    header: {
      showLogo: true,
      showProgress: true,
      showBackButton: true,
      progress: 0,
    },
    heading: {
      text: 'Novo Título',
      fontSize: '2xl',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    text: {
      text: 'Novo texto',
      fontSize: 'base',
      textAlign: 'center',
    },
    image: {
      imageUrl: '',
      imageAlt: 'Imagem',
      maxWidth: '384px',
    },
    input: {
      label: 'Campo',
      placeholder: 'Digite aqui...',
      inputType: 'text',
      required: false,
    },
    options: {
      displayType: 'text',
      multiSelect: 1,
      autoAdvance: true,
      options: [],
      columns: 1,
    },
    button: {
      buttonText: 'Continuar',
      buttonVariant: 'primary',
      fullWidth: true,
    },
    spacer: {
      height: '1rem',
    },
    divider: {},
  };

  return {
    id,
    type,
    order: 0,
    content: defaultContent[type],
  };
};

export const blocksToStageConfig = (blocks: CanvasBlock[]): Record<string, any> => {
  const config: Record<string, any> = {};

  blocks.forEach(block => {
    switch (block.type) {
      case 'header':
        config.showLogo = block.content.showLogo;
        config.logoUrl = block.content.logoUrl;
        config.showProgress = block.content.showProgress;
        config.allowBack = block.content.showBackButton;
        break;
      case 'heading':
        config.question = block.content.text;
        config.title = block.content.text;
        break;
      case 'image':
        config.imageUrl = block.content.imageUrl;
        break;
      case 'text':
        if (!config.subtitle) {
          config.subtitle = block.content.text;
        }
        break;
      case 'input':
        config.inputLabel = block.content.label;
        config.inputPlaceholder = block.content.placeholder;
        break;
      case 'options':
        config.options = block.content.options;
        config.displayType = block.content.displayType;
        config.multiSelect = block.content.multiSelect;
        config.autoAdvance = block.content.autoAdvance;
        break;
      case 'button':
        config.buttonText = block.content.buttonText;
        break;
    }
  });

  return config;
};
