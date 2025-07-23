import React, { useEffect, useState, useRef } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';
import { Header } from '@/components/result/Header';
import { styleConfig } from '@/config/styleConfig';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ShoppingCart, CheckCircle, ArrowDown, Lock } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import SecondaryStylesSection from '@/components/quiz-result/SecondaryStylesSection';
import ErrorState from '@/components/result/ErrorState';
import MotivationSection from '@/components/result/MotivationSection';
import MentorSection from '@/components/result/MentorSection';
import GuaranteeSection from '@/components/result/GuaranteeSection';
import Testimonials from '@/components/quiz-result/sales/Testimonials';
import BeforeAfterTransformation from '@/components/result/BeforeAfterTransformation';
import BonusSection from '@/components/result/BonusSection';
import { Button } from '@/components/ui/button';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useIsLowPerformanceDevice } from '@/hooks/use-mobile';
import ResultSkeleton from '@/components/result/ResultSkeleton';
import { trackButtonClick } from '@/utils/analytics';
import BuildInfo from '@/components/BuildInfo';
import SecurePurchaseElement from '@/components/result/SecurePurchaseElement';
import { useAuth } from '@/context/AuthContext';
import PersonalizedHook from '@/components/result/PersonalizedHook';
import UrgencyCountdown from '@/components/result/UrgencyCountdown';
// import StyleSpecificProof from '@/components/result/StyleSpecificProof'; 

// Importe StyleResult, pois será usado no StyleGuidesVisual aninhado
import { StyleResult } from '@/types/quiz'; 

