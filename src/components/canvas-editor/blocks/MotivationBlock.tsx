import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Heart, CheckCircle, Sparkles } from "lucide-react";

interface MotivationBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const defaultMotivationPoints = [
  "Construir looks com intenção e identidade visual",
  "Utilizar cores, modelagens e tecidos a seu favor",
  "Alinhar sua imagem aos seus objetivos pessoais e profissionais",
  "Desenvolver um guarda-roupa funcional e inteligente",
];

export const MotivationBlock: React.FC<MotivationBlockProps> = ({
  content,
  isPreview,
}) => {
  const title =
    content.motivationTitle ||
    "Por Que Conhecer Seu Estilo Transforma Sua Vida";
  const subtitle =
    content.motivationSubtitle ||
    "Seu estilo é uma ferramenta poderosa. Não se trata apenas de roupas, mas de comunicar quem você é e aspira ser.";
  const points = content.motivationPoints || defaultMotivationPoints;
  const imageUrl = content.motivationImageUrl;

  // Background color (usa gradiente padrão se não configurado)
  const blockBackgroundColor = content.backgroundColor;

  return (
    <div
      className="w-full py-8 px-4 rounded-xl border border-[#B89B7A]/10"
      style={{
        background:
          blockBackgroundColor ||
          "linear-gradient(to bottom right, #fffaf7, white)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[#aa6b5d]" />
            <span className="text-sm font-medium uppercase tracking-wide text-[#aa6b5d]">
              Motivação
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-[#432818] mb-4">
            {title}
          </h3>

          <p className="text-[#5a5a5a] leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            {points.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-[#432818]">{point}</p>
              </div>
            ))}
          </div>

          {imageUrl ? (
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt="Motivação"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          ) : (
            <div className="hidden md:flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#B89B7A]/10 to-[#aa6b5d]/10 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-[#B89B7A]/50" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
