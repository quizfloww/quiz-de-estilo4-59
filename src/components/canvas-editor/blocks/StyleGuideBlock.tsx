import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { BookOpen, Sparkles } from "lucide-react";

interface StyleGuideBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const StyleGuideBlock: React.FC<StyleGuideBlockProps> = ({
  content,
  isPreview,
}) => {
  const imageSize = content.guideImageSize || "lg";
  const showBadge = content.showExclusiveBadge !== false;
  const showSecondary = content.showSecondaryGuides !== false;

  const sizeClasses = {
    sm: "max-w-[200px]",
    md: "max-w-[300px]",
    lg: "max-w-[400px]",
    xl: "max-w-[500px]",
  };

  // Placeholder images para preview
  const mainGuideUrl =
    content.imageUrl ||
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/guia-natural.webp";

  return (
    <div className="w-full flex flex-col items-center py-6">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 relative">
        {/* Imagem Principal do Guia */}
        <div className={`relative ${sizeClasses[imageSize]}`}>
          <img
            src={mainGuideUrl}
            alt="Guia de Estilo Principal"
            className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />

          {showBadge && (
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium transform rotate-12 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Exclusivo
            </div>
          )}
        </div>

        {/* Miniaturas Secundárias */}
        {showSecondary && (
          <div className="flex flex-row md:flex-col gap-2 md:gap-3">
            {[1, 2].map((index) => (
              <div
                key={index}
                className="w-16 h-20 rounded-md bg-gray-100 border border-[#B89B7A]/20 shadow-sm overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#fffaf7] to-[#f5ebe0]">
                  <BookOpen className="w-6 h-6 text-[#B89B7A]/50" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-[#8F7A6A] text-center">
        Guia completo + bônus exclusivos para o seu estilo
      </p>
    </div>
  );
};
