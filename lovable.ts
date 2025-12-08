// This file provides the lovable component definition interface

export interface ImageProp {
  src: string;
  alt?: string;
}

export interface ButtonProp {
  text: string;
  color: string;
}

export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle?: string;
  type: "text" | "image" | "both";
  multiSelect: number;
  options: QuizOption[];
}

export interface LovableRenderProps {
  // Common props
  logo?: ImageProp;
  backgroundImage?: ImageProp;
  headline?: string;
  subtitle?: string;
  button?: ButtonProp;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  
  // Quiz specific props
  questions?: QuizQuestion[];
  startingQuestion?: number;
  useLocalStorage?: boolean;
  
  // Allow additional props
  [key: string]: unknown;
}

export interface LovableProps {
  name: string;
  displayName: string;
  description: string;
  category: string;
  defaultProps: Record<string, unknown>;
  propsSchema: Record<string, unknown>;
  render: (props: LovableRenderProps) => React.ReactNode;
}

export function defineLovable(config: LovableProps): LovableProps {
  return config;
}
