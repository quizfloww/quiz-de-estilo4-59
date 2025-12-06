import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import { Users, Star, CheckCircle, Heart } from "lucide-react";

interface SocialProofBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const ICON_MAP = {
  users: Users,
  star: Star,
  check: CheckCircle,
  heart: Heart,
};

export const SocialProofBlock: React.FC<SocialProofBlockProps> = ({
  content,
  isPreview,
}) => {
  const text =
    content.socialProofText || "+3.000 mulheres já descobriram seu estilo";
  const iconKey = content.socialProofIcon || "users";
  const variant = content.socialProofVariant || "badge";

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  const Icon = ICON_MAP[iconKey];

  if (variant === "minimal") {
    return (
      <div
        className="flex items-center justify-center gap-2 py-2 rounded-lg"
        style={{ backgroundColor: blockBackgroundColor }}
      >
        <Icon className="w-4 h-4 text-[#B89B7A]" />
        <span className="text-sm text-[#5A4A3A]">{text}</span>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className="w-full py-3 px-4 border-y border-[#B89B7A]/20"
        style={{
          background:
            blockBackgroundColor ||
            "linear-gradient(to right, rgba(184,155,122,0.1), rgba(212,175,55,0.1))",
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <Icon className="w-5 h-5 text-[#B89B7A]" />
          <span className="font-medium text-[#432818]">{text}</span>
        </div>
      </div>
    );
  }

  // Badge variant (default)
  return (
    <div
      className="flex justify-center p-2 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B89B7A]/10 rounded-full border border-[#B89B7A]/30">
        <Icon className="w-4 h-4 text-[#B89B7A]" />
        <span className="text-sm font-medium text-[#432818]">{text}</span>
      </div>
    </div>
  );
};
