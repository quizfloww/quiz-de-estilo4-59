import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { UserCircle, Award, BookOpen, Star } from "lucide-react";

interface MentorBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const defaultCredentials = [
  "Especialista em Análise de Estilo",
  "Consultora de Imagem Certificada",
  "Mais de 5.000 mulheres transformadas",
  "Especialista em coloração pessoal com Certificação internacional",
];

// Imagem original da mentora Gisele Galvão
const DEFAULT_MENTOR_IMAGE =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1745347467/GISELE-GALV%C3%83O-POSE-ACESSIBILIDADE_i23qvj.webp";

export const MentorBlock: React.FC<MentorBlockProps> = ({
  content,
  isPreview,
}) => {
  const name = content.mentorName || "Gisele Galvão";
  const title =
    content.mentorTitle ||
    "Consultora de Imagem e Estilo, Personal Branding, Estrategista de Marca pessoal e Especialista em coloração pessoal com Certificação internacional";
  const description =
    content.mentorDescription ||
    "Advogada de formação, mãe e esposa. Apaixonada por ajudar mulheres a descobrirem seu estilo autêntico e transformarem sua relação com a imagem pessoal.";
  const imageUrl = content.mentorImageUrl || DEFAULT_MENTOR_IMAGE;
  const credentials = content.mentorCredentials || defaultCredentials;

  return (
    <div className="w-full py-8 px-4 bg-gradient-to-br from-[#432818] to-[#5a3a28] rounded-xl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <UserCircle className="w-5 h-5 text-[#B89B7A]" />
            <span className="text-sm font-medium uppercase tracking-wide text-[#B89B7A]">
              Sua Mentora
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Imagem da Mentora */}
          <div className="flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-48 h-48 rounded-full object-cover border-4 border-[#B89B7A]/30 shadow-xl"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-[#B89B7A]/20 flex items-center justify-center">
                <UserCircle className="w-24 h-24 text-[#B89B7A]/50" />
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-1">
              {name}
            </h3>
            <p className="text-[#B89B7A] font-medium mb-4">{title}</p>

            <p className="text-gray-300 leading-relaxed mb-6">{description}</p>

            {/* Credenciais */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {credentials.slice(0, 4).map((credential, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full"
                >
                  <Award className="w-4 h-4 text-[#B89B7A]" />
                  <span className="text-sm text-white">{credential}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
