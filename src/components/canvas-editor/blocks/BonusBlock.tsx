import React from "react";
import { CanvasBlockContent, BonusItem } from "@/types/canvasBlocks";
import { Gift, Star } from "lucide-react";
import { motion } from "framer-motion";
import { optimizeCloudinaryUrl } from "@/utils/imageUtils";
import ProgressiveImage from "@/components/ui/progressive-image";

interface BonusBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// URLs das imagens reais do Cloudinary
const BONUS_IMAGES = {
  bonus1:
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp",
  bonus2:
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp",
};

const defaultBonuses: BonusItem[] = [
  {
    id: "1",
    title: "Peças-chave do Guarda-roupa",
    description:
      "Descubra as peças essenciais para seu estilo que maximizam suas combinações com investimento inteligente.",
    value: "R$ 67,00",
    imageUrl: BONUS_IMAGES.bonus1,
  },
  {
    id: "2",
    title: "Visagismo Facial",
    description:
      "Aprenda a valorizar seus traços faciais, cortes de cabelo e acessórios que harmonizam com seu rosto.",
    value: "R$ 29,00",
    imageUrl: BONUS_IMAGES.bonus2,
  },
];

/**
 * BonusBlock - Design igual ao BonusSection.tsx real
 * - Grid 2 colunas com cards animados (motion)
 * - Imagens grandes do Cloudinary
 * - Stars de rating
 * - Hover effects com scale
 */
export const BonusBlock: React.FC<BonusBlockProps> = ({
  content,
  isPreview,
}) => {
  const title = content.bonusTitle || "Bônus Exclusivos para Você";
  const subtitle =
    content.bonusSubtitle ||
    "Além do guia principal, você receberá estas ferramentas complementares para potencializar sua jornada de transformação:";
  const bonuses = content.bonusItems || defaultBonuses;

  // Mobile Layout Configuration
  const mobileLayout = content.mobileLayout || "stacked";
  const mobileColumns = content.mobileColumns || 1;

  // Classes baseadas na configuração de layout mobile
  const getGridClasses = () => {
    if (mobileLayout === "side-by-side") {
      return "grid grid-cols-2 gap-3 md:gap-6"; // Sempre 2 colunas
    }
    // stacked ou auto - configurável via mobileColumns
    if (mobileColumns === 2) {
      return "grid grid-cols-2 gap-3 md:gap-6";
    }
    return "grid grid-cols-1 md:grid-cols-2 gap-6"; // Padrão: 1 coluna mobile, 2 desktop
  };

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  return (
    <div
      className="w-full py-6 sm:py-8 md:py-10 px-2 sm:px-4 rounded-xl"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair text-[#aa6b5d] text-center mb-2">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-center text-[#3a3a3a] mb-4 sm:mb-6 max-w-md mx-auto px-2">
        {subtitle}
      </p>
      <div className="elegant-divider w-24 sm:w-32 mx-auto mt-0 mb-4 sm:mb-6"></div>

      <div className="max-w-4xl mx-auto">
        <div className={getGridClasses()}>
          {bonuses.map((bonus, index) => {
            const imageUrl =
              bonus.imageUrl ||
              (index === 0 ? BONUS_IMAGES.bonus1 : BONUS_IMAGES.bonus2);
            const optimizedUrl = optimizeCloudinaryUrl(imageUrl, {
              quality: 95,
              format: "webp",
            });

            return (
              <motion.div
                key={bonus.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: 0.2 + index * 0.2,
                }}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow transform-3d hover:scale-[1.01] border-0"
              >
                <div className="flex justify-center mb-4">
                  <ProgressiveImage
                    src={optimizedUrl}
                    alt={bonus.title}
                    className="w-full max-w-[300px] h-auto rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width={300}
                    height={420}
                  />
                </div>
                <h3 className="text-lg font-medium text-[#aa6b5d] mb-2 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-[#B89B7A]" />
                  {bonus.title}
                </h3>
                <p className="text-[#432818] text-sm">{bonus.description}</p>

                <div className="mt-3 flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-[#B89B7A] text-[#B89B7A]"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-[#3a3a3a]">
                    Edição Premium
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
