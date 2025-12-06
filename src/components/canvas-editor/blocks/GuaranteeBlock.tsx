import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";

interface GuaranteeBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

/**
 * GuaranteeBlock - Design igual ao GuaranteeSection.tsx real
 * - Card branco com sombra
 * - Círculo animado dourado no topo com "7 dias de Garantia"
 * - Lista de benefícios com checkmarks
 */
export const GuaranteeBlock: React.FC<GuaranteeBlockProps> = ({
  content,
  isPreview,
}) => {
  const days = content.guaranteeDays || 7;
  const title = content.guaranteeTitle || "Sua Satisfação 100% Garantida";
  const subtitle = content.guaranteeSubtitle || "Risco Zero";
  const description =
    content.guaranteeDescription ||
    "Se por qualquer motivo você não ficar 100% satisfeita, reembolsamos o valor integral sem perguntas.";
  const blockBackgroundColor = content.backgroundColor || "#ffffff";

  return (
    <div
      className="rounded-2xl shadow-md p-8 relative mt-16"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      {/* Círculo animado no topo */}
      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 w-28 h-28 md:w-36 md:h-36 bg-gradient-to-r from-[#fffaf7] to-[#f9f4ef] rounded-full flex items-center justify-center shadow-lg">
        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-transparent border-t-[#B89B7A] border-b-[#aa6b5d] rounded-full animate-spin-slow"></div>
          <span className="text-white text-sm md:text-lg font-bold text-center">
            {days} dias
            <br />
            de Garantia
          </span>
        </div>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-playfair text-[#432818] font-bold leading-tight mb-2">
          {title}
        </h2>

        <p className="text-lg text-[#aa6b5d] font-medium mb-4">{subtitle}</p>

        <div className="max-w-xl mx-auto">
          <p className="text-[#6B5B4E] leading-relaxed mb-6">{description}</p>
        </div>

        <div className="flex justify-center items-center space-x-4 text-[#432818] text-sm flex-wrap gap-y-2">
          <div className="flex items-center">
            <span className="text-[#B89B7A] mr-2">✓</span>
            <span>Sem perguntas</span>
          </div>
          <div className="flex items-center">
            <span className="text-[#B89B7A] mr-2">✓</span>
            <span>Sem burocracia</span>
          </div>
          <div className="flex items-center">
            <span className="text-[#B89B7A] mr-2">✓</span>
            <span>Reembolso fácil</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
};
