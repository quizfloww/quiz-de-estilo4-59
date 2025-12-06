import React from "react";
import { CanvasBlockContent, TestimonialItem } from "@/types/canvasBlocks";
import { MessageSquare, Star, Quote } from "lucide-react";

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

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  content,
  isPreview,
}) => {
  const layout = content.testimonialsLayout || "grid";
  const title = content.testimonialsTitle || "O Que Nossas Alunas Dizem";
  const testimonials = content.testimonials || defaultTestimonials;

  const layoutClasses = {
    carousel: "flex overflow-x-auto gap-4 snap-x snap-mandatory",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    list: "space-y-4",
  };

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#aa6b5d]" />
            <span className="text-sm font-medium uppercase tracking-wide text-[#aa6b5d]">
              Depoimentos
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-[#432818]">
            {title}
          </h3>
        </div>

        <div className={layoutClasses[layout]}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className={`bg-white rounded-xl p-6 border border-[#B89B7A]/20 shadow-sm ${
                layout === "carousel" ? "min-w-[300px] snap-center" : ""
              }`}
            >
              <Quote className="w-8 h-8 text-[#B89B7A]/30 mb-4" />

              <p className="text-[#432818] mb-4 italic">"{testimonial.text}"</p>

              <div className="flex items-center gap-3">
                {testimonial.imageUrl ? (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#B89B7A]/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B89B7A] to-[#aa6b5d] flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[#432818]">
                    {testimonial.name}
                  </p>
                  {testimonial.role && (
                    <p className="text-sm text-[#8F7A6A]">{testimonial.role}</p>
                  )}
                </div>
              </div>

              {testimonial.rating && (
                <div className="flex gap-1 mt-3">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