// Remover 'export' da declaração 'export const ResultPage'
const ResultPage: React.FC = () => { 
  const {
    primaryStyle,
    secondaryStyles
  } = useQuiz();
  const {
    globalStyles
  } = useGlobalStyles();
  const {
    user
  } = useAuth();
  const [imagesLoaded, setImagesLoaded] = useState({
    style: false,
    guide: false
  });
  const isLowPerformance = useIsLowPerformanceDevice();
  const {
    isLoading,
    completeLoading
  } = useLoadingState({
    minDuration: isLowPerformance ? 400 : 800,
    disableTransitions: isLowPerformance
  });

  // --- INÍCIO: LÓGICA DO TESTE A/B ---
  const [testVariant, setTestVariant] = useState<'A' | 'B'>('A');
  const hasTestAssignedRef = useRef(false);

  useEffect(() => {
    if (!hasTestAssignedRef.current) {
      let variant = localStorage.getItem('ab_test_urgency_countdown_position');
      if (!variant) {
        variant = Math.random() < 0.5 ? 'A' : 'B'; // 50/50 split
        localStorage.setItem('ab_test_urgency_countdown_position', variant);
      }
      setTestVariant(variant as 'A' | 'B');

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ab_test_view', {
          'test_name': 'urgency_countdown_position',
          'variant': variant
        });
      } else if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          'event': 'ab_test_view',
          'test_name': 'urgency_countdown_position',
          'variant': variant
        });
      }
      hasTestAssignedRef.current = true;
    }
  }, []);
  // --- FIM: LÓGICA DO TESTE A/B ---

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  useEffect(() => {
    if (!primaryStyle) return;
    window.scrollTo(0, 0);

    const criticalImages = [globalStyles.logo || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'];
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const { category } = primaryStyle;
    const { image, guideImage } = styleConfig[category];
    const styleImg = new Image();
    styleImg.src = `${image}?q=auto:best&f=auto&w=238`;
    styleImg.onload = () => setImagesLoaded(prev => ({ ...prev, style: true }));
    const guideImg = new Image();
    guideImg.src = `${guideImage}?q=auto:best&f=auto&w=540`;
    guideImg.onload = () => setImagesLoaded(prev => ({ ...prev, guide: true }));
  }, [primaryStyle, globalStyles.logo]);

  useEffect(() => {
    if (imagesLoaded.style && imagesLoaded.guide) completeLoading();
  }, [imagesLoaded, completeLoading]);

  if (!primaryStyle) return <ErrorState />;
  if (isLoading) return <ResultSkeleton />;

  const { category } = primaryStyle;
  const { image, guideImage, description } = styleConfig[category];

  const handleCTAClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'checkout_initiated', { 'test_name': 'urgency_countdown_position', 'variant': testVariant, 'event_category': 'ecommerce', 'event_label': `CTA_Click_${category}` });
    } else if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ 'event': 'checkout_initiated', 'test_name': 'urgency_countdown_position', 'variant': testVariant, 'event_category': 'ecommerce', 'event_label': `CTA_Click_${category}` });
    }
    trackButtonClick('checkout_button', 'Iniciar Checkout', 'results_page');
    window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
  };

  // --- INÍCIO: COMPONENTE StyleGuidesVisual ANINHADO ---
  // Remova o StyleGuidesVisual.tsx se você não precisar mais dele como arquivo separado
  interface StyleGuidesVisualProps {
    primaryGuideImage: string;
    category: string;
    secondaryStyles: StyleResult[];
    isLowPerformance: boolean; // Para controlar animações
  }

  const StyleGuidesVisual: React.FC<StyleGuidesVisualProps> = ({
    primaryGuideImage,
    category,
    secondaryStyles,
    isLowPerformance,
  }) => {
    // Filtrar até 2 estilos secundários para miniaturas, garantindo que tenham guideImage no styleConfig
    const secondaryGuideImages = secondaryStyles
      .filter(style => styleConfig[style.category]?.guideImage) // Garante que a imagem exista
      .slice(0, 2) // Limita a 2 miniaturas
      .map(style => ({
        src: `${styleConfig[style.category].guideImage}?q=auto:best&f=auto&w=80`, // Miniatura de 80px
        alt: `Guia de Estilo ${style.category}`
      }));

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-8 max-w-[600px] mx-auto relative">
        {/* Imagem do Guia Principal */}
        <img
          src={`${primaryGuideImage}?q=auto:best&f=auto&w=540`}
          alt={`Guia de Estilo ${category}`}
          loading="lazy"
          className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 max-w-[300px] md:max-w-[400px] flex-shrink-0" // Ajuste max-w para desktop
          width="540" height="auto" // Mantém o width/height para acessibilidade
        />

        {/* Miniaturas dos Guias Secundários (apenas se houver) */}
        {secondaryGuideImages.length > 0 && (
          <div className="flex flex-row md:flex-col gap-2 md:gap-3 justify-center md:justify-start flex-wrap">
            {secondaryGuideImages.map((miniature, index) => (
              <img
                key={index}
                src={miniature.src}
                alt={miniature.alt}
                loading="lazy"
                className="w-[60px] h-auto rounded-md shadow-sm border border-[#B89B7A]/20 hover:scale-105 transition-transform duration-300" // Miniaturas menores
                width="80" height="auto"
              />
            ))}
          </div>
        )}

        {/* Elegant badge (mantido na imagem principal, mas ajustado o posicionamento se for dentro deste componente) */}
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium transform rotate-12">
          Exclusivo
        </div>
      </div>
    );
  };
  // --- FIM: COMPONENTE StyleGuidesVisual ANINHADO ---

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundColor: globalStyles.backgroundColor || '#fffaf7',
      color: globalStyles.textColor || '#432818',
      fontFamily: globalStyles.fontFamily || 'inherit'
    }}>
      {/* Decorative background elements - Mantidos, pois são sutis e adicionam profundidade */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#B89B7A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#aa6b5d]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <Header primaryStyle={primaryStyle} logoHeight={globalStyles.logoHeight} logo={globalStyles.logo} logoAlt={globalStyles.logoAlt} userName={user?.userName} className="mb-0" />

      <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
        <Card className="p-4 sm:p-6 md:p-8 mb-8 md:mb-12 bg-white border-[#B89B7A]/10 shadow-sm -mt-4 sm:-mt-6 md:-mt-8">
            <AnimatedWrapper animation="fade" show={true} duration={600} delay={100}>
                <PersonalizedHook 
                    styleCategory={category}
                    userName={user?.userName}
                    onCTAClick={handleCTAClick}
                />
            </AnimatedWrapper>

            {testVariant === 'A' && (
                <AnimatedWrapper animation="fade" show={true} duration={400} delay={200} className="mt-6 md:mt-8">
                    <UrgencyCountdown styleCategory={category} />
                </AnimatedWrapper>
            )}
        </Card>

        {/* PROVA SOCIAL: Style-Specific Social Proof (Mantenha comentado ou remova se não for usar) */}
        {/*
        <AnimatedWrapper animation="fade" show={true} duration={400} delay={300} className="mb-8 md:mb-12">
          <StyleSpecificProof 
            styleCategory={category}
            userName={user?.userName}
          />
        </AnimatedWrapper>
        */}

        {/* ATTENTION: Primary Style Card - Seção principal de descrição do estilo */}
        <Card className="p-6 mb-12 md:mb-16 bg-white shadow-md border border-[#B89B7A]/20 card-elegant">
          <AnimatedWrapper animation="fade" show={true} duration={600} delay={300}>
            <div className="text-center mb-8">
              <div className="max-w-md mx-auto mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#8F7A6A]">
                    Seu estilo predominante
                  </span>
                  <span className="text-[#aa6b5d] font-medium">{primaryStyle.percentage}%</span>
                </div>
                <Progress value={primaryStyle.percentage} className="h-2 bg-[#F3E8E6]" indicatorClassName="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={400}>
                  <p className="text-[#432818] leading-relaxed">{description}</p>
                </AnimatedWrapper>
                <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={600}>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-[#B89B7A]/10 glass-panel">
                    <h3 className="text-lg font-medium text-[#432818] mb-2">Estilos que Também Influenciam Você</h3>
                    <SecondaryStylesSection secondaryStyles={secondaryStyles} />
                  </div>
                </AnimatedWrapper>
              </div>
              <AnimatedWrapper animation={isLowPerformance ? 'none' : 'scale'} show={true} duration={500} delay={500}>
                {/* AQUI ESTÁ A IMAGEM DO ESTILO PREDOMINANTE. Ela deve ser menor no mobile */}
                <div className="max-w-[238px] mx-auto relative">
                  <img src={`${image}?q=auto:best&f=auto&w=238`} alt={`Estilo ${category}`} 
                       className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 max-w-xs sm:max-w-[238px]" /* max-w-xs para mobile, sm:max-w-[238px] para sm+ */
                       loading="eager" fetchPriority="high" width="238" height="auto" />
                  {/* Elegant decorative corner */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
                </div>
              </AnimatedWrapper>
            </div>

            {/* --- AJUSTADO AQUI: A SEÇÃO DA IMAGEM DO GUIA PRINCIPAL E AS MINIATURAS --- */}
            {/* Agora usando o componente StyleGuidesVisual aninhado */}
            <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={800}>
              <StyleGuidesVisual 
                primaryGuideImage={guideImage} 
                category={category} 
                secondaryStyles={secondaryStyles} 
                isLowPerformance={isLowPerformance} 
              />
            </AnimatedWrapper>
            
            {/* CTA Section after Style Guide */}
            <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={850}>
              <div className="mt-8 text-center">
                <h4 className="text-xl md:text-2xl font-semibold text-[#432818] mb-4 font-playfair">
                  Transforme Sua Imagem,{" "}
                  <span className="text-[#aa6b5d]">Revele Sua Essência</span>
                </h4>
                <p className="text-gray-700 mb-6 leading-relaxed max-w-2xl mx-auto">
                  Seu estilo é uma ferramenta poderosa. Não se trata apenas de
                  roupas, mas de comunicar quem você é e aspira ser. Com a
                  orientação certa, você pode:
                </p>
                <ul className="space-y-3 text-gray-700 mb-8 max-w-xl mx-auto text-left">
                  {[
                    {
                      text: "Construir looks com intenção e identidade visual.",
                    },
                    {
                      text: "Utilizar cores, modelagens e tecidos a seu favor.",
                    },
                    {
                      text: "Alinhar sua imagem aos seus objetivos pessoais e profissionais.",
                    },
                    {
                      text: "Desenvolver um guarda-roupa funcional e inteligente.",
                    },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#B89B7A] mr-3 mt-1 flex-shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleCTAClick}
                  className="text-white py-3 px-8 rounded-lg transition-all duration-300 text-base font-medium"
                  style={{
                    background: "linear-gradient(to right, #aa6b5d, #B89B7A)",
                    boxShadow: "0 4px 14px rgba(184, 155, 122, 0.3)",
                  }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isButtonHovered ? "scale-110" : ""
                      }`}
                    />
                    <span>Quero Transformar Minha Imagem</span>
                  </span>
                </Button>
              </div>
            </AnimatedWrapper>
          </AnimatedWrapper>
        </Card>

        {/* INTEREST: Before/After Transformation Section */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={700} className="mb-8 md:mb-12">
          <BeforeAfterTransformation />
        </AnimatedWrapper>

        {/* --- INÍCIO: RENDERIZAÇÃO CONDICIONAL PARA O TESTE A/B (Variante B) --- */}
        {/* UrgencyCountdown para a Variante B, mais abaixo na página */}
        {testVariant === 'B' && (
          <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={750} className="mb-8 md:mb-12">
            <UrgencyCountdown styleCategory={category} />
          </AnimatedWrapper>
        )}
        {/* --- FIM: RENDERIZAÇÃO CONDICIONAL PARA O TESTE A/B (Variante B) --- */}


        {/* INTEREST: Motivation Section */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={800} className="mb-8 md:mb-12">
          <MotivationSection />
        </AnimatedWrapper>

        {/* INTEREST: Bonus Section */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={850} className="mb-8 md:mb-12">
          <BonusSection />
        </AnimatedWrapper>

        {/* DESIRE: Testimonials */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={900} className="mb-8 md:mb-12">
          <Testimonials />
        </AnimatedWrapper>

        {/* DESIRE: Featured CTA (Green) */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={950} className="mb-8 md:mb-12">
          <div className="text-center my-10">
            <div className="bg-[#f9f4ef] p-6 rounded-lg border border-[#B89B7A]/10 mb-6">
              <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">
                Descubra Como Aplicar Seu Estilo na Prática
              </h3>
              <div className="flex justify-center">
                <ArrowDown className="w-8 h-8 text-[#B89B7A] animate-bounce" />
              </div>
            </div>
            
            <Button onClick={handleCTAClick} className="text-white py-4 px-6 rounded-md btn-cta-green" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} style={{
              background: "linear-gradient(to right, #4CAF50, #45a049)",
              boxShadow: "0 4px 14px rgba(76, 175, 80, 0.4)"
            }}>
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
                Quero meu Guia de Estilo Agora
              </span>
            </Button>
            
            <div className="mt-2 inline-block bg-[#aa6b5d]/10 px-3 py-1 rounded-full">
              <p className="text-sm text-[#aa6b5d] font-medium flex items-center justify-center gap-1">
                {/* Content was empty, removed extra spaces */}
              </p>
            </div>
            
            <SecurePurchaseElement />
          </div>
        </AnimatedWrapper>

        {/* DESIRE: Guarantee Section */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={1000} className="mb-8 md:mb-12">
          <GuaranteeSection />
        </AnimatedWrapper>

        {/* DESIRE: Mentor and Trust Elements */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={1050} className="mb-8 md:mb-12">
          <MentorSection />
        </AnimatedWrapper>

        {/* ACTION: Final Value Proposition and CTA */}
        <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={1100} className="mt-8 mb-12 md:mt-10 md:mb-16">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-4">
              Vista-se de Você — na Prática
            </h2>
            <div className="elegant-divider"></div>
            <p className="text-[#432818] mb-6 max-w-xl mx-auto">
              Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção. 
              O Guia da Gisele Galvão foi criado para mulheres como você — que querem se vestir 
              com autenticidade e transformar sua imagem em ferramenta de poder.
            </p>

            <div className="bg-[#fffaf7] p-6 rounded-lg mb-6 border border-[#B89B7A]/10 glass-panel">
              <h3 className="text-xl font-medium text-[#aa6b5d] mb-4">O Guia de Estilo e Imagem + Bônus Exclusivos</h3>
              <ul className="space-y-3 text-left max-w-xl mx-auto text-[#432818]">
                {["Looks com intenção e identidade", "Cores, modelagens e tecidos a seu favor", "Imagem alinhada aos seus objetivos", "Guarda-roupa funcional, sem compras por impulso"].map((item, index) => <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white mr-2 mt-0.5">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </li>)}
              </ul>
            </div>

            {/* ANCORAGEM DE PREÇO: Strategic Price Anchoring */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#B89B7A]/20 card-elegant mb-8 max-w-md mx-auto">
              <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">O Que Você Recebe Hoje</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10">
                  <span>Guia Principal</span>
                  <span className="font-medium">R$ 79,00</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10">
                  <span>Bônus - Peças-chave</span>
                  <span className="font-medium">R$ 67,00</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10">
                  <span>Bônus - Visagismo Facial</span>
                  <span className="font-medium">R$ 29,00</span>
                </div>
                <div className="flex justify-between items-center p-2 pt-3 font-bold">
                  <span>Valor Total</span>
                  <div className="relative">
                    <span>R$ 175,00</span>
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff5a5a] transform -translate-y-1/2 -rotate-3"></div>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-[#4CAF50]/10 to-[#45a049]/10 rounded-lg border border-[#4CAF50]/30">
                <p className="text-sm text-[#4CAF50] uppercase font-medium">Especial para {category}: -78% HOJE</p>
                <p className="text-4xl font-bold text-[#4CAF50]">R$ 39,00</p>
                <p className="text-xs text-[#3a3a3a]/60 mt-1">ou 5x de R$ 8,83</p>
                <div className="mt-2 bg-[#ff6b6b]/10 rounded-full px-3 py-1 inline-block">
                  <p className="text-xs text-[#ff6b6b] font-medium">💥 Preço volta para R$ 175 em breve</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCTAClick} 
              className="text-white py-6 px-3 sm:px-8 md:px-10 rounded-lg shadow-lg transition-all duration-300 transform-none hover:scale-105 active:scale-95
                         sm:transform hover:scale-105 sm:shadow-lg sm:hover:shadow-xl
                         min-w-0" 
              style={{
                background: "linear-gradient(to right, #458B74, #3D7A65)", // Verde floresta mais elegante
                boxShadow: "0 2px 8px rgba(61, 122, 101, 0.2)" // Sombra mais suave
              }} 
              onMouseEnter={() => setIsButtonHovered(true)} 
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <span className="flex flex-col sm:flex-row items-center justify-center 
                                 gap-1 sm:gap-3 
                                 text-[0.65rem] xs:text-xs sm:text-base md:text-lg lg:text-xl 
                                 leading-none text-center font-semibold">
                {/* ICON HIDDEN ON SMALL SCREENS, VISIBLE ON SM AND UP */}
                <ShoppingCart className={`hidden sm:block w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-120' : ''}`} />
                <span>GARANTIR MEU GUIA {category.toUpperCase()} AGORA</span>
              </span>
            </Button>
            
            <div className="text-center mb-4">
              <div className="bg-[#ff6b6b]/10 rounded-full px-2 py-1 inline-block border border-[#ff6b6b]/20">
                <p className="text-[0.65rem] xs:text-xs sm:text-sm text-[#ff6b6b] font-medium animate-pulse leading-tight tracking-tight px-1 py-0.5">
                  ⚡ Esta oferta expira ao sair desta página
                </p>
              </div>
            </div>
            
            <SecurePurchaseElement />

            <p className="text-sm text-[#aa6b5d] mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Oferta exclusiva para {category} - Apenas nesta página</span>
            </p>
          </div>
        </AnimatedWrapper>
      </div>

      <BuildInfo />
    </div>
  );
};

export default ResultPage;