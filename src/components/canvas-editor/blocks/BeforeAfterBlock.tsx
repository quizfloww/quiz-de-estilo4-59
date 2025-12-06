import React from "react";
import { CanvasBlockContent, BeforeAfterItem } from "@/types/canvasBlocks";
import { ArrowLeftRight, ArrowRight } from "lucide-react";

interface BeforeAfterBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Transformações reais de clientes com URLs originais (imagens combinadas antes/depois)
const defaultItems: BeforeAfterItem[] = [
  {
    id: "transformation-adriana",
    beforeImage:
      "https://res.cloudinary.com/der8kogzu/image/upload/v1752430335/ADRIANA-_ANTES_E_DEPOIS_ttgifc.png",
    afterImage:
      "https://res.cloudinary.com/der8kogzu/image/upload/v1752430335/ADRIANA-_ANTES_E_DEPOIS_ttgifc.png",
    name: "Adriana",
    description: "De básico para elegante, mantendo o conforto e autenticidade",
  },
  {
    id: "transformation-mariangela",
    beforeImage:
      "https://res.cloudinary.com/der8kogzu/image/upload/v1752430348/MARIANGELA_-_ANTES_E_DEPOIS_ipuoap.png",
    afterImage:
      "https://res.cloudinary.com/der8kogzu/image/upload/v1752430348/MARIANGELA_-_ANTES_E_DEPOIS_ipuoap.png",
    name: "Mariangela",
    description: "Do casual ao sofisticado, valorizando seu tipo de corpo",
  },
];

export const BeforeAfterBlock: React.FC<BeforeAfterBlockProps> = ({
  content,
  isPreview,
}) => {
  const layout = content.beforeAfterLayout || "side-by-side";
  const title = content.beforeAfterTitle || "Transformações Reais";
  const items = content.beforeAfterItems || defaultItems;

  return (
    <div className="w-full py-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-playfair font-bold text-[#432818] mb-2">
          {title}
        </h3>
        <p className="text-[#8F7A6A]">
          Veja o poder de conhecer seu estilo pessoal
        </p>
      </div>

      <div
        className={`grid gap-6 ${
          layout === "stacked" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {items.slice(0, 2).map((item, index) => (
          <div
            key={item.id || index}
            className="bg-white rounded-xl shadow-md border border-[#B89B7A]/20 overflow-hidden"
          >
            <div className="flex items-stretch">
              {/* Before */}
              <div className="flex-1 relative">
                <div className="absolute top-2 left-2 bg-gray-800/70 text-white text-xs px-2 py-1 rounded">
                  Antes
                </div>
                {item.beforeImage ? (
                  <img
                    src={item.beforeImage}
                    alt="Antes"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Imagem Antes</span>
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex items-center px-2 bg-gradient-to-b from-[#B89B7A]/10 to-[#aa6b5d]/10">
                <ArrowRight className="w-6 h-6 text-[#aa6b5d]" />
              </div>

              {/* After */}
              <div className="flex-1 relative">
                <div className="absolute top-2 left-2 bg-[#aa6b5d] text-white text-xs px-2 py-1 rounded">
                  Depois
                </div>
                {item.afterImage ? (
                  <img
                    src={item.afterImage}
                    alt="Depois"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[#fffaf7] to-[#f5ebe0] flex items-center justify-center">
                    <span className="text-[#B89B7A]">Imagem Depois</span>
                  </div>
                )}
              </div>
            </div>

            {(item.name || item.description) && (
              <div className="p-4 text-center border-t border-[#B89B7A]/10">
                {item.name && (
                  <p className="font-medium text-[#432818]">{item.name}</p>
                )}
                {item.description && (
                  <p className="text-sm text-[#8F7A6A]">{item.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
