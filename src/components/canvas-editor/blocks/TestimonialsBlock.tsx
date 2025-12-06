import React from "react";
import { CanvasBlockContent, TestimonialItem } from "@/types/canvasBlocks";
import { MessageSquare, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialsBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Depoimentos originais com imagens reais das clientes
const defaultTestimonials: TestimonialItem[] = [
  {
    id: "1",
    name: "Sônia",
    role: "Cliente",
    text: "Incrível como descobrir meu estilo mudou minha autoestima. Agora sei exatamente o que comprar!",
    imageUrl:
      "https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_S%C3%94NIA_q0g9cq.png",
    rating: 5,
  },
  {
    id: "2",
    name: "Patrícia",
    role: "Cliente",
    text: "O guia é muito completo! Finalmente entendi como valorizar meu corpo e personalidade.",
    imageUrl:
      "https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_PATR%C3%8DCIA_x0mhud.png",
    rating: 5,
  },
  {
    id: "3",
    name: "Mariangela",
    role: "Cliente",
    text: "Transformação incrível! Antes eu comprava por impulso, agora tenho direcionamento claro.",
    imageUrl:
      "https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_MARIANGELA_sj7lki.png",
    rating: 5,
  },
];

/**
 * TestimonialsBlock - Design igual ao TestimonialsSection.tsx real
 * - Animações motion com staggered entrance
 * - Background FAF9F7
 * - Grid responsivo
 */
export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  content,
  isPreview,
}) => {
  const layout = content.testimonialsLayout || "grid";
  const title = content.testimonialsTitle || "O que dizem nossas clientes";
  const testimonials = content.testimonials || defaultTestimonials;

  // Mobile Layout Configuration
  const mobileLayout = content.mobileLayout || "stacked";
  const mobileColumns = content.mobileColumns || 1;

  // Classes dinâmicas baseadas na configuração mobile - máximo 2 colunas para responsividade
  const getGridClasses = () => {
    if (layout === "carousel") {
      return "flex overflow-x-auto gap-4 snap-x snap-mandatory";
    }
    if (layout === "list") {
      return "space-y-4";
    }
    // Grid layout com opções mobile - limitado a 2 colunas
    if (mobileLayout === "side-by-side" || mobileColumns === 2) {
      return "grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6";
    }
    return "grid grid-cols-1 md:grid-cols-2 gap-6";
  };

  // Cor de fundo personalizada
  const blockBackgroundColor = content.backgroundColor || "#FAF9F7";

  // Manter para compatibilidade, mas usar getGridClasses()
  const layoutClasses = {
    carousel: "flex overflow-x-auto gap-4 snap-x snap-mandatory",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    list: "space-y-4",
  };

  return (
    <section
      className="py-12 px-4 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#aa6b5d]" />
            <span className="text-sm font-medium uppercase tracking-wide text-[#aa6b5d]">
              Depoimentos
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-playfair text-[#432818]">
            {title}
          </h2>
        </motion.div>

        <div className={getGridClasses()}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * index,
              }}
              className={`bg-white rounded-lg p-6 shadow-sm space-y-4 ${
                layout === "carousel" ? "min-w-[300px] snap-center" : ""
              }`}
            >
              <Quote className="h-8 w-8 text-[#B89B7A]" />

              <p className="text-[#432818]">{testimonial.text}</p>

              <div className="flex items-center gap-3">
                {testimonial.imageUrl ? (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B89B7A] to-[#aa6b5d] flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}

                <p className="font-medium text-[#8F7A6A]">{testimonial.name}</p>
              </div>

              {testimonial.rating && (
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating!
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
