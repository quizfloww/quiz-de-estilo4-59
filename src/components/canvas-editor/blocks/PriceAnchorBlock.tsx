import React from "react";
import { CanvasBlockContent, PriceAnchorItem } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";

interface PriceAnchorBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const DEFAULT_ITEMS: PriceAnchorItem[] = [
  { id: "1", label: "Guia de Estilo Personalizado", originalPrice: 97 },
  { id: "2", label: "Bônus: Peças-chave do Guarda-roupa", originalPrice: 67 },
  { id: "3", label: "Bônus: Guia de Visagismo", originalPrice: 47 },
];

export const PriceAnchorBlock: React.FC<PriceAnchorBlockProps> = ({
  content,
  isPreview,
}) => {
  const items = content.priceItems?.length ? content.priceItems : DEFAULT_ITEMS;
  const totalOriginal =
    content.totalOriginal ||
    items.reduce((sum, item) => sum + (item.originalPrice || 0), 0);
  const finalPrice = content.finalPrice || 39;
  const installments = content.installments || { count: 5, value: 8.83 };
  
  // Safe values for toFixed
  const safeTotalOriginal = totalOriginal || 0;
  const safeFinalPrice = finalPrice || 0;
  const safeInstallmentValue = installments?.value || 0;
  
  const discountBadge =
    content.discountBadge ||
    `-${Math.round((1 - safeFinalPrice / safeTotalOriginal) * 100)}%`;
  const currency = content.currency || "R$";

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  return (
    <div
      className="w-full p-6 rounded-xl border-2 border-[#B89B7A]/30 shadow-lg"
      style={{ backgroundColor: blockBackgroundColor || "#ffffff" }}
    >
      {/* Badge de Desconto */}
      <div className="flex justify-center mb-4">
        <span className="inline-block px-4 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
          {discountBadge} DE DESCONTO
        </span>
      </div>

      {/* Lista de itens */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b border-dashed border-[#B89B7A]/30"
          >
            <span className="text-[#5A4A3A] text-sm md:text-base">
              {item.label}
            </span>
            <span className="text-[#8F7A6A] line-through text-sm">
              {currency} {(item.originalPrice || 0).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total Original */}
      <div className="flex items-center justify-between py-3 border-t-2 border-[#B89B7A]/30 mb-4">
        <span className="text-[#5A4A3A] font-semibold">Total:</span>
        <span className="text-[#8F7A6A] line-through text-lg">
          {currency} {totalOriginal.toFixed(2)}
        </span>
      </div>

      {/* Preço Final */}
      <div className="text-center py-4 bg-gradient-to-r from-[#B89B7A]/10 to-[#D4AF37]/10 rounded-lg">
        <p className="text-sm text-[#5A4A3A] mb-1">Por apenas</p>
        <p className="text-4xl md:text-5xl font-bold text-[#B89B7A]">
          {currency} {finalPrice.toFixed(2)}
        </p>
        <p className="text-sm text-[#8F7A6A] mt-2">
          ou {installments.count}x de {currency} {installments.value.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
