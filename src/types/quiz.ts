export type StyleCategory =
  | "Natural"
  | "Clássico"
  | "Contemporâneo"
  | "Elegante"
  | "Romântico"
  | "Sexy"
  | "Dramático"
  | "Criativo";

export interface StyleResult {
  category: StyleCategory;
  score: number;
  percentage: number;
}

export interface QuizResult {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  totalSelections: number;
  selections?: string[]; // Array de IDs das opções selecionadas
  userName?: string;
}

export interface QuizComponentData {
  id: string;
  type: string;
  content: any;
  position: number;
  data?: any;
}

export type BlockType =
  | "hero"
  | "image"
  | "text"
  | "video"
  | "button"
  | "divider"
  | "spacer"
  | "code"
  | "list"
  | "table"
  | "form"
  | "social"
  | "map"
  | "raw-html"
  | "raw-js"
  | "transformation"
  | "pricing"
  | "testimonials"
  | "guarantee"
  | "faq"
  | "bonus"
  | "scarcity-timer"
  | "dynamic-content"
  | "integrations"
  | "legal"
  | "custom-code"
  | "heading"
  | "paragraph";

export interface UserResponse {
  questionId: string;
  selectedOptions: string[];
}

export interface QuizQuestion {
  id: string;
  title: string;
  type: "image" | "text" | "both"; // Added 'both' to the union
  options: QuizOption[];
  multiSelect: number;
  imageUrl?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  styleCategory: string;
  imageUrl?: string;
  image_url?: string; // Suporte para snake_case do banco de dados
  points?: number;
}
