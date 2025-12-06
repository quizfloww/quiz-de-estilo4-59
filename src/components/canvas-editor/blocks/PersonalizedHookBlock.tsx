import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Sparkles } from "lucide-react";
import Logo from "@/components/ui/logo";

interface PersonalizedHookBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Hooks personalizados baseados no estilo (como no ResultPage)
const styleHooks: Record<string, { title: string; subtitle: string }> = {
  Natural: {
    title: "Seu estilo Natural revela uma mulher autêntica",
    subtitle:
      "Você valoriza conforto e praticidade sem abrir mão da elegância. Seu guia vai te mostrar como criar looks que expressam essa essência.",
  },
  Clássico: {
    title: "Seu estilo Clássico transmite sofisticação atemporal",
    subtitle:
      "Você aprecia peças tradicionais e elegantes. Descubra como montar um guarda-roupa funcional e refinado.",
  },
  Contemporâneo: {
    title: "Seu estilo Contemporâneo é versátil e atual",
    subtitle:
      "Você equilibra tendências com praticidade. Aprenda a criar looks modernos que se adaptam a qualquer ocasião.",
  },
  Elegante: {
    title: "Seu estilo Elegante exala refinamento",
    subtitle:
      "Você tem apreço por detalhes e qualidade. Seu guia vai potencializar essa sofisticação natural.",
  },
  Romântico: {
    title: "Seu estilo Romântico revela sua sensibilidade",
    subtitle:
      "Você valoriza delicadeza e feminilidade. Descubra como expressar essa doçura em cada look.",
  },
  Sexy: {
    title: "Seu estilo Sexy celebra sua autoconfiança",
    subtitle:
      "Você sabe valorizar seu corpo com elegância. Aprenda a equilibrar sensualidade e bom gosto.",
  },
  Criativo: {
    title: "Seu estilo Criativo é sua marca registrada",
    subtitle:
      "Você não segue regras, você as cria. Descubra como potencializar sua originalidade.",
  },
  Dramático: {
    title: "Seu estilo Dramático impõe presença",
    subtitle:
      "Você nasceu para se destacar. Aprenda a usar essa força em looks memoráveis.",
  },
};

export const PersonalizedHookBlock: React.FC<PersonalizedHookBlockProps> = ({
  content,
  isPreview,
}) => {
  const hookStyle = content.hookStyle || "elegant";
  const defaultHook = styleHooks["Natural"];
  const title = content.hookTitle || defaultHook.title;
  const subtitle = content.hookSubtitle || defaultHook.subtitle;

  // Configurações de saudação
  const showGreeting = content.showGreeting !== false;
  const greetingTemplate = content.greetingTemplate || "Olá, {nome}!";
  const greetingSubtitle =
    content.greetingSubtitle || "Seu Estilo Predominante é:";

  // Nome de exemplo para preview
  const userName = isPreview ? "Maria" : content.userName || "Visitante";
  const formattedGreeting = greetingTemplate.replace("{nome}", userName);

  const styleClasses = {
    elegant:
      "bg-gradient-to-br from-[#fffaf7] to-[#f5ebe0] border-[#B89B7A]/20",
    bold: "bg-gradient-to-br from-[#432818] to-[#5a3a28] text-white border-[#aa6b5d]",
    minimal: "bg-white border-gray-200",
  };

  return (
    <div className={`w-full p-6 rounded-xl border ${styleClasses[hookStyle]}`}>
      <div className="text-center">
        {/* Saudação Personalizada com Nome */}
        {showGreeting && (
          <div className="mb-6 pb-4 border-b border-[#B89B7A]/20">
            <Logo className="h-12 md:h-16 mx-auto mb-4" />
            <h1
              className={`font-playfair text-xl md:text-2xl font-semibold mb-2 ${
                hookStyle === "bold" ? "text-white" : "text-[#432818]"
              }`}
            >
              {formattedGreeting}
            </h1>
            <p
              className={`text-sm md:text-base ${
                hookStyle === "bold" ? "text-gray-300" : "text-[#5a5a5a]"
              }`}
            >
              {greetingSubtitle}
            </p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-amber-300 to-amber-500 rounded-full mt-3" />
          </div>
        )}

        {/* Gancho Personalizado */}
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles
            className={`w-5 h-5 ${
              hookStyle === "bold" ? "text-[#B89B7A]" : "text-[#aa6b5d]"
            }`}
          />
          <span
            className={`text-sm font-medium uppercase tracking-wide ${
              hookStyle === "bold" ? "text-[#B89B7A]" : "text-[#aa6b5d]"
            }`}
          >
            Resultado Personalizado
          </span>
        </div>

        <h2
          className={`text-2xl md:text-3xl font-playfair font-bold mb-4 ${
            hookStyle === "bold" ? "text-white" : "text-[#432818]"
          }`}
        >
          {title}
        </h2>

        <p
          className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${
            hookStyle === "bold" ? "text-gray-200" : "text-[#5a5a5a]"
          }`}
        >
          {subtitle}
        </p>

        {content.showCta && (
          <button className="mt-6 px-8 py-3 bg-[#aa6b5d] text-white rounded-lg font-medium hover:bg-[#8f5a4d] transition-colors">
            Ver Meu Guia Completo
          </button>
        )}
      </div>
    </div>
  );
};
