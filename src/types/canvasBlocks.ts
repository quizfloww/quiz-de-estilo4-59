export type CanvasBlockType = 
  | 'header'
  | 'heading'
  | 'text'
  | 'image'
  | 'input'
  | 'options'
  | 'button'
  | 'spacer'
  | 'divider'
  // Blocos de Resultado
  | 'styleResult'
  | 'secondaryStyles'
  | 'styleProgress'
  // Blocos de Oferta
  | 'priceAnchor'
  | 'countdown'
  | 'testimonial'
  | 'benefitsList'
  | 'guarantee'
  | 'ctaOffer'
  | 'faq'
  | 'socialProof';

export interface CanvasOption {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory?: string;
  points?: number;
}

export interface PriceAnchorItem {
  id: string;
  label: string;
  originalPrice: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  text: string;
  imageUrl?: string;
  rating?: number;
}

export interface BenefitItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
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
  imageSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  
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
  optionImageSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  showCheckIcon?: boolean;
  
  // Button
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'cta';
  fullWidth?: boolean;
  buttonUrl?: string;
  
  // Spacer
  height?: string;
  
  // Global - Escala
  scale?: number;
  
  // Style Result
  showPercentage?: boolean;
  showDescription?: boolean;
  layout?: 'side-by-side' | 'stacked';
  styleImageSize?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Secondary Styles
  maxSecondaryStyles?: number;
  showSecondaryPercentage?: boolean;
  
  // Style Progress
  showLabels?: boolean;
  maxStylesShown?: number;
  
  // Price Anchor
  priceItems?: PriceAnchorItem[];
  totalOriginal?: number;
  finalPrice?: number;
  installments?: { count: number; value: number };
  discountBadge?: string;
  currency?: string;
  
  // Countdown
  hours?: number;
  minutes?: number;
  seconds?: number;
  countdownVariant?: 'dramatic' | 'simple' | 'minimal';
  expiryMessage?: string;
  
  // Testimonial
  testimonial?: TestimonialItem;
  testimonialVariant?: 'card' | 'quote' | 'minimal';
  
  // Benefits List
  benefits?: BenefitItem[];
  benefitsLayout?: 'list' | 'grid';
  benefitsColumns?: 1 | 2 | 3;
  showBenefitIcons?: boolean;
  
  // Guarantee
  guaranteeDays?: number;
  guaranteeTitle?: string;
  guaranteeDescription?: string;
  guaranteeImageUrl?: string;
  
  // CTA Offer
  ctaText?: string;
  ctaUrl?: string;
  ctaVariant?: 'green' | 'brand' | 'gradient';
  urgencyText?: string;
  showCtaIcon?: boolean;
  
  // FAQ
  faqItems?: FaqItem[];
  faqStyle?: 'accordion' | 'list';
  
  // Social Proof
  socialProofText?: string;
  socialProofIcon?: 'users' | 'star' | 'check' | 'heart';
  socialProofVariant?: 'badge' | 'banner' | 'minimal';
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
  // Resultado
  styleResult: 'Resultado do Estilo',
  secondaryStyles: 'Estilos Secundários',
  styleProgress: 'Progresso dos Estilos',
  // Oferta
  priceAnchor: 'Ancoragem de Preço',
  countdown: 'Contador Regressivo',
  testimonial: 'Depoimento',
  benefitsList: 'Lista de Benefícios',
  guarantee: 'Garantia',
  ctaOffer: 'CTA de Oferta',
  faq: 'Perguntas Frequentes',
  socialProof: 'Prova Social',
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
  // Resultado
  styleResult: 'Award',
  secondaryStyles: 'BarChart3',
  styleProgress: 'TrendingUp',
  // Oferta
  priceAnchor: 'DollarSign',
  countdown: 'Clock',
  testimonial: 'Quote',
  benefitsList: 'CheckCircle',
  guarantee: 'Shield',
  ctaOffer: 'ShoppingCart',
  faq: 'HelpCircle',
  socialProof: 'Users',
};
