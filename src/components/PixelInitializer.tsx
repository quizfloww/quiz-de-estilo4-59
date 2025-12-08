"use client";
// Facebook Pixel Initializer Component
import { useEffect } from "react";
import { loadFacebookPixelDynamic } from "@/utils/facebookPixelDynamic";
import { trackGA4PageView } from "@/utils/googleAnalytics";

interface PixelInitializerProps {
  pageType?: "quiz" | "result" | "offer" | "other";
}

const PixelInitializer = ({ pageType = "other" }: PixelInitializerProps) => {
  useEffect(() => {
    // Inicializa o Facebook Pixel com o ID correto do funil atual
    loadFacebookPixelDynamic();

    // Faz tracking de PageView com GA4
    trackGA4PageView(window.location.pathname, document.title);

    console.log(`[PixelInitializer] Pixel inicializado na página: ${pageType}`);
    return () => {
      // Nenhuma limpeza necessária, mas mantém estrutura para futuros ajustes
    };
  }, [pageType]);

  return null;
};

export default PixelInitializer;
