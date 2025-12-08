import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelStage } from "@/hooks/usePublicFunnel";
import {
  ShoppingCart,
  Check,
  Shield,
  Clock,
  Gift,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DynamicOfferProps {
  stage: FunnelStage;
  userName: string;
  primaryStyleCategory?: string;
  onContinue?: () => void;
}

export const DynamicOffer: React.FC<DynamicOfferProps> = ({
  stage,
  userName,
  primaryStyleCategory,
  onContinue,
}) => {
  const config = (stage.config || {}) as Record<string, unknown>;
  const [showAllBonuses, setShowAllBonuses] = useState(false);

  // Config options
  const title =
    (config.offerTitle as string) ||
    (config.title as string) ||
    stage.title ||
    "Transforme Seu Estilo Hoje";
  const subtitle =
    (config.offerSubtitle as string) ||
    (config.subtitle as string) ||
    "Uma oferta exclusiva para você";
  const productName =
    (config.productName as string) || "Guia de Estilo Personalizado";
  const productDescription =
    (config.productDescription as string) ||
    "Descubra como aplicar seu estilo pessoal no dia a dia com nosso guia completo.";
  const productImageUrl = config.productImageUrl as string;
  const regularPrice = (config.regularPrice as string) || "R$ 175,00";
  const salePrice = (config.salePrice as string) || "R$ 39,00";
  const installments = (config.installments as string) || "4x de R$ 10,86";
  const ctaText = (config.ctaText as string) || "Quero Comprar Agora";
  const ctaUrl =
    (config.ctaUrl as string) ||
    "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912";
  const guaranteeDays = (config.guaranteeDays as number) || 7;
  const guaranteeText =
    (config.guaranteeText as string) ||
    `Garantia incondicional de ${guaranteeDays} dias. Se não ficar satisfeita por qualquer motivo, devolvemos 100% do seu investimento.`;

  // Benefits list
  const benefits = (config.benefits as string[]) || [
    "Guia completo do seu estilo predominante",
    "Paleta de cores personalizada",
    "Lista de peças essenciais para seu guarda-roupa",
    "Guia de combinações e dicas de styling",
    "Acesso vitalício a atualizações",
  ];

  // Bonuses list
  const bonuses = (config.bonuses as Array<{
    title: string;
    value: string;
  }>) || [
    { title: "Guia de Maquiagem", value: "R$ 47,00" },
    { title: "Guia de Acessórios", value: "R$ 37,00" },
    { title: "Checklist de Compras Inteligentes", value: "R$ 27,00" },
  ];

  // FAQ items
  const faqItems = (config.faqItems as Array<{
    question: string;
    answer: string;
  }>) || [
    {
      question: "Como vou receber meu guia após a compra?",
      answer:
        "Imediatamente após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso.",
    },
    {
      question: "O guia é personalizado para o meu estilo?",
      answer:
        "Sim! O guia é totalmente adaptado ao seu estilo predominante identificado no quiz.",
    },
    {
      question: "Posso acessar em qualquer dispositivo?",
      answer:
        "Sim, o guia está em formato PDF que pode ser acessado em qualquer dispositivo.",
    },
    {
      question: "Por quanto tempo terei acesso aos materiais?",
      answer:
        "O acesso é vitalício! Uma vez que você adquire o guia, ele é seu para sempre.",
    },
  ];

  const handleCTA = () => {
    if (ctaUrl) {
      window.location.href = ctaUrl;
    } else if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-4xl font-playfair font-bold text-[#432818]">
          {title
            .replace("{userName}", userName || "")
            .replace("{style}", primaryStyleCategory || "")}
        </h1>
        {subtitle && <p className="text-lg text-[#1A1818]/80">{subtitle}</p>}
      </div>

      {/* Main Offer Card */}
      <Card className="border-2 border-[#aa6b5d] shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Product Image */}
          {productImageUrl && (
            <div className="w-full aspect-video bg-gradient-to-br from-[#FAF9F7] to-[#F3E8E6] flex items-center justify-center">
              <img
                src={productImageUrl}
                alt={productName}
                className="max-w-full max-h-full object-contain p-4"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Product Info */}
            <div className="text-center">
              <h2 className="text-2xl font-playfair font-bold text-[#432818] mb-2">
                {productName}
              </h2>
              <p className="text-[#1A1818]/70">{productDescription}</p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h3 className="font-medium text-[#432818]">O que você recebe:</h3>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[#1A1818]/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bonuses */}
            {bonuses.length > 0 && (
              <div className="bg-[#FAF9F7] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#aa6b5d]" />
                  <h3 className="font-medium text-[#432818]">
                    Bônus Exclusivos
                  </h3>
                </div>
                <div className="space-y-2">
                  {(showAllBonuses ? bonuses : bonuses.slice(0, 3)).map(
                    (bonus, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white rounded px-3 py-2"
                      >
                        <span className="text-[#1A1818]">{bonus.title}</span>
                        <span className="text-sm text-[#aa6b5d] line-through">
                          {bonus.value}
                        </span>
                      </div>
                    )
                  )}
                </div>
                {bonuses.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowAllBonuses(!showAllBonuses)}
                  >
                    {showAllBonuses ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Ver menos
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Ver todos os bônus
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Price */}
            <div className="text-center py-4 border-y border-[#B89B7A]/20">
              <p className="text-sm text-[#1A1818]/60">De</p>
              <p className="text-xl text-[#1A1818]/50 line-through">
                {regularPrice}
              </p>
              <p className="text-sm text-[#aa6b5d] font-medium mt-2">
                Por apenas
              </p>
              <p className="text-4xl font-bold text-[#aa6b5d]">{salePrice}</p>
              {installments && (
                <p className="text-sm text-[#1A1818]/70 mt-1">
                  ou {installments} sem juros
                </p>
              )}
            </div>

            {/* CTA Button */}
            <Button
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg"
              onClick={handleCTA}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {ctaText}
            </Button>

            {/* Trust Badges */}
            <div className="flex justify-center gap-6 text-sm text-[#1A1818]/60">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Compra Segura</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Acesso Imediato</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guarantee */}
      <Card className="bg-[#FAF9F7] border-[#B89B7A]/30">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#aa6b5d] to-[#B89B7A] flex items-center justify-center text-white flex-shrink-0">
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto" />
              <span className="text-xs font-bold">{guaranteeDays} DIAS</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#432818] mb-1">
              Garantia Total de Satisfação
            </h3>
            <p className="text-[#1A1818]/70">{guaranteeText}</p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-playfair font-bold text-[#432818] text-center">
            Perguntas Frequentes
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-[#432818]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#1A1818]/70">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Final CTA */}
      <div className="text-center space-y-4">
        <p className="text-lg text-[#432818]">
          Não perca essa oportunidade exclusiva!
        </p>
        <Button
          className="w-full md:w-auto px-8 h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg"
          onClick={handleCTA}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {ctaText}
        </Button>
      </div>
    </div>
  );
};
