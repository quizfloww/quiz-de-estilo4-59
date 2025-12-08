import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FunnelStage } from "@/hooks/usePublicFunnel";
import { CheckCircle } from "lucide-react";

interface StyleResult {
  category: string;
  score: number;
  percentage: number;
}

interface DynamicResultProps {
  stage: FunnelStage;
  primaryStyle: StyleResult | null;
  secondaryStyles: StyleResult[];
  userName: string;
  onContinue: () => void;
  styleCategories?: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }> | null;
}

export const DynamicResult: React.FC<DynamicResultProps> = ({
  stage,
  primaryStyle,
  secondaryStyles,
  userName,
  onContinue,
  styleCategories,
}) => {
  const config = (stage.config || {}) as Record<string, unknown>;

  // Get style category info
  const getCategoryInfo = (categoryName: string) => {
    return styleCategories?.find(
      (cat) => cat.id === categoryName || cat.name === categoryName
    );
  };

  const primaryCategoryInfo = primaryStyle
    ? getCategoryInfo(primaryStyle.category)
    : null;

  // Config options
  const title =
    (config.resultTitle as string) ||
    (config.title as string) ||
    stage.title ||
    `${userName || "Seu"} Resultado`;
  const subtitle =
    (config.resultSubtitle as string) ||
    (config.subtitle as string) ||
    "Descobrimos seu estilo predominante!";
  const showSecondaryStyles = config.showSecondaryStyles !== false;
  const buttonText = (config.buttonText as string) || "Ver Oferta Especial";
  const showPercentages = config.showPercentages !== false;
  const description =
    (config.resultDescription as string) ||
    (config.description as string) ||
    primaryCategoryInfo?.description ||
    "";

  if (!primaryStyle) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-md mx-auto items-center py-4">
        <h1 className="text-2xl font-playfair font-bold text-center text-[#432818]">
          Calculando seu resultado...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto items-center py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-playfair font-bold text-[#432818]">
          {title}
        </h1>
        {subtitle && <p className="text-[#1A1818]/80 text-lg">{subtitle}</p>}
      </div>

      {/* Primary Style Card */}
      <Card className="w-full bg-gradient-to-br from-[#B89B7A]/10 to-[#aa6b5d]/10 border-[#B89B7A]/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Style Image */}
            {primaryCategoryInfo?.imageUrl && (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#B89B7A] shadow-lg flex-shrink-0">
                <img
                  src={primaryCategoryInfo.imageUrl}
                  alt={primaryStyle.category}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Style Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-sm text-[#1A1818]/60 uppercase tracking-wide">
                  Seu estilo predominante
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#aa6b5d] mb-2">
                {primaryCategoryInfo?.name || primaryStyle.category}
              </h2>
              {showPercentages && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#1A1818]/70">
                      Compatibilidade
                    </span>
                    <span className="text-lg font-bold text-[#aa6b5d]">
                      {primaryStyle.percentage}%
                    </span>
                  </div>
                  <Progress
                    value={primaryStyle.percentage}
                    className="h-3 bg-[#F3E8E6]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="mt-4 text-[#1A1818]/80 text-center md:text-left leading-relaxed">
              {description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Secondary Styles */}
      {showSecondaryStyles && secondaryStyles.length > 0 && (
        <Card className="w-full bg-white border-[#B89B7A]/20">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-[#432818] mb-3">
              Seus estilos secundários
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {secondaryStyles.slice(0, 3).map((style, index) => {
                const categoryInfo = getCategoryInfo(style.category);
                return (
                  <div
                    key={index}
                    className="bg-[#FAF9F7] rounded-lg p-3 text-center"
                  >
                    {categoryInfo?.imageUrl && (
                      <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-2 border-2 border-[#B89B7A]/30">
                        <img
                          src={categoryInfo.imageUrl}
                          alt={style.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="font-medium text-[#432818]">
                      {categoryInfo?.name || style.category}
                    </p>
                    {showPercentages && (
                      <p className="text-sm text-[#aa6b5d]">
                        {style.percentage}%
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Button */}
      <Button
        className="w-full h-14 bg-[#aa6b5d] hover:bg-[#8f574a] text-white font-semibold text-lg"
        onClick={onContinue}
      >
        {buttonText}
      </Button>
    </div>
  );
};
