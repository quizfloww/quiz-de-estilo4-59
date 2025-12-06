import React from "react";
import { CanvasBlockContent, BonusItem } from "@/types/canvasBlocks";
import { Gift, CheckCircle, Sparkles } from "lucide-react";

interface BonusBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const defaultBonuses: BonusItem[] = [
  {
    id: "1",
    title: "Guia de Peças-Chave",
    description:
      "As peças essenciais que toda mulher do seu estilo precisa ter no guarda-roupa.",
    value: "R$ 67,00",
  },
  {
    id: "2",
    title: "Guia de Visagismo Facial",
    description:
      "Descubra os melhores cortes, acessórios e maquiagens para o seu rosto.",
    value: "R$ 29,00",
  },
  {
    id: "3",
    title: "Paleta de Cores Personalizada",
    description:
      "As cores que mais valorizam seu tom de pele e estilo pessoal.",
    value: "R$ 47,00",
  },
];

export const BonusBlock: React.FC<BonusBlockProps> = ({
  content,
  isPreview,
}) => {
  const title = content.bonusTitle || "Bônus Exclusivos";
  const subtitle =
    content.bonusSubtitle ||
    "Além do Guia Principal, você recebe gratuitamente:";
  const bonuses = content.bonusItems || defaultBonuses;

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-[#aa6b5d]" />
            <span className="text-sm font-medium uppercase tracking-wide text-[#aa6b5d]">
              Bônus
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-[#432818] mb-2">
            {title}
          </h3>

          <p className="text-[#8F7A6A]">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {bonuses.map((bonus, index) => (
            <div
              key={bonus.id || index}
              className="bg-white rounded-xl p-4 border border-[#B89B7A]/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#B89B7A] to-[#aa6b5d] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-[#432818]">
                      {bonus.title}
                    </h4>
                    {bonus.value && (
                      <span className="text-sm font-medium text-[#aa6b5d] bg-[#aa6b5d]/10 px-2 py-0.5 rounded">
                        Valor: {bonus.value}
                      </span>
                    )}
                  </div>

                  {bonus.description && (
                    <p className="text-sm text-[#8F7A6A]">
                      {bonus.description}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#aa6b5d] font-medium">
            Total em bônus: <span className="line-through">R$ 143,00</span>{" "}
            <span className="text-green-600">GRÁTIS</span>
          </p>
        </div>
      </div>
    </div>
  );
};
