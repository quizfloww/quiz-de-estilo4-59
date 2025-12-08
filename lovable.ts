// This file provides the lovable component definition interface
export interface LovableProps {
  name: string;
  displayName: string;
  description: string;
  category: string;
  defaultProps: Record<string, unknown>;
  propsSchema: Record<string, unknown>;
  render: (props: Record<string, unknown>) => React.ReactNode;
}

export function defineLovable(config: LovableProps): LovableProps {
  return config;
}
