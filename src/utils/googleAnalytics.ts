/**
 * Google Analytics 4 (GA4) Integration
 * Gerenciamento centralizado de tracking para escalabilidade
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Configuração do GA4
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === "production";
const ENABLE_DEBUG = !IS_PRODUCTION;

/**
 * Inicializa o Google Analytics 4
 */
export const initGA4 = (): void => {
  if (!GA4_MEASUREMENT_ID) {
    if (ENABLE_DEBUG) {
      console.warn(
        "[GA4] Measurement ID não configurado. Analytics desabilitado."
      );
    }
    return;
  }

  try {
    // Criar dataLayer
    window.dataLayer = window.dataLayer || [];

    // Função gtag
    function gtag(...args: any[]) {
      window.dataLayer?.push(arguments);
    }
    window.gtag = gtag;

    // Configuração inicial
    gtag("js", new Date());
    gtag("config", GA4_MEASUREMENT_ID, {
      send_page_view: false, // Controlamos manualmente
      anonymize_ip: true, // LGPD/GDPR compliance
      cookie_flags: "SameSite=None;Secure",
    });

    // Carregar script do GA4
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    if (ENABLE_DEBUG) {
      console.log("[GA4] Inicializado com sucesso:", GA4_MEASUREMENT_ID);
    }
  } catch (error) {
    console.error("[GA4] Erro ao inicializar:", error);
  }
};

/**
 * Track page view
 */
export const trackGA4PageView = (
  pagePath: string,
  pageTitle?: string
): void => {
  if (!window.gtag) {
    if (ENABLE_DEBUG) console.warn("[GA4] gtag não disponível");
    return;
  }

  try {
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
    });

    if (ENABLE_DEBUG) {
      console.log("[GA4] Page view tracked:", pagePath);
    }
  } catch (error) {
    console.error("[GA4] Erro ao trackear page view:", error);
  }
};

/**
 * Track custom event
 */
export const trackGA4Event = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  if (!window.gtag) {
    if (ENABLE_DEBUG) console.warn("[GA4] gtag não disponível");
    return;
  }

  try {
    window.gtag("event", eventName, eventParams);

    if (ENABLE_DEBUG) {
      console.log("[GA4] Event tracked:", eventName, eventParams);
    }
  } catch (error) {
    console.error("[GA4] Erro ao trackear evento:", error);
  }
};

/**
 * Track conversão (lead, compra, etc)
 */
export const trackGA4Conversion = (
  value?: number,
  currency: string = "BRL",
  transactionId?: string
): void => {
  trackGA4Event("conversion", {
    value,
    currency,
    transaction_id: transactionId,
  });
};

/**
 * Track quiz events
 */
export const trackGA4QuizStart = (quizName?: string): void => {
  trackGA4Event("quiz_start", {
    quiz_name: quizName,
    event_category: "engagement",
  });
};

export const trackGA4QuizComplete = (
  quizName?: string,
  result?: string,
  score?: number
): void => {
  trackGA4Event("quiz_complete", {
    quiz_name: quizName,
    quiz_result: result,
    quiz_score: score,
    event_category: "engagement",
  });
};

export const trackGA4QuizQuestion = (
  questionNumber: number,
  questionText?: string
): void => {
  trackGA4Event("quiz_question", {
    question_number: questionNumber,
    question_text: questionText,
    event_category: "engagement",
  });
};

/**
 * Track lead generation
 */
export const trackGA4Lead = (
  leadType: "email" | "phone" | "form",
  value?: number
): void => {
  trackGA4Event("generate_lead", {
    lead_type: leadType,
    value,
    currency: "BRL",
  });
};

/**
 * Track user properties
 */
export const setGA4UserProperties = (properties: Record<string, any>): void => {
  if (!window.gtag) return;

  try {
    window.gtag("set", "user_properties", properties);

    if (ENABLE_DEBUG) {
      console.log("[GA4] User properties set:", properties);
    }
  } catch (error) {
    console.error("[GA4] Erro ao setar user properties:", error);
  }
};

/**
 * Track exception/error
 */
export const trackGA4Exception = (
  description: string,
  fatal: boolean = false
): void => {
  trackGA4Event("exception", {
    description,
    fatal,
  });
};

/**
 * Track timing (performance)
 */
export const trackGA4Timing = (
  name: string,
  value: number,
  category?: string
): void => {
  trackGA4Event("timing_complete", {
    name,
    value,
    event_category: category || "performance",
  });
};

/**
 * Track scroll depth
 */
export const trackGA4ScrollDepth = (percent: number): void => {
  trackGA4Event("scroll", {
    percent_scrolled: percent,
  });
};

/**
 * Track outbound link
 */
export const trackGA4OutboundLink = (url: string): void => {
  trackGA4Event("click", {
    event_category: "outbound",
    event_label: url,
    transport_type: "beacon",
  });
};

// Auto-inicializar se estiver no browser
if (typeof window !== "undefined") {
  initGA4();
}
