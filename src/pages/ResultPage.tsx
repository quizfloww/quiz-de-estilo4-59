import React, { useEffect, useState, useRef } from 'react';

importar { useQuiz } de '@/hooks/useQuiz';

importar { useGlobalStyles } de '@/hooks/useGlobalStyles';

importar { Cabeçalho } de '@/componentes/resultado/Cabeçalho';

importar { styleConfig } de '@/config/styleConfig';

importar { Progresso } de '@/componentes/ui/progress';

importar { Cartão } de '@/componentes/ui/cartão';

importar { ShoppingCart, CheckCircle, ArrowDown, Lock } de 'lucide-react';

importar { AnimatedWrapper } de '@/components/ui/animated-wrapper';

importar SecondaryStylesSection de '@/components/quiz-result/SecondaryStylesSection';

importar ErrorState de '@/components/result/ErrorState';

importar MotivationSection de '@/components/result/MotivationSection';

importar MentorSection de '@/components/result/MentorSection';

importar GuaranteeSection de '@/components/result/GuaranteeSection';

importar depoimentos de '@/components/quiz-result/sales/Testimonials';

importar BeforeAfterTransformation de '@/components/result/BeforeAfterTransformation';

importar BonusSection de '@/components/result/BonusSection';

importar { Botão } de '@/componentes/ui/botão';

importar { useLoadingState } de '@/hooks/useLoadingState';

importar { useIsLowPerformanceDevice } de '@/hooks/use-mobile';

importar ResultSkeleton de '@/components/result/ResultSkeleton';

importar { trackButtonClick } de '@/utils/analytics';

importar BuildInfo de '@/components/BuildInfo';

importar SecurePurchaseElement de '@/components/result/SecurePurchaseElement';

importar { useAuth } de '@/context/AuthContext';

importar PersonalizedHook de '@/components/result/PersonalizedHook';

importar UrgencyCountdown de '@/components/result/UrgencyCountdown';

// importar StyleSpecificProof de '@/components/result/StyleSpecificProof'; 



// Importe StyleResult, pois será usado no StyleGuidesVisual aninhado

importar { StyleResult } de '@/types/quiz'; 



// Remova 'export' da declaração 'export const ResultPage'

