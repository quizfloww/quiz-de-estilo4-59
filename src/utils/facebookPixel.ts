
// Facebook Pixel utility functions
import {
  getPixelId,
  getCurrentFunnelConfig,
  trackFunnelEvent,
} from "../services/pixelManager";

// Extend Window type for Facebook Pixel
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FBQ = (...args: any[]) => void;

/**
 * Initialize Facebook Pixel with the provided ID
 * @param pixelId Facebook Pixel ID to initialize
 * @returns True if initialization was successful
 */
export const initFacebookPixel = (pixelId: string): boolean => {
  try {
    if (!pixelId) {
      console.warn("Facebook Pixel ID not provided");
      return false;
    }

    // Initialize Facebook Pixel
    const win = window as unknown as { fbq?: FBQ; _fbq?: FBQ };
    if (!win.fbq) {
      const fbq: FBQ = function (...args: unknown[]) {
        (fbq as any).q = (fbq as any).q || [];
        (fbq as any).q.push(args);
      };
      win.fbq = fbq;
      win._fbq = fbq;
      (fbq as any).loaded = true;
      (fbq as any).version = "2.0";
    }

    (window as unknown as { fbq: FBQ }).fbq("track", "init", { pixelId });
    // Facebook Pixel - PageView será disparado manualmente quando necessário

    console.log(`Facebook Pixel initialized with ID: ${pixelId}`);
    return true;
  } catch (error) {
    console.error("Error initializing Facebook Pixel:", error);
    return false;
  }
};

/**
 * Track a custom event with Facebook Pixel
 * @param eventName Name of the event to track
 * @param params Additional parameters to send
 */
export const trackPixelEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  try {
    const win = window as unknown as { fbq?: FBQ };
    if (typeof window === "undefined" || !win.fbq) {
      console.warn("Facebook Pixel not initialized");
      return;
    }

    win.fbq("track", eventName, params);

    console.log(`Tracked Facebook Pixel event: ${eventName}`, params || "");
  } catch (error) {
    console.error(`Error tracking Facebook Pixel event ${eventName}:`, error);
  }
};

/**
 * Track PageView event on route change - OTIMIZADO
 * @param url The URL to track
 */
export const trackPageView = (url?: string): void => {
  try {
    const win = window as unknown as { fbq?: FBQ };
    if (typeof window === "undefined" || !win.fbq) {
      return;
    }

    // Facebook Pixel - REMOVIDO: PageView não é evento principal

    if (url) {
      console.log(`Facebook Pixel PageView removido para otimização: ${url}`);
    }
  } catch (error) {
    console.error("Error tracking Facebook Pixel PageView:", error);
  }
};

// Adding the loadFacebookPixel function to use dynamic pixel management
export const loadFacebookPixel = (): void => {
  try {
    // Usa o pixelManager para obter o pixel ID correto baseado na rota atual
    const pixelId = getPixelId();
    const funnelConfig = getCurrentFunnelConfig();

    if (pixelId) {
      initFacebookPixel(pixelId);
      console.log(
        `Loaded Facebook Pixel for funnel: ${funnelConfig.funnelName} (${pixelId})`
      );

      // Dispara evento de inicialização específico do funil
      trackFunnelEvent("PixelInitialized", {
        pixel_id: pixelId,
        funnel_type: funnelConfig.funnelName,
        page_url: window.location.href,
      });
    } else {
      console.warn("No Facebook Pixel ID found for current route");
    }
  } catch (error) {
    console.error("Error loading Facebook Pixel:", error);
  }
};

export default {
  initFacebookPixel,
  trackPixelEvent,
  trackPageView,
  loadFacebookPixel,
};
