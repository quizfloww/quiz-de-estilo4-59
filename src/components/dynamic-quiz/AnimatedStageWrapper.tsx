import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedStageWrapperProps {
  children: React.ReactNode;
  stageKey: string | number;
  direction?: "forward" | "backward";
}

/**
 * Wrapper component that provides smooth animations when transitioning between quiz stages.
 * Uses Framer Motion for fade + slide animations.
 */
export const AnimatedStageWrapper: React.FC<AnimatedStageWrapperProps> = ({
  children,
  stageKey,
  direction = "forward",
}) => {
  const xOffset = direction === "forward" ? 30 : -30;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stageKey}
        initial={{ opacity: 0, x: xOffset }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -xOffset }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1], // ease-out curve
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedStageWrapper;
