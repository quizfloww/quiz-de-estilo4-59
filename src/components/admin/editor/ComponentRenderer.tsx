import React from "react";
import { Button } from "../../ui/button";

interface Component {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

interface ComponentRendererProps {
  component: Component;
}

type ButtonVariant = "default" | "destructive" | "ghost" | "link" | "outline" | "secondary";
type ButtonSize = "default" | "icon" | "lg" | "sm";

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const { type, props } = component;

  switch (type) {
    case "heading": {
      const level = (props.level as number) || 1;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag
          className={`font-bold ${getHeadingClasses(level)} ${
            (props.className as string) || ""
          }`}
          style={props.style as React.CSSProperties}
        >
          {(props.text as string) || "Título"}
        </HeadingTag>
      );
    }

    case "paragraph":
      return (
        <p
          className={`text-gray-700 leading-relaxed ${(props.className as string) || ""}`}
          style={props.style as React.CSSProperties}
        >
          {(props.text as string) || "Parágrafo de texto."}
        </p>
      );

    case "button":
      return (
        <Button
          variant={(props.variant as ButtonVariant) || "default"}
          size={(props.size as ButtonSize) || "default"}
          className={(props.className as string) || ""}
          onClick={(e) => e.preventDefault()}
        >
          {(props.text as string) || "Botão"}
        </Button>
      );

    case "image":
      return (
        <img
          src={(props.src as string) || "https://via.placeholder.com/400x200"}
          alt={(props.alt as string) || "Imagem"}
          className={`max-w-full h-auto rounded ${(props.className as string) || ""}`}
          style={props.style as React.CSSProperties}
        />
      );

    case "divider":
      return (
        <hr
          className={`border-gray-300 ${(props.className as string) || ""}`}
          style={props.style as React.CSSProperties}
        />
      );

    case "container":
      return (
        <div
          className={`rounded border-2 border-dashed border-gray-300 min-h-[100px] flex items-center justify-center ${
            (props.className as string) || ""
          }`}
          style={props.style as React.CSSProperties}
        >
          <span className="text-gray-400">
            Container - Arraste componentes aqui
          </span>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-gray-100 rounded border-2 border-dashed">
          <span className="text-gray-500">Componente desconhecido: {type}</span>
        </div>
      );
  }
}

function getHeadingClasses(level: number): string {
  switch (level) {
    case 1:
      return "text-4xl";
    case 2:
      return "text-3xl";
    case 3:
      return "text-2xl";
    case 4:
      return "text-xl";
    case 5:
      return "text-lg";
    case 6:
      return "text-base";
    default:
      return "text-4xl";
  }
}
