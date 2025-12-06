import React from "react";
import { CanvasBlockContent, TestimonialItem } from "@/types/canvasBlocks";
import { MessageSquare, Star, Quote } from "lucide-react";

interface TestimonialsBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    id: "1",
    name: "Carla Mendes",
    role: "Empresária",
    text: "O guia mudou completamente minha forma de me vestir. Agora sei exatamente o que combina comigo e faço compras muito mais conscientes.",
    imageUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/testimonial1.webp",
    rating: 5,
  },
  {
    id: "2",
    name: "Ana Paula",
    role: "Advogada",
    text: "Finalmente entendi por que algumas roupas me deixavam insegura. Com o guia, descobri meu estilo e hoje me sinto confiante em qualquer ocasião.",
    imageUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/testimonial2.webp",
    rating: 5,
  },
  {
    id: "3",
    name: "Juliana Costa",
    role: "Médica",
    text: "Investimento que valeu cada centavo. O guia é prático, objetivo e realmente funciona. Recomendo para todas as mulheres.",
    imageUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/testimonial3.webp",
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
