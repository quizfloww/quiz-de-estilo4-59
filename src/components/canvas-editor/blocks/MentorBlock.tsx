import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Card } from "@/components/ui/card";

interface MentorBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Imagem original da mentora Gisele Galvão
const DEFAULT_MENTOR_IMAGE =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1745347467/GISELE-GALV%C3%83O-POSE-ACESSIBILIDADE_i23qvj.webp";

/**
 * MentorBlock - Design igual ao MentorSection.tsx real
 * - Card branco com border elegante
 * - Grid 2 colunas
 * - Decorative corners douradas
 * - Imagem com hover:scale-105
 * - Background blur decorativo
 */
export const MentorBlock: React.FC<MentorBlockProps> = ({
  content,
  isPreview,
}) => {
  const name = content.mentorName || "Gisele Galvão";
  const title =
    content.mentorTitle ||
    "Consultora de Imagem e Estilo, Personal Branding, Estrategista de Marca pessoal e Especialista em coloração pessoal com Certificação internacional.";
  const description =
    content.mentorDescription ||
    "Advogada de formação, mãe e esposa. Apaixonada por ajudar mulheres a descobrirem seu estilo autêntico e transformarem sua relação com a imagem pessoal.";
  const imageUrl = content.mentorImageUrl || DEFAULT_MENTOR_IMAGE;

  return (
    <Card className="p-6 mb-10 bg-white shadow-md border border-[#B89B7A]/20 card-elegant overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#B89B7A]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#aa6b5d]/5 rounded-full blur-3xl"></div>

      <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div>
          <h2 className="text-2xl font-playfair text-[#aa6b5d] mb-4">
            Conheça Sua Mentora
          </h2>
          <p className="text-[#432818] mb-4">
            <strong>{name}</strong> — {title}
          </p>
          <p className="text-[#432818] mb-4">{description}</p>
        </div>

        <div className="relative">
          <div className="flex justify-center mb-6">
            <img
              src={imageUrl}
              alt={`${name} - Consultora de Imagem e Estilo`}
              className="w-full max-w-[300px] h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          {/* Elegant decorative corner */}
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
        </div>
      </div>
    </Card>
  );
};
