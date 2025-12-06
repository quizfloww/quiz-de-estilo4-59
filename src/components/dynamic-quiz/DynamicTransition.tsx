import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelStage } from "@/hooks/usePublicFunnel";

interface DynamicTransitionProps {
  stage: FunnelStage;
  onContinue: () => void;
}

export const DynamicTransition: React.FC<DynamicTransitionProps> = ({
  stage,
  onContinue,
}) => {
  const config = stage.config || {};

  const title =
    config.transitionTitle ||
    config.title ||
    stage.title ||
    "Enquanto calculamos o seu resultado...";
  const subtitle =
    config.transitionSubtitle ||
    config.subtitle ||
    "Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.";
  const message =
    config.transitionMessage ||
    config.message ||
    "Responda com sinceridade. Isso é só entre você e a sua nova versão.";
  const buttonText = config.buttonText || "Continuar";
  const imageUrl = config.imageUrl || "";

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto items-center py-4">
      {imageUrl && (
        <div className="flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Transição"
            className="object-cover w-full h-auto rounded-lg max-w-80"
          />
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-playfair font-bold text-center text-[#432818]">
        {title}
      </h1>

      {subtitle && (
        <p className="text-center text-[#1A1818]/80 text-lg leading-relaxed">
          {subtitle}
        </p>
      )}

      {message && (
        <Card className="w-full bg-[#B89B7A]/10 border-[#B89B7A]/30">
          <CardContent className="p-4">
            <p className="text-center text-sm italic text-[#432818]/80">
              "{message}"
            </p>
          </CardContent>
        </Card>
      )}

      <Button
        className="w-full h-14 bg-[#B89B7A] hover:bg-[#B89B7A]/90 text-white font-semibold"
        onClick={onContinue}
      >
        {buttonText}
      </Button>
    </div>
  );
};
