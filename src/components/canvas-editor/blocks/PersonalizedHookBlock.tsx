import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { ShoppingCart } from "lucide-react";
import Logo from "@/components/ui/logo";
import { styleConfig } from "@/config/styleConfig";
import { Button } from "@/components/ui/button";

interface PersonalizedHookBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Mensagens dinâmicas por estilo (idênticas ao PersonalizedHook.tsx real)
const styleMessages: Record<
  string,
  {
    congratsMessage: string;
    powerMessage: string;
    ctaText: string;
  }
> = {
  Natural: {
    congratsMessage: "você é uma mulher autêntica e espontânea!",
    powerMessage:
      "Mulheres com seu estilo conquistam admiração pela naturalidade e charme genuíno. Sua beleza está na simplicidade elegante.",
    ctaText: "ACESSE SEU GUIA NATURAL AGORA",
  },
  Clássico: {
    congratsMessage: "você possui elegância atemporal!",
    powerMessage:
      "Mulheres com seu estilo transmitem confiança e sofisticação. Você é vista como referência de bom gosto e refinamento.",
    ctaText: "ACESSE SEU GUIA CLÁSSICO AGORA",
  },
  Contemporâneo: {
    congratsMessage: "você tem o equilíbrio perfeito entre moderno e prático!",
    powerMessage:
      "Mulheres com seu estilo são admiradas pela versatilidade e atualidade. Você sempre parece estar à frente do seu tempo.",
    ctaText: "ACESSE SEU GUIA CONTEMPORÂNEO AGORA",
  },
  Elegante: {
    congratsMessage: "você possui presença e sofisticação únicos!",
    powerMessage:
      "Mulheres com seu estilo comandam respeito e admiração onde chegam. Sua elegância é sua marca registrada.",
    ctaText: "ACESSE SEU GUIA ELEGANTE AGORA",
  },
  Romântico: {
    congratsMessage: "você irradia feminilidade e delicadeza!",
    powerMessage:
      "Mulheres com seu estilo encantam pela suavidade e charme feminino. Você desperta o lado protetor das pessoas.",
    ctaText: "ACESSE SEU GUIA ROMÂNTICO AGORA",
  },
  Sexy: {
    congratsMessage: "você possui magnetismo e confiança únicos!",
    powerMessage:
      "Mulheres com seu estilo fascinam pela presença marcante e autoconfiança. Você comanda a atenção naturalmente.",
    ctaText: "ACESSE SEU GUIA SEXY AGORA",
  },
  Dramático: {
    congratsMessage: "você tem presença e força impressionantes!",
    powerMessage:
      "Mulheres com seu estilo lideram e inspiram por onde passam. Sua personalidade forte é seu maior trunfo.",
    ctaText: "ACESSE SEU GUIA DRAMÁTICO AGORA",
  },
  Criativo: {
    congratsMessage: "você é única e expressiva!",
    powerMessage:
      "Mulheres com seu estilo se destacam pela originalidade e criatividade. Você é uma obra de arte viva.",
    ctaText: "ACESSE SEU GUIA CRIATIVO AGORA",
  },
};

export const PersonalizedHookBlock: React.FC<PersonalizedHookBlockProps> = ({
  content,
  isPreview,
}) => {
  // Categoria do estilo (dinâmica ou padrão)
  const styleCategory = (content.styleCategory as string) || "Natural";
  const messages = styleMessages[styleCategory] || styleMessages["Natural"];
  const styleData = styleConfig[styleCategory] || styleConfig["Natural"];

  // Configurações de saudação
  const showGreeting = content.showGreeting !== false;
  const greetingTemplate =
    (content.greetingTemplate as string) || "Olá, {nome}!";
  const greetingSubtitle =
    (content.greetingSubtitle as string) || "Seu Estilo Predominante é:";

  // Nome de exemplo para preview
  const userName = isPreview
    ? "Maria"
    : (content.userName as string) || "Querida";
  const formattedGreeting = greetingTemplate.replace("{nome}", userName);

  // Opções de exibição
  const showStyleImage = content.showStyleImage !== false;
  const showCta = content.showCta !== false;
  const ctaText = (content.ctaText as string) || messages.ctaText;
  const blockBackgroundColor = content.backgroundColor;

  // Se tiver backgroundColor customizado, usa ele. Senão usa o gradiente padrão
  const containerStyle = blockBackgroundColor
    ? { backgroundColor: blockBackgroundColor }
    : undefined;
  const containerClass = blockBackgroundColor
    ? "text-center p-6 rounded-xl border border-[#B89B7A]/20"
    : "text-center p-6 bg-gradient-to-br from-[#fffaf7] to-[#f5ebe0] rounded-xl border border-[#B89B7A]/20";

  return (
    <div className={containerClass} style={containerStyle}>
      {/* Saudação com Logo */}
      {showGreeting && (
        <div className="mb-6 pb-4 border-b border-[#B89B7A]/20">
          <Logo className="h-12 md:h-16 mx-auto mb-4" />
          <h1 className="font-playfair text-xl md:text-2xl font-semibold mb-2 text-[#432818]">
            {formattedGreeting}
          </h1>
          <p className="text-sm md:text-base text-[#5a5a5a]">
            {greetingSubtitle}
          </p>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-amber-300 to-amber-500 rounded-full mt-3" />
        </div>
      )}

      <div className="mb-6">
        {/* Nome do estilo grande */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair text-[#aa6b5d] font-bold leading-tight mb-2">
          {styleCategory}
        </h2>

        {/* Mensagem de congratulação */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#432818] mb-4 italic leading-relaxed">
          {messages.congratsMessage}
        </p>

        {/* Imagem do estilo (como no real) */}
        {showStyleImage && styleData?.image && (
          <div className="group my-6 mx-auto max-w-[200px] relative">
            <img
              src={`${styleData.image}?q=auto:best&f=auto&w=200`}
              alt={`Estilo ${styleCategory}`}
              className="w-full h-auto rounded-lg shadow-lg transform transition-all duration-300 group-hover:scale-[1.03] group-hover:-translate-y-1 group-hover:rotate-1 group-hover:border group-hover:border-[#aa6b5d]"
              loading="lazy"
            />
            {/* Elementos decorativos de canto */}
            <div className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t border-l border-[#B89B7A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b border-r border-[#B89B7A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        )}

        {/* Power message */}
        <div className="bg-white/80 rounded-lg p-4 sm:p-5 shadow-sm border border-[#B89B7A]/20 mt-6 mb-6 text-left">
          <p className="text-[#432818] leading-relaxed text-base sm:text-lg">
            {(content.powerMessage as string) || messages.powerMessage}
          </p>
        </div>
      </div>

      {/* CTA Button (como no real) */}
      {showCta && (
        <Button
          className="w-full max-w-md bg-gradient-to-r from-[#aa6b5d] to-[#8f574a] hover:from-[#8f574a] hover:to-[#7a4a40] text-white py-4 px-6 rounded-lg font-semibold text-base shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
          disabled={isPreview}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {ctaText}
        </Button>
      )}
    </div>
  );
};
