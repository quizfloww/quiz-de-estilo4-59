import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import { ShoppingCart, ArrowRight, Sparkles } from "lucide-react";

interface CtaOfferBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const CtaOfferBlock: React.FC<CtaOfferBlockProps> = ({
  content,
  isPreview,
}) => {
  const text = content.ctaText || "GARANTIR MEU GUIA AGORA";
  const url = content.ctaUrl || "#";
  const variant = content.ctaVariant || "green";
  const urgencyText =
    content.urgencyText || "O preço pode aumentar a qualquer momento";
  const showIcon = content.showCtaIcon !== false;

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  const variantClasses = {
    green:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/30",
    brand:
      "bg-gradient-to-r from-[#B89B7A] to-[#9A7B5A] hover:from-[#A68B6A] hover:to-[#8A6B4A] shadow-[#B89B7A]/30",
    gradient:
      "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-pink-500/30",
  };

  return (
    <div
      className="w-full flex flex-col items-center gap-4 p-4 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <button
        className={cn(
          "w-full max-w-md py-5 px-8 rounded-xl text-white font-bold text-lg md:text-xl",
          "transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
          "shadow-lg hover:shadow-xl",
          "flex items-center justify-center gap-3",
          variantClasses[variant]
        )}
        disabled={isPreview}
      >
        {showIcon && <ShoppingCart className="w-6 h-6" />}
        <span>{text}</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {urgencyText && (
        <p className="text-sm text-[#8F7A6A] text-center flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B89B7A]" />
          {urgencyText}
        </p>
      )}
    </div>
  );
};
