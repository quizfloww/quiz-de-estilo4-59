import React from "react";
import { CanvasBlockContent, TestimonialItem } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

interface TestimonialBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const DEFAULT_TESTIMONIAL: TestimonialItem = {
  id: "1",
  name: "Maria Silva",
  role: "Empresária",
  text: "Descobrir meu estilo foi transformador! Agora me sinto muito mais confiante nas minhas escolhas de roupa e economizo tempo toda manhã.",
  imageUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  rating: 5,
};

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  content,
  isPreview,
}) => {
  const testimonial = content.testimonial || DEFAULT_TESTIMONIAL;
  const variant = content.testimonialVariant || "card";

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  if (variant === "minimal") {
    return (
      <div
        className="w-full p-4 rounded-lg"
        style={{ backgroundColor: blockBackgroundColor }}
      >
        <p className="text-[#5A4A3A] italic text-center mb-3">
          "{testimonial.text}"
        </p>
        <p className="text-sm text-[#8F7A6A] text-center font-medium">
          — {testimonial.name}
          {testimonial.role && `, ${testimonial.role}`}
        </p>
      </div>
    );
  }

  if (variant === "quote") {
    return (
      <div
        className="w-full p-6 relative rounded-lg"
        style={{ backgroundColor: blockBackgroundColor }}
      >
        <Quote className="absolute top-0 left-0 w-12 h-12 text-[#B89B7A]/20 -translate-y-2 -translate-x-2" />
        <div className="pl-8">
          <p className="text-lg text-[#5A4A3A] italic mb-4">
            "{testimonial.text}"
          </p>
          <div className="flex items-center gap-3">
            {testimonial.imageUrl && (
              <img
                src={testimonial.imageUrl}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-[#432818]">{testimonial.name}</p>
              {testimonial.role && (
                <p className="text-sm text-[#8F7A6A]">{testimonial.role}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div
      className="w-full p-6 rounded-xl border border-[#B89B7A]/20 shadow-sm"
      style={{ backgroundColor: blockBackgroundColor || "#ffffff" }}
    >
      <div className="flex items-start gap-4">
        {testimonial.imageUrl && (
          <img
            src={testimonial.imageUrl}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#B89B7A]/30 flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-[#432818]">{testimonial.name}</h4>
            {testimonial.role && (
              <span className="text-sm text-[#8F7A6A]">
                • {testimonial.role}
              </span>
            )}
          </div>
          {testimonial.rating && (
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < testimonial.rating!
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
          )}
          <p className="text-[#5A4A3A]">"{testimonial.text}"</p>
        </div>
      </div>
    </div>
  );
};
