import React from "react";
import { CanvasBlockContent, BenefitItem } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import { Check, CheckCircle, Sparkles, Star } from "lucide-react";

interface BenefitsListBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const DEFAULT_BENEFITS: BenefitItem[] = [
  {
    id: "1",
    title: "Guia personalizado para seu estilo",
    description: "Descubra as peças que mais combinam com você",
  },
  {
    id: "2",
    title: "Paleta de cores exclusiva",
    description: "As cores que realçam sua beleza natural",
  },
  {
    id: "3",
    title: "Dicas de combinações",
    description: "Monte looks incríveis sem esforço",
  },
  {
    id: "4",
    title: "Peças-chave do guarda-roupa",
    description: "Saiba o que não pode faltar",
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  check: Check,
  checkCircle: CheckCircle,
  sparkles: Sparkles,
  star: Star,
};

export const BenefitsListBlock: React.FC<BenefitsListBlockProps> = ({
  content,
  isPreview,
}) => {
  const benefits = content.benefits?.length
    ? content.benefits
    : DEFAULT_BENEFITS;
  const layout = content.benefitsLayout || "list";
  // Limitar colunas a máximo 2 para melhor responsividade
  const columns = Math.min(content.benefitsColumns || 1, 2);
  const showIcons = content.showBenefitIcons !== false;
  const blockBackgroundColor = content.backgroundColor || "transparent";

  if (layout === "grid") {
    return (
      <div
        className={cn(
          "w-full grid gap-4 p-4 rounded-lg",
          columns === 2 && "grid-cols-1 sm:grid-cols-2"
        )}
        style={{ backgroundColor: blockBackgroundColor }}
      >
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="p-4 bg-white rounded-lg border border-[#B89B7A]/20 shadow-sm"
          >
            {showIcons && (
              <div className="w-10 h-10 rounded-full bg-[#B89B7A]/10 flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5 text-[#B89B7A]" />
              </div>
            )}
            <h4 className="font-semibold text-[#432818] mb-1">
              {benefit.title}
            </h4>
            {benefit.description && (
              <p className="text-sm text-[#8F7A6A]">{benefit.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // List layout (default)
  return (
    <div
      className="w-full space-y-3 p-4 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      {benefits.map((benefit) => (
        <div
          key={benefit.id}
          className="flex items-start gap-3 p-3 bg-white/50 rounded-lg"
        >
          {showIcons && (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          )}
          <div>
            <h4 className="font-medium text-[#432818]">{benefit.title}</h4>
            {benefit.description && (
              <p className="text-sm text-[#8F7A6A]">{benefit.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
