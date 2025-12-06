import React from "react";
import { CanvasBlockContent, FaqItem } from "@/types/canvasBlocks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const DEFAULT_FAQ: FaqItem[] = [
  {
    id: "1",
    question: "Como funciona o Guia de Estilo?",
    answer:
      "O Guia é um material digital personalizado baseado no resultado do seu quiz. Você receberá dicas de roupas, cores e acessórios que combinam com seu estilo predominante.",
  },
  {
    id: "2",
    question: "Quanto tempo tenho acesso ao material?",
    answer:
      "O acesso é vitalício! Você pode consultar o guia sempre que precisar, sem prazo de expiração.",
  },
  {
    id: "3",
    question: "E se eu não gostar do conteúdo?",
    answer:
      "Oferecemos garantia de 7 dias. Se não ficar satisfeita, devolvemos 100% do valor investido.",
  },
  {
    id: "4",
    question: "Como recebo o material?",
    answer:
      "Após a confirmação do pagamento, você receberá um e-mail com o link de acesso à área de membros.",
  },
];

export const FaqBlock: React.FC<FaqBlockProps> = ({ content, isPreview }) => {
  const faqItems = content.faqItems?.length ? content.faqItems : DEFAULT_FAQ;
  const style = content.faqStyle || "accordion";

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  if (style === "list") {
    return (
      <div
        className="w-full space-y-4 p-4 rounded-xl"
        style={{ backgroundColor: blockBackgroundColor }}
      >
        <h3 className="text-xl font-semibold text-[#432818] text-center mb-6">
          Perguntas Frequentes
        </h3>
        {faqItems.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-lg border border-[#B89B7A]/20"
          >
            <h4 className="font-semibold text-[#432818] mb-2">
              {item.question}
            </h4>
            <p className="text-[#5A4A3A] text-sm">{item.answer}</p>
          </div>
        ))}
      </div>
    );
  }

  // Accordion style (default)
  return (
    <div
      className="w-full p-4 rounded-xl"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <h3 className="text-xl font-semibold text-[#432818] text-center mb-6">
        Perguntas Frequentes
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border border-[#B89B7A]/20 rounded-lg mb-2 bg-white overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[#B89B7A]/5 text-left">
              <span className="font-medium text-[#432818]">
                {item.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-[#5A4A3A]">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