const Página de Resultados: React.FC = () => { 

  constante {

    estilo primário,

    estilos secundários

  } = useQuiz();

  constante {

    estilos globais

  } = useGlobalStyles();

  constante {

    usuário

  } = useAuth();

  const [imagensCarregadas, setImagesCarregadas] = useState({

    estilo: falso,

    guia: falso

  });

  const isLowPerformance = useIsLowPerformanceDevice();

  constante {

    está carregando,

    carregamento completo

  } = useLoadingState({

    minDuration: éBaixoDesempenho ? 400 : 800,

    disableTransitions: éBaixoDesempenho

  });



  // --- INÍCIO: LÓGICA DO TESTE A/B ---

  const [testVariant, setTestVariant] = useState<'A' | 'B'>('A');

  const hasTestAssignedRef = useRef(false);



  useEffect(() => {

    se (!hasTestAssignedRef.current) {

      deixe variante = localStorage.getItem('ab_test_urgency_countdown_position');

      se (!variante) {

        variante = Math.random() < 0,5 ? 'A' : 'B'; // divisão 50/50

        localStorage.setItem('ab_test_urgency_countdown_position', variante);

      }

      setTestVariant(variante como 'A' | 'B');



      se (tipo de janela !== 'indefinido' && (janela como qualquer).gtag) {

        (janela como qualquer).gtag('evento', 'ab_test_view', {

          'nome_do_teste': 'posição_de_contagem_regressiva_de_urgência',

          'variante': variante

        });

      } senão se (tipo de janela !== 'indefinido' && (janela como qualquer).dataLayer) {

        (janela como qualquer).dataLayer.push({

          'evento': 'ab_test_view',

          'nome_do_teste': 'posição_de_contagem_regressiva_de_urgência',

          'variante': variante

        });

      }

      hasTestAssignedRef.current = verdadeiro;

    }

  }, []);

  // --- FIM: LÓGICA DO TESTE A/B ---



  const [isButtonHovered, setIsButtonHovered] = useState(falso);

  useEffect(() => {

    se (!primaryStyle) retornar;

    janela.scrollTo(0, 0);



    const criticalImages = [globalStyles.logo || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'];

    criticalImages.forEach(origem => {

      const img = nova Imagem();

      img.src = fonte;

    });



    const { categoria } = estiloprimário;

    const { imagem, guideImage } = styleConfig[categoria];

    const styleImg = nova Imagem();

    styleImg.src = `${image}?q=auto:melhor&f=auto&w=238`;

    styleImg.onload = () => setImagesLoaded(prev => ({ ...prev, style: true }));

    const guideImg = nova Imagem();

    guideImg.src = `${guideImage}?q=auto:best&f=auto&w=540`;

    guideImg.onload = () => setImagesLoaded(prev => ({ ...prev, guia: true }));

  }, [estiloprimário, globalStyles.logo]);



  useEffect(() => {

    se (imagesLoaded.style && imagesLoaded.guide) completeLoading();

  }, [imagens carregadas, carregamento completo]);



  se (!primaryStyle) retornar <ErrorState />;

  se (isLoading) retornar <ResultSkeleton />;



  const { categoria } = estiloprimário;

  const { imagem, guideImage, descrição } = styleConfig[categoria];



  const handleCTAClick = () => {

    se (tipo de janela !== 'indefinido' && (janela como qualquer).gtag) {

      (janela como qualquer).gtag('evento', 'checkout_initiated', { 'nome_do_teste': 'posição_de_contagem_regressiva_de_urgência', 'variante': testVariant, 'categoria_do_evento': 'ecommerce', 'rótulo_do_evento': `CTA_Click_${category}` });

    } senão se (tipo de janela !== 'indefinido' && (janela como qualquer).dataLayer) {

      (janela como qualquer).dataLayer.push({ 'evento': 'checkout_initiated', 'nome_do_teste': 'posição_de_contagem_regressiva_de_urgência', 'variante': testVariant, 'categoria_do_evento': 'ecommerce', 'rótulo_do_evento': `CTA_Click_${category}` });

    }

    trackButtonClick('checkout_button', 'Iniciar checkout', 'results_page');

    window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';

  };



  // --- INÍCIO: COMPONENTE StyleGuidesVisual ANINHADO ---

  // Remova o StyleGuidesVisual.tsx se você não precisar mais dele como arquivo separado

  interface Guias de Estilo Visual Props {

    ImagemGuiaPrimária: string;

    categoria: string;

    Estilossecundários: StyleResult[];

    isLowPerformance: boolean; // Para controlar animações

  }



  const StyleGuidesVisual: React.FC<StyleGuidesVisualProps> = ({

    ImagemGuiaPrimária,

    categoria,

    estilos secundários,

    éBaixoDesempenho,

  }) => {

    // Filtrar até 2 estilos secundários para miniaturas, garantindo que tenham guideImage no styleConfig

    const secondaryGuideImages = estilossecundários

      .filter(style => styleConfig[style.category]?.guideImage) // Garante que a imagem exista

      .slice(0, 2) // Limita a 2 miniaturas

      .map(estilo => ({

        src: `${styleConfig[style.category].guideImage}?q=auto:best&f=auto&w=80`, // Miniatura de 80px

        alt: `Guia de Estilo ${style.category}`

      }));



    retornar (

      <div className="flex flex-col md:flex-row itens-centro justificar-centro lacuna-4 md:lacuna-6 mt-8 max-w-[600px] mx-auto relativo">

        {/* Imagem do Guia Principal */}

        <img

          src={`${primaryGuideImage}?q=auto:melhor&f=auto&w=540`}

          alt={`Guia de Estilo ${category}`}

          carregando="preguiçoso"

          className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 max-w-[300px] md:max-w-[400px] flex-shrink-0" // Ajuste max-w para desktop

          width="540" height="auto" // Mantém o width/height para acessibilidade

        />



        {/* Miniaturas dos Guias Secundários (apenas se houver) */}

        {secondaryGuideImages.length > 0 && (

          <div className="flex flex-row md:flex-col gap-2 md:gap-3 justify-center md:justify-start flex-wrap">

            {secondaryGuideImages.map((miniatura, índice) => (

              <img

                chave={índice}

                fonte={miniatura.fonte}

                alt={miniatura.alt}

                carregando="preguiçoso"

                className="w-[60px] h-auto rounded-md shadow-sm border border-[#B89B7A]/20 hover:scale-105 transition-transform duration-300" // Miniaturas menores

                largura="80" altura="automático"

              />

            ))}

          </div>

        )}



        {/* Elegant badge (mantido na imagem principal, mas ajustado o posicionamento se for dentro deste componente) */}

        <div className="absoluto -topo-4 -direita-4 gradiente-de-fundo-para-r de-[#B89B7A] para-[#aa6b5d] texto-branco px-4 py-2 arredondado-completo sombra-lg texto-sm fonte-média transformar girar-12">

          Exclusivo

        </div>

      </div>

    );

  };

  // --- FIM: COMPONENTE StyleGuidesVisual ANINHADO ---



  retornar (

    <div className="min-h-screen relativo estouro-oculto" style={{

      Cor de fundo: globalStyles.backgroundColor || '#fffaf7',

      cor: globalStyles.textColor || '#432818',

      fontFamily: globalStyles.fontFamily || 'herdar'

    }}>

      {/* Decorative background elements - Mantidos, pois são sutis e adicionam profundidade */}

      <div className="absoluto superior-0 direita-0 l-1/3 a-1/3 bg-[#B89B7A]/5 arredondado-completo desfoque-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="absoluto inferior-0 esquerdo-0 l-1/4 a-1/4 bg-[#aa6b5d]/5 arredondado-completo desfoque-3xl traduzir-y-1/2 - traduzir-x-1/2"></div>

      

      <Cabeçalho primaryStyle={primaryStyle} logoHeight={globalStyles.logoHeight} logo={globalStyles.logo} logoAlt={globalStyles.logoAlt} userName={user?.userName} className="mb-0" />



      <div className="container mx-auto px-4 py-6 max-w-4xl relativo z-10">

        <Card className="p-4 sm:p-6 md:p-8 mb-8 md:mb-12 bg-borda branca-[#B89B7A]/10 sombra-sm -mt-4 sm:-mt-6 md:-mt-8">

            <AnimatedWrapper animação="fade" show={true} duração={600} atraso={100}>

                <Gancho personalizado 

                    styleCategory={categoria}

                    Nome do usuário={usuário?.Nome do usuário}

                    onCTAClick={handleCTAClick}

                />

            </AnimatedWrapper>



            {testVariant === 'A' && (

                <AnimatedWrapper animação="fade" show={true} duração={400} atraso={200} className="mt-6 md:mt-8">

                    <UrgencyCountdown styleCategory={categoria} />

                </AnimatedWrapper>

            )}

        </Cartão>



        {/* PROVA SOCIAL: Style-Specific Social Proof (Mantenha comentado ou remova se não for usar) */}

        {/*

        <AnimatedWrapper animação="fade" show={true} duração={400} atraso={300} className="mb-8 md:mb-12">

          <Prova Específica de Estilo 

            styleCategory={categoria}

            Nome do usuário={usuário?.Nome do usuário}

          />

        </AnimatedWrapper>

        */}



        {/* ATTENTION: Primary Style Card - Seção principal de descrição do estilo */}

        <Card className="p-6 mb-12 md:mb-16 bg-branco sombra-md borda borda-[#B89B7A]/20 cartão-elegante">

          <AnimatedWrapper animação="fade" show={true} duração={600} atraso={300}>

            <div className="text-center mb-8">

              <div className="max-w-md mx-auto mb-6">

                <div className="flex justificar-entre-itens-centro mb-2">

                  <span className="texto-sm texto-[#8F7A6A]">

                    Seu estilo predominante

                  </span>

                  <span className="text-[#aa6b5d] font-medium">{primaryStyle.percentage}%</span>

                </div>

                <Valor de progresso={primaryStyle.percentage} className="h-2 bg-[#F3E8E6]" indicatorClassName="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]" />

              </div>

            </div>



            <div className="grid md:grid-cols-2 gap-8 itens-centro">

              <div className="espaço-y-4">

                <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} show={true} duração={400} atraso={400}>

                  <p className="text-[#432818] leading-relaxed">{description}</p>

                </AnimatedWrapper>

                <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} show={true} duração={400} atraso={600}>

                  <div className="bg-branco arredondado-lg p-4 sombra-sm borda borda-[#B89B7A]/10 painel-de-vidro">

                    <h3 className="text-lg font-medium text-[#432818] mb-2">Estilos que Também Influenciam Você</h3>

                    <SeçãoEstilosSecundáriosEstilosSecundários={EstilosSecundários} />

                  </div>

                </AnimatedWrapper>

              </div>

              <AnimatedWrapper animação={isLowPerformance ? 'none' : 'scale'} show={true} duração={500} atraso={500}>

                {/* AQUI ESTÁ A IMAGEM DO ESTILO PREDOMINANTE. Ela deve ser menor no mobile */}

                <div className="max-w-[238px] mx-auto relativo">

                  <img src={`${image}?q=auto:best&f=auto&w=238`} alt={`Estilo ${category}`} 

                       className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 max-w-xs sm:max-w-[238px]" /* max-w-xs para dispositivos móveis, sm:max-w-[238px] para sm+ */

                       carregando="ansioso" fetchPriority="alto" largura="238" altura="automático" />

                  {/* Cantinho decorativo elegante */}

                  <div className="absoluto -topo-2 -direita-2 l-8 h-8 borda-t-2 borda-r-2 borda-[#B89B7A]"></div>

                  <div className="absoluto -inferior-2 -esquerda-2 l-8 h-8 borda-b-2 borda-l-2 borda-[#B89B7A]"></div>

                </div>

              </AnimatedWrapper>

            </div>



            {/* --- AJUSTADO AQUI: A SEÇÃO DA IMAGEM DO GUIA PRINCIPAL E AS MINIATURAS --- */}

            {/* Agora usando o componente StyleGuidesVisual aninhado */}

            <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} show={true} duração={400} atraso={800}>

              <Guias de EstiloVisual 

                ImagemGuiaPrimária={ImagemGuia} 

                categoria={categoria} 

                EstilosSecundários={EstilosSecundários} 

                isLowPerformance={isLowPerformance} 

              />

            </AnimatedWrapper>

            

            {/* Seção CTA após o Guia de Estilo */}

            <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={850}>

              <div className="mt-8 text-center">

                <h4 className="texto-xl md:texto-2xl fonte-semibold texto-[#432818] mb-4 fonte-playfair">

                  Transforme Sua Imagem,{" "}

                  <span className="text-[#aa6b5d]">Revele Sua Essência</span>

                </h4>

                <p className="text-gray-700 mb-6 leading-relaxed max-w-2xl mx-auto">

                  Seu estilo é uma ferramenta poderosa. Não se trata apenas de

                  roupas, mas de comunicar quem você é e aspira ser. Com a

                  orientação certa, você pode:

                </p>

                <ul className="espaço-y-3 texto-cinza-700 mb-8 max-w-xl mx-auto texto-esquerda">

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

                    <li key={idx} className="itens flexíveis-início">

                      <CheckCircle className="h-5 w-5 texto-[#B89B7A] mr-3 mt-1 flex-shrink-0" />

                      <span>{item.text}</span>

                    </li>

                  ))}

                </ul>

                <Botão

                  onClick={manipularCTAClick}

                  className="texto-branco py-3 px-8 arredondado-lg transição-tudo duração-300 texto-base fonte-média"

                  estilo={{

                    fundo: "gradiente linear(para a direita, #aa6b5d, #B89B7A)",

                    boxShadow: "0 4px 14px rgba(184, 155, 122, 0,3)",

                  }}

                  onMouseEnter={() => setIsButtonHovered(verdadeiro)}

                  onMouseLeave={() => setIsButtonHovered(falso)}

                >

                  <span className="flex items-center justify-center gap-2">

                    <Carrinho de compras

                      className={`w-5 h-5 duração da transição-transformação-300 ${

                        isButtonHovered ? "escala-110" : ""

                      }`}

                    />

                    <span>Quero Transformar Minha Imagem</span>

                  </span>

                </Botão>

              </div>

            </AnimatedWrapper>

          </AnimatedWrapper>

        </Cartão>



        {/* INTERESSE: Seção de Transformação Antes/Depois */}

        <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={700} className="mb-8 md:mb-12">

          <AntesDepoisTransformação />

        </AnimatedWrapper>



        {/* --- INÍCIO: RENDERIZAÇÃO CONDICIONAL PARA O TESTE A/B (Variante B) --- */}

        {/* UrgencyCountdown para a Variante B, mais abaixo na página */}

        {testVariant === 'B' && (

          <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={750} className="mb-8 md:mb-12">

            <UrgencyCountdown styleCategory={categoria} />

          </AnimatedWrapper>

        )}

        {/* --- FIM: RENDERIZAÇÃO CONDICIONAL PARA O TESTE A/B (Variante B) --- */}





        {/* INTERESSE: Seção de Motivação */}

        <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={800} className="mb-8 md:mb-12">

          <Seção de Motivação />

        </AnimatedWrapper>



        {/* JUROS: Seção Bônus */}

        <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={850} className="mb-8 md:mb-12">

          <Seção de Bônus />

        </AnimatedWrapper>



        {/* DESIRE: Depoimentos */}

        <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={900} className="mb-8 md:mb-12">

          <Testemunhos />

        </AnimatedWrapper>



        {/* DESIRE: CTA em destaque (Verde) */}

        <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={950} className="mb-8 md:mb-12">

          <div className="text-center meu-10">

            <div className="bg-[#f9f4ef] p-6 borda arredondada-lg borda-[#B89B7A]/10 mb-6">

              <h3 className="texto-xl fonte-média centro-texto texto-[#aa6b5d] mb-4">

                Descubra Como Aplicar Seu Estilo na Prática

              </h3>

              <div className="flex justify-center">

                <ArrowDown className="w-8 h-8 texto-[#B89B7A] animação-salto" />

              </div>

            </div>

            

            <Botão onClick={handleCTAClick} className="texto-branco py-4 px-6 arredondado-md btn-cta-verde" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} style={{

              fundo: "gradiente linear(para a direita, #4CAF50, #45a049)",

              boxShadow: "0 4px 14px rgba(76, 175, 80, 0,4)"

            }}>

              <span className="flex items-center justify-center gap-2">

                <ShoppingCart className={`w-5 h-5 transição-transformação duração-300 ${isButtonHovered ? 'scale-110' : ''}`} />

                Quero meu Guia de Estilo Agora

              </span>

            </Botão>

            

            <div className="mt-2 inline-block bg-[#aa6b5d]/10 px-3 py-1 arredondado-completo">

              <p className="text-sm text-[#aa6b5d] fonte-média flex itens-centro justificar-centro lacuna-1">

                {/* O conteúdo estava vazio, espaços extras removidos */}

              </p>

            </div>

            

            <ElementoCompraSegura />

          </div>

        </AnimatedWrapper>



        {/* DESIRE: Seção de Garantia */}

        <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={1000} className="mb-8 md:mb-12">

          <Seção de Garantia />

        </AnimatedWrapper>



        {/* DESEJO: Elementos de Mentoria e Confiança */}

        <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={1050} className="mb-8 md:mb-12">

          <MentorSection />

        </AnimatedWrapper>



        {/* AÇÃO: Proposta de Valor Final e CTA */}

        <AnimatedWrapper animação={isLowPerformance ? 'none' : 'fade'} mostrar={true} duração={400} atraso={1100} className="mt-8 mb-12 md:mt-10 md:mb-16">

          <div className="text-center">

            <h2 className="texto-2xl md:texto-3xl fonte-playfair texto-[#aa6b5d] mb-4">

              Vista-se de Você — na Prática

            </h2>

            <div className="elegante-divider"></div>

            <p className="text-[#432818] mb-6 max-w-xl mx-auto">

              Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção. 

              O Guia da Gisele Galvão foi criado para mulheres como você — que querem se vestir 

              com autenticidade e transformar sua imagem em ferramenta de poder.

            </p>



            <div className="bg-[#fffaf7] p-6 arredondado-lg mb-6 borda borda-[#B89B7A]/10 painel-de-vidro">

              <h3 className="text-xl font-medium text-[#aa6b5d] mb-4">O Guia de Estilo e Imagem + Bônus Exclusivos</h3>

              <ul className="espaço-y-3 texto-esquerda max-w-xl mx-auto texto-[#432818]">

                {["Looks com intenção e identidade", "Cores, modelagens e tecidos a seu favor", "Imagem alinhada aos seus objetivos", "Guarda-roupa funcional, sem compras por impulso"].map((item, index) => <li key={index} className="flex items-start">

                    <div className="flex-shrink-0 h-5 w-5 bg-gradient-to-r de-[#B89B7A] para-[#aa6b5d] arredondado-completo flex itens-centro justificar-centro texto-branco mr-2 mt-0.5">

                      <NomedaclasseCheckCircle="h-3 w-3" />

                    </div>

                    <span>{item}</span>

                  </li>)}

              </ul>

            </div>



            {/* ANCORAGEM DE PREÇO: Strategic Price Anchoring */}

            <div className="bg-branco p-6 arredondado-lg sombra-md borda borda-[#B89B7A]/20 cartão-elegante mb-8 max-w-md mx-auto">

              <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">O Que Você Recebe Hoje</h3>

              

              <div className="espaço-y-3 mb-6">

                <div className="flex justificar-entre-itens-centro p-2 borda-b borda-[#B89B7A]/10">

                  <span>Guia Principal</span>

                  <span className="font-medium">R$ 79,00</span>

                </div>

                <div className="flex justificar-entre-itens-centro p-2 borda-b borda-[#B89B7A]/10">

                  <span>Bônus - Peças-chave</span>

                  <span className="font-medium">R$ 67,00</span>

                </div>

                <div className="flex justificar-entre-itens-centro p-2 borda-b borda-[#B89B7A]/10">

                  <span>Bônus - Visagismo Facial</span>

                  <span className="font-medium">R$ 29,00</span>

                </div>

                <div className="flex justificar-entre-itens-centro p-2 pt-3 fonte-negrito">

                  <span>Valor Total</span>

                  <div className="relativo">

                    <span>R$ 175,00</span>

                    <div className="absoluto superior-1/2 esquerda-0 direita-0 h-[2px] bg-[#ff5a5a] transformar -transferir-y-1/2 -rodar-3"></div>

                  </div>

                </div>

              </div>

              

              <div className="text-center p-4 bg-gradient-to-r de-[#4CAF50]/10 para-[#45a049]/10 arredondado-lg borda borda-[#4CAF50]/30">

                <p className="text-sm text-[#4CAF50] uppercase font-medium">Especial para {category}: -78% HOJE</p>

                <p className="text-4xl font-bold text-[#4CAF50]">R$ 39,00</p>

                <p className="text-xs text-[#3a3a3a]/60 mt-1">ou 5x de R$ 8,83</p>

                <div className="mt-2 bg-[#ff6b6b]/10 arredondado-completo px-3 py-1 bloco-em-linha">

                  <p className="text-xs text-[#ff6b6b] font-medium">💥 Preço volta para R$ 175 em breve</p>

                </div>

              </div>

            </div>



            <Botão 

              onClick={manipularCTAClick} 

              className="texto-branco py-6 px-3 sm:px-8 md:px-10 arredondado-lg sombra-lg transição-tudo duração-300 transformação-nenhum pairar:escala-105 ativo:escala-95

                         sm:transformar hover:escala-105 sm:sombra-lg sm:hover:sombra-xl

                         min-w-0" 

              estilo={{

                background: "linear-gradient(to right, #458B74, #3D7A65)", // Verde floresta mais elegante

                boxShadow: "0 2px 8px rgba(61, 122, 101, 0.2)" // Sombra mais suave

              }} 

              onMouseEnter={() => setIsButtonHovered(verdadeiro)} 

              onMouseLeave={() => setIsButtonHovered(falso)}

            >

              <span className="flex flex-col sm:flex-row itens-centro justificar-centro 

                                 lacuna-1 sm:lacuna-3 

                                 texto-[0,65rem] xs:texto-xs sm:texto-base md:texto-lg lg:texto-xl 

                                 entrelinhas-nenhum texto-centralizado fonte-semibold">

                {/* ÍCONE OCULTO EM TELAS PEQUENAS, VISÍVEL EM TELAS P OU SUPERIORES */}

                <ShoppingCart className={`oculto sm:bloco w-4 h-4 sm:w-5 sm:h-5 transição-transformação duração-300 ${isButtonHovered ? 'escala-120' : ''}`} />

                <span>GARANTIR MEU GUIA {category.toUpperCase()} AGORA</span>

              </span>

            </Botão>

            

            <div className="text-center mb-4">

              <div className="bg-[#ff6b6b]/10 arredondado-cheio px-2 py-1 bloco embutido borda borda-[#ff6b6b]/20">

                <p className="text-[0.65rem] xs:text-xs sm:text-sm text-[#ff6b6b] fonte-média animação-pulso entrelinha-estreita rastreamento-estreito px-1 py-0.5">

                  ⚡ Esta oferta expira ao sair desta página

                </p>

              </div>

            </div>

            

            <ElementoCompraSegura />



            <p className="text-sm text-[#aa6b5d] mt-2 flex itens-centro justificar-centro lacuna-1">

              <Bloquear classeNome="w-3 h-3" />

              <span>Oferta exclusiva para {category} - Apenas nesta página</span>

            </p>

          </div>

        </AnimatedWrapper>

      </div>



      <BuildInfo />

    </div>

  );

};



exportar página de resultados padrão;