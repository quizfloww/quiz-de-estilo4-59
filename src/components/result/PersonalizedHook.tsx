import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { styleConfig } from '@/config/styleConfig'; // Importa o styleConfig
import { AnimatedWrapper } from '@/components/ui/animated-wrapper'; // Importa o AnimatedWrapper
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react'; // Ícone ShoppingCart é usado, Star não é.

interface PersonalizedHookProps {
  styleCategory: string;
  userName?: string;
  onCTAClick: () => void;
}

const styleMessages: Record<string, {
  congratsMessage: string;
  powerMessage: string;
  ctaText: string;
  exclusive: string;
}> = {
  'Natural': {
    congratsMessage: "você é uma mulher autêntica e espontânea!",
    powerMessage: "Mulheres com seu seu estilo conquistam admiração pela naturalidade e charme genuíno. Sua beleza está na simplicidade elegante.",
    ctaText: "ACESSE SEU GUIA NATURAL AGORA",
    exclusive: "Oferta Especial"
  },
  'Clássico': {
    congratsMessage: "você possui elegância atemporal!",
    powerMessage: "Mulheres com seu estilo transmitem confiança e sofisticação. Você é vista como referência de bom gosto e refinamento.",
    ctaText: "ACESSE SEU GUIA CLÁSSICO AGORA",
    exclusive: "Oferta Especial"
  },
  'Contemporâneo': {
    congratsMessage: "você tem o equilíbrio perfeito entre moderno e prático!",
    powerMessage: "Mulheres com seu estilo são admiradas pela versatilidade e atualidade. Você sempre parece estar à frente do seu tempo.",
    ctaText: "ACESSE SEU GUIA CONTEMPORÂNEO AGORA",
    exclusive: "Oferta Especial"
  },
  'Elegante': {
    congratsMessage: "você possui presença e sofisticação únicos!",
    powerMessage: "Mulheres com seu estilo comandam respeito e admiração onde chegam. Sua elegância é sua marca registrada.",
    ctaText: "ACESSE SEU GUIA ELEGANTE AGORA",
    exclusive: "Oferta Especial"
  },
  'Romântico': {
    congratsMessage: "você irradia feminilidade e delicadeza!",
    powerMessage: "Mulheres com seu estilo encantam pela suavidade e charme feminino. Você desperta o lado protetor das pessoas.",
    ctaText: "ACESSE SEU GUIA ROMÂNTICO AGORA",
    exclusive: "Oferta Especial"
  },
  'Sexy': {
    congratsMessage: "você possui magnetismo e confiança únicos!",
    powerMessage: "Mulheres com seu estilo fascinam pela presença marcante e autoconfiança. Você comanda a atenção naturalmente.",
    ctaText: "ACESSE SEU GUIA SEXY AGORA",
    exclusive: "Oferta Especial"
  },
  'Dramático': {
    congratsMessage: "você tem presença e força impressionantes!",
    powerMessage: "Mulheres com seu estilo lideram e inspiram por onde passam. Sua personalidade forte é seu maior trunfo.",
    ctaText: "ACESSE SEU GUIA DRAMÁTICO AGORA",
    exclusive: "Oferta Especial"
  },
  'Criativo': {
    congratsMessage: "você é única e expressiva!",
    powerMessage: "Mulheres com seu estilo se destacam pela originalidade e criatividade. Você é uma obra de arte viva.",
    ctaText: "ACESSE SEU GUIA CRIATIVO AGORA",
    exclusive: "Oferta Especial"
  }
};

export const PersonalizedHook: React.FC<PersonalizedHookProps> = ({
  styleCategory,
  userName = "Querida",
  onCTAClick
}) => {
  // Garante que styleMessages[styleCategory] não seja undefined
  const messages = styleMessages[styleCategory] || styleMessages['Natural'];
  const { image } = styleConfig[styleCategory] || {}; // Obter a imagem do styleConfig

  return (
    <div className="text-center p-0">
      <div className="mb-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair text-[#aa6b5d] font-bold leading-tight mb-2">
          {styleCategory}
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-[#432818] mb-4 italic leading-relaxed">
          {messages.congratsMessage}
        </p>
        
        {/* Adicionando a imagem do estilo predominante aqui, 50% menor e com efeitos */}
        {image && (
          <AnimatedWrapper animation="fade" show={true} duration={500} delay={250}>
            {/* Adicionado 'group' para permitir efeitos de hover no filho */}
            <div className="group my-6 mx-auto max-w-[200px] sm:max-w-[200px] md:max-w-[200px] lg:max-w-[200px] relative">
              <img
                src={`${image}?q=auto:best&f=auto&w=200`} // Otimiza a imagem para largura de 200px
                alt={`Estilo ${styleCategory}`}
                // Efeitos de sombra e transformação no hover (borda fixa removida)
                className="w-full h-auto rounded-lg shadow-lg
                           transform transition-all duration-300
                           group-hover:scale-103 group-hover:-translate-y-1 group-hover:rotate-1 group-hover:border group-hover:border-[#aa6b5d]" // Borda aparece apenas no hover
                loading="lazy"
              />
              {/* Elementos decorativos de canto que aparecem no hover */}
              <div className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t border-l border-[#B89B7A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b border-r border-[#B89B7A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </AnimatedWrapper>
        )}

        <div className="bg-white/80 rounded-lg p-4 sm:p-5 shadow-sm border border-[#B89B7A]/20 mt-6 mb-6 text-left">
          <div className="flex items-start gap-3">
            {/* Ícone Star REMOVIDO AQUI */}
            <p className="text-[#432818] leading-relaxed text-base sm:text-lg">
              {messages.powerMessage}
            </p>
          </div>
        </div>
      </div>
      
      {/* Ajustado o gap para dar mais espaço entre o selo, o botão e a mensagem de urgência */}
      <div className="flex flex-col items-center justify-center gap-5 sm:gap-6 mb-6"> {/* Aumentado gap para 5/6, e mb para 6 */}
        <div className="bg-[#B89B7A] text-white px-6 py-2 rounded-full shadow-sm text-sm font-medium whitespace-nowrap">
          🎯 {messages.exclusive} - 78% OFF
        </div>
        
        <Button
          onClick={onCTAClick}
          className="w-full sm:w-auto text-white py-4 px-8 rounded-lg font-semibold transition-all duration-300
                     hover:scale-102 active:scale-98 text-sm sm:text-base md:text-lg"
          style={{
            background: "linear-gradient(to right, #4CAF50, #45a049)",
            boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)"
          }}
        >
          <span className="flex items-center justify-center gap-3 leading-none"> 
            <ShoppingCart className="w-6 h-6" />
            {messages.ctaText}
          </span>
        </Button>
      </div>
      
      {/* Mensagem de Urgência - Agora com um mt- para separá-la do bloco de selo/botão */}
      <p className="text-[#ff6b6b] text-xs font-medium mt-4 sm:mt-6"> {/* Alterado de text-sm para text-xs */}
        ⚡ Esta oferta expira quando você sair desta página
      </p>
    </div>
  );
};

export default PersonalizedHook;
