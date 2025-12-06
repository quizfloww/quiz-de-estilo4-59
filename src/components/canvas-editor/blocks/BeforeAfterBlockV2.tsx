import React, { useState } from "react";
import { CanvasBlockContent, BeforeAfterItem } from "@/types/canvasBlocks";
import { motion } from "framer-motion";

interface BeforeAfterBlockV2Props {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Transformações reais de clientes
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

/**
 * BeforeAfterBlockV2 - Design moderno e minimalista
 * - Layout com slider interativo
 * - Animações suaves
 * - Design clean inspirado no Lovable
 */
export const BeforeAfterBlockV2: React.FC<BeforeAfterBlockV2Props> = ({
  content,
  isPreview,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  const title = content.beforeAfterTitle || "Transformações Reais";
  const items = content.beforeAfterItems || defaultItems;
  const activeItem = items[activeIndex] || items[0];

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div
      className="min-h-[1.25rem] min-w-full relative self-auto box-border p-4 rounded-xl"
      data-block-type="before-after-v2"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="min-w-full text-2xl md:text-3xl font-bold text-center text-[#432818]">
          {title}
        </h2>
        <p className="text-sm md:text-base text-[#8F7A6A] mt-2">
          Arraste para comparar
        </p>
      </motion.div>

      {/* Comparison Slider Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative w-full max-w-2xl mx-auto aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-[#B89B7A]/20"
      >
        {/* Before Image (Background) */}
        <div className="absolute inset-0">
          {activeItem.beforeImage ? (
            <img
              src={activeItem.beforeImage}
              alt="Antes"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg">Imagem Antes</span>
            </div>
          )}
        </div>

        {/* After Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {activeItem.afterImage ? (
            <img
              src={activeItem.afterImage}
              alt="Depois"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#fffaf7] to-[#f5ebe0] flex items-center justify-center">
              <span className="text-[#B89B7A] text-lg">Imagem Depois</span>
            </div>
          )}
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-[#B89B7A]">
            <svg
              className="w-5 h-5 text-[#B89B7A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 bg-gray-800/70 text-white text-xs px-3 py-1.5 rounded-full font-medium">
          Antes
        </div>
        <div className="absolute top-3 right-3 bg-[#aa6b5d] text-white text-xs px-3 py-1.5 rounded-full font-medium">
          Depois
        </div>

        {/* Range Input (invisible, for interaction) */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
      </motion.div>

      {/* Name and Description */}
      {(activeItem.name || activeItem.description) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-4"
        >
          {activeItem.name && (
            <p className="font-semibold text-[#432818] text-lg">
              {activeItem.name}
            </p>
          )}
          {activeItem.description && (
            <p className="text-sm text-[#8F7A6A] mt-1">
              {activeItem.description}
            </p>
          )}
        </motion.div>
      )}

      {/* Thumbnails Navigation */}
      {items.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-3 mt-6"
        >
          {items.map((item, index) => (
            <button
              key={item.id || index}
              onClick={() => {
                setActiveIndex(index);
                setSliderPosition(50);
              }}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-[#aa6b5d] shadow-md scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={item.afterImage || item.beforeImage}
                alt={item.name || `Transformação ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};
