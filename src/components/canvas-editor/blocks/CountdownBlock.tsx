import React, { useState, useEffect } from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface CountdownBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const CountdownBlock: React.FC<CountdownBlockProps> = ({ content, isPreview }) => {
  const initialHours = content.hours ?? 2;
  const initialMinutes = content.minutes ?? 47;
  const initialSeconds = content.seconds ?? 33;
  const variant = content.countdownVariant || 'dramatic';
  const expiryMessage = content.expiryMessage || 'Esta oferta expira ao sair desta página!';

  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    if (isPreview) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPreview]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center gap-2 py-3">
        <Clock className="w-4 h-4 text-[#B89B7A]" />
        <span className="text-[#5A4A3A] font-medium">
          Oferta expira em {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  if (variant === 'simple') {
    return (
      <div className="w-full p-4 bg-[#FFF5EB] rounded-lg border border-[#B89B7A]/30 text-center">
        <p className="text-sm text-[#8F7A6A] mb-2">{expiryMessage}</p>
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-[#B89B7A]">
          <span>{formatNumber(timeLeft.hours)}</span>
          <span>:</span>
          <span>{formatNumber(timeLeft.minutes)}</span>
          <span>:</span>
          <span>{formatNumber(timeLeft.seconds)}</span>
        </div>
      </div>
    );
  }

  // Dramatic variant
  return (
    <div className="w-full p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white text-center">
      <p className="text-sm uppercase tracking-wider mb-3 opacity-90">{expiryMessage}</p>
      <div className="flex items-center justify-center gap-4">
        <TimeUnit value={timeLeft.hours} label="Horas" />
        <span className="text-3xl font-bold">:</span>
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <span className="text-3xl font-bold">:</span>
        <TimeUnit value={timeLeft.seconds} label="Seg" />
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[60px]">
      <span className="text-3xl md:text-4xl font-bold">{value.toString().padStart(2, '0')}</span>
    </div>
    <span className="text-xs mt-1 opacity-80">{label}</span>
  </div>
);
