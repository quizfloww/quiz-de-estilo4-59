import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  emoji: string;
  scale: number;
  duration: number;
}

interface CustomEmojis {
  intro?: string[];
  quiz?: string[];
  strategic?: string[];
  results?: string[];
}

interface EnchantedBackgroundProps {
  phase: "intro" | "quiz" | "strategic" | "results";
  intensity?: number;
  customEmojis?: CustomEmojis;
  enabled?: boolean;
}

export const EnchantedBackground: React.FC<EnchantedBackgroundProps> = ({
  phase,
  intensity = 0.5,
  customEmojis,
  enabled = true,
}) => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>(
    []
  );

  // Configuração padrão de emojis por fase
  const defaultEmojis = useMemo(
    () => ({
      intro: ["✨", "🌟", "💫", "⭐"],
      quiz: ["💭", "🤔", "💡", "🧠"],
      strategic: ["🎯", "💎", "🚀", "⚡"],
      results: ["🎉", "🎊", "🌟", "✨"],
    }),
    []
  );

  const phaseConfig = useMemo(
    () => ({
      intro: {
        emojis: customEmojis?.intro || defaultEmojis.intro,
        count: 3,
        colors: ["#8B5CF6", "#A78BFA"],
      },
      quiz: {
        emojis: customEmojis?.quiz || defaultEmojis.quiz,
        count: 2,
        colors: ["#6366F1", "#8B5CF6"],
      },
      strategic: {
        emojis: customEmojis?.strategic || defaultEmojis.strategic,
        count: 4,
        colors: ["#EF4444", "#F97316"],
      },
      results: {
        emojis: customEmojis?.results || defaultEmojis.results,
        count: 6,
        colors: ["#10B981", "#34D399"],
      },
    }),
    [customEmojis, defaultEmojis]
  );

  useEffect(() => {
    if (!enabled) {
      setFloatingElements([]);
      return;
    }

    const config = phaseConfig[phase];
    const elementCount = Math.floor(config.count * intensity);

    const newElements: FloatingElement[] = [];
    for (let i = 0; i < elementCount; i++) {
      newElements.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)],
        scale: 0.5 + Math.random() * 0.5,
        duration: 3 + Math.random() * 4,
      });
    }

    setFloatingElements(newElements);

    const interval = setInterval(() => {
      setFloatingElements((prev) => {
        const updated = prev.map((el) => ({
          ...el,
          y: (el.y - 1) % 120,
          x: el.x + Math.sin(Date.now() * 0.001 + el.id) * 0.1,
        }));
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [phase, intensity, enabled, phaseConfig]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `scale(${element.scale})`,
            }}
            initial={{ opacity: 0, y: "100vh" }}
            animate={{
              opacity: 0.2,
              y: "-10vh",
              rotate: [0, 5, -5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface MorphingProgressProps {
  progress: number;
  phase: "normal" | "strategic" | "complete";
  showShimmer?: boolean;
  style?: "simple" | "morphing" | "minimal";
  customColors?: {
    normal?: string;
    strategic?: string;
    complete?: string;
  };
}

export const MorphingProgress: React.FC<MorphingProgressProps> = ({
  progress,
  phase,
  showShimmer = true,
  style = "morphing",
  customColors,
}) => {
  // Cores padrão da marca
  const defaultColors = {
    normal: "#B89B7A",
    strategic: "#aa6b5d",
    complete: "#B89B7A",
  };

  const colors = {
    normal: customColors?.normal || defaultColors.normal,
    strategic: customColors?.strategic || defaultColors.strategic,
    complete: customColors?.complete || defaultColors.complete,
  };

  // Estilo minimalista - barra simples
  if (style === "minimal") {
    return (
      <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: colors[phase],
          }}
        />
      </div>
    );
  }

  // Estilo simples - sem animações
  if (style === "simple") {
    return (
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: colors[phase],
          }}
        />
      </div>
    );
  }

  // Estilo morphing - com animações completas
  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full relative"
        style={{ backgroundColor: colors[phase] }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Shimmer effect */}
        {showShimmer && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ x: [-100, 200] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ width: "100px" }}
          />
        )}

        {/* Pulse on strategic questions */}
        {phase === "strategic" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
