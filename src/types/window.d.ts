/**
 * Declarações de tipos globais para Window
 * Consolidação de todas as extensões de Window do projeto
 */

// Tipos para Facebook Pixel e Google Analytics
interface Window {
  // Google Analytics
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];

  // Facebook Pixel
  fbq?: (...args: unknown[]) => void;
  _fbq?: (...args: unknown[]) => void;

  // Custom utility functions exposed to the global scope
  checkMainRoutes?: () => unknown;
  fixMainRoutes?: () => unknown;
  monitorFunnelRoutes?: () => unknown;
  checkSiteHealth?: () => unknown;
  fixBlurryIntroQuizImages?: () => number;

  // Other global variables
  isDev?: boolean;
  isPreview?: boolean;
  isProduction?: boolean;
}
