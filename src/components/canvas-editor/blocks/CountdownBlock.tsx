import React, { useState, useEffect } from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Card } from "@/components/ui/card";

interface CountdownBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

/**
 * CountdownBlock - Design igual ao UrgencyCountdown.tsx real
 * - Card branco com border sutil
 * - Badges com fundo vermelho transparente
 * - Texto em vermelho coral (#ff6b6b)
 */
export const CountdownBlock: React.FC<CountdownBlockProps> = ({
  content,
  isPreview,
}) => {
  const initialHours = content.hours ?? 24;
  const initialMinutes = content.minutes ?? 59;
  const initialSeconds = content.seconds ?? 59;
  const expiryMessage =
    content.expiryMessage || "Esta oferta exclusiva expira em:";

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    if (isPreview) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPreview]);

  return (
    <Card
      className="w-full p-3 sm:p-4 mb-4 sm:mb-6 border-[#B89B7A]/20 shadow-sm"
      style={{ backgroundColor: blockBackgroundColor || "#ffffff" }}
    >
      <div className="text-center">
        <p className="text-sm sm:text-base text-[#432818] mb-2 sm:mb-3 font-medium">
          {expiryMessage}
        </p>

        <div className="flex justify-center gap-1.5 sm:gap-2 mb-2">
          {/* Selo Horas */}
          <div className="bg-[#ff6b6b]/10 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-[#ff6b6b]/20 shadow-sm min-w-[50px] sm:min-w-[60px]">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#ff6b6b]">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <div className="text-[10px] sm:text-xs text-[#432818]">HORAS</div>
          </div>

          {/* Selo Minutos */}
          <div className="bg-[#ff6b6b]/10 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-[#ff6b6b]/20 shadow-sm min-w-[50px] sm:min-w-[60px]">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#ff6b6b]">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <div className="text-[10px] sm:text-xs text-[#432818]">MIN</div>
          </div>

          {/* Selo Segundos */}
          <div className="bg-[#ff6b6b]/10 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-[#ff6b6b]/20 shadow-sm min-w-[50px] sm:min-w-[60px]">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#ff6b6b]">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
            <div className="text-[10px] sm:text-xs text-[#432818]">SEG</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
