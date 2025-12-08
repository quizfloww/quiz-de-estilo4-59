import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelStage } from "@/hooks/usePublicFunnel";
import {
  CheckCircle,
  Mail,
  ArrowRight,
  Heart,
  Share2,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

interface DynamicThankyouProps {
  stage: FunnelStage;
  userName: string;
  primaryStyleCategory?: string;
  onContinue?: () => void;
}

export const DynamicThankyou: React.FC<DynamicThankyouProps> = ({
  stage,
  userName,
  primaryStyleCategory,
  onContinue,
}) => {
  const config = (stage.config || {}) as Record<string, unknown>;

  // Config options
  const title =
    (config.thankyouTitle as string) ||
    (config.title as string) ||
    stage.title ||
    "Obrigada por participar!";
  const subtitle =
    (config.thankyouSubtitle as string) ||
    (config.subtitle as string) ||
    "Sua jornada de transformação começa agora.";
  const message =
    (config.thankyouMessage as string) ||
    (config.message as string) ||
    "Enviamos as informações para o seu e-mail. Verifique sua caixa de entrada (e também a pasta de spam).";
  const imageUrl = config.imageUrl as string;
  const showSocialShare = config.showSocialShare !== false;
  const ctaText = (config.ctaText as string) || "Voltar ao Início";
  const ctaUrl = config.ctaUrl as string;
  const showNextSteps = config.showNextSteps !== false;

  // Next steps
  const nextSteps = (config.nextSteps as string[]) || [
    "Verifique seu e-mail para receber o acesso",
    "Explore o conteúdo com calma",
    "Aplique as dicas no seu dia a dia",
    "Compartilhe seus resultados nas redes sociais",
  ];

  const handleCTA = () => {
    if (ctaUrl) {
      window.location.href = ctaUrl;
    } else if (onContinue) {
      onContinue();
    } else {
      window.location.href = "/";
    }
  };

  const handleShare = (platform: string) => {
    const shareText = `Acabei de descobrir meu estilo pessoal: ${
      primaryStyleCategory || "Único"
    }! 🎨✨`;
    const shareUrl = window.location.href;

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      instagram: "#", // Instagram doesn't support direct sharing via URL
    };

    if (urls[platform] && urls[platform] !== "#") {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto py-8 px-4">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg animate-pulse">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-[#432818]">
          {title
            .replace("{userName}", userName || "")
            .replace("{style}", primaryStyleCategory || "")}
        </h1>
        {subtitle && <p className="text-lg text-[#1A1818]/80">{subtitle}</p>}
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Obrigado"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Message Card */}
      {message && (
        <Card className="bg-[#FAF9F7] border-[#B89B7A]/30">
          <CardContent className="p-6 flex items-start gap-4">
            <Mail className="w-6 h-6 text-[#aa6b5d] flex-shrink-0 mt-1" />
            <p className="text-[#1A1818]/80">{message}</p>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {showNextSteps && nextSteps.length > 0 && (
        <Card className="border-[#B89B7A]/30">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-medium text-[#432818] flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-[#aa6b5d]" />
              Próximos Passos
            </h3>
            <ol className="space-y-3">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#B89B7A] text-white text-sm flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-[#1A1818]/80">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Social Share */}
      {showSocialShare && (
        <Card className="bg-gradient-to-br from-[#B89B7A]/10 to-[#aa6b5d]/10 border-[#B89B7A]/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-[#aa6b5d]" />
              <h3 className="font-medium text-[#432818]">
                Gostou do resultado?
              </h3>
            </div>
            <p className="text-sm text-[#1A1818]/70">
              Compartilhe com suas amigas e ajude-as a descobrir o estilo delas
              também!
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 border-[#3b5998] text-[#3b5998] hover:bg-[#3b5998] hover:text-white"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 border-[#E1306C] text-[#E1306C] hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-transparent"
                onClick={() => handleShare("instagram")}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Button */}
      <div className="text-center">
        <Button
          className="w-full md:w-auto px-8 h-12 bg-[#aa6b5d] hover:bg-[#8f574a] text-white font-medium"
          onClick={handleCTA}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};
