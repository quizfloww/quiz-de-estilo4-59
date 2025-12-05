export type CanvasBlockType = 
  | 'header'
  | 'heading'
  | 'text'
  | 'image'
  | 'input'
  | 'options'
  | 'button'
  | 'spacer'
  | 'divider';

export interface CanvasOption {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory?: string;
  points?: number;
}

export interface CanvasBlockContent {
  // Header
  showLogo?: boolean;
  logoUrl?: string;
  showProgress?: boolean;
  showBackButton?: boolean;
  progress?: number;
  
  // Heading/Text
  text?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  
  // Image
  imageUrl?: string;
  imageAlt?: string;
  maxWidth?: string;
  borderRadius?: string;
  imagePosition?: 'top' | 'center' | 'bottom';
  imageAlignment?: 'left' | 'center' | 'right';
  imageSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  // Input
  label?: string;
  placeholder?: string;
  inputType?: 'text' | 'email' | 'tel';
  required?: boolean;
  
  // Options
  displayType?: 'text' | 'image' | 'both';
  multiSelect?: number;
  autoAdvance?: boolean;
  options?: CanvasOption[];
  columns?: 1 | 2 | 3 | 4;
  optionTextSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  optionImageSize?: 'sm' | 'md' | 'lg' | 'xl';
  showCheckIcon?: boolean;
  
  // Button
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  
  // Spacer
  height?: string;
  
  // Global - Escala
  scale?: number;
}

export interface CanvasBlockStyle {
  marginTop?: string;
  marginBottom?: string;
  paddingX?: string;
  paddingY?: string;
  backgroundColor?: string;
}

export interface CanvasBlock {
  id: string;
  type: CanvasBlockType;
  order: number;
  content: CanvasBlockContent;
  style?: CanvasBlockStyle;
}

export interface CanvasState {
  blocks: CanvasBlock[];
  selectedBlockId: string | null;
}

export const BLOCK_TYPE_LABELS: Record<CanvasBlockType, string> = {
  header: 'Cabeçalho',
  heading: 'Título',
  text: 'Texto',
  image: 'Imagem',
  input: 'Campo de Entrada',
  options: 'Opções',
  button: 'Botão',
  spacer: 'Espaçador',
  divider: 'Divisor',
};

export const BLOCK_TYPE_ICONS: Record<CanvasBlockType, string> = {
  header: 'Layout',
  heading: 'Type',
  text: 'AlignLeft',
  image: 'Image',
  input: 'TextCursor',
  options: 'List',
  button: 'MousePointer',
  spacer: 'Maximize2',
  divider: 'Minus',
};
