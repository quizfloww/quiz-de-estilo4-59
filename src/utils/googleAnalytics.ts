/**
 * Google Analytics 4 (GA4) Integration
 * Gerenciamento centralizado de tracking para escalabilidade
 * Tipos globais de Window definidos em src/types/window.d.ts
 */

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
export const trackGA4QuizStart = (
  quizName?: string,
  params?: {
    funnel_id?: string;
    funnel_slug?: string;
    user_name?: string;
    user_email?: string;
  }
): void => {
  trackGA4Event("quiz_start", {
    quiz_name: quizName,
    event_category: "engagement",
    funnel_id: params?.funnel_id,
    funnel_slug: params?.funnel_slug,
    custom_domain:
      typeof window !== "undefined" ? window.location.hostname : undefined,
    user_name: params?.user_name,
    user_email: params?.user_email,
  });
};

export const trackGA4QuizComplete = (
  quizName?: string,
  result?: string,
  score?: number,
  params?: {
    funnel_id?: string;
    funnel_slug?: string;
    primary_style?: string;
    secondary_style?: string;
    user_name?: string;
  }
): void => {
  trackGA4Event("quiz_complete", {
    quiz_name: quizName,
    quiz_result: result,
    quiz_score: score,
    event_category: "conversion",
    funnel_id: params?.funnel_id,
    funnel_slug: params?.funnel_slug,
    custom_domain:
      typeof window !== "undefined" ? window.location.hostname : undefined,
    primary_style: params?.primary_style,
    secondary_style: params?.secondary_style,
    user_name: params?.user_name,
  });
};

export const trackGA4QuizQuestion = (
  questionNumber: number,
  questionText?: string,
  params?: {
    funnel_id?: string;
    funnel_slug?: string;
    answer?: string;
  }
): void => {
  trackGA4Event("quiz_question", {
    question_number: questionNumber,
    question_text: questionText,
    event_category: "engagement",
    funnel_id: params?.funnel_id,
    funnel_slug: params?.funnel_slug,
    custom_domain:
      typeof window !== "undefined" ? window.location.hostname : undefined,
    answer: params?.answer,
  });
};

/**
 * Track result view
 */
export const trackGA4ResultView = (
  resultType: string,
  params?: {
    funnel_id?: string;
    funnel_slug?: string;
    secondary_style?: string;
    user_name?: string;
  }
): void => {
  trackGA4Event("result_view", {
    event_category: "engagement",
    result_type: resultType,
    funnel_id: params?.funnel_id,
    funnel_slug: params?.funnel_slug,
    custom_domain:
      typeof window !== "undefined" ? window.location.hostname : undefined,
    secondary_style: params?.secondary_style,
    user_name: params?.user_name,
  });
};

/**
 * Track lead generation
 */
export const trackGA4Lead = (
  leadType: "email" | "phone" | "form",
  value?: number,
  params?: {
    funnel_id?: string;
    funnel_slug?: string;
  }
): void => {
  trackGA4Event("generate_lead", {
    lead_type: leadType,
    value,
    currency: "BRL",
    funnel_id: params?.funnel_id,
    funnel_slug: params?.funnel_slug,
    custom_domain:
      typeof window !== "undefined" ? window.location.hostname : undefined,
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

/**
 * Track button click (compatibilidade com analytics.ts)
 */
export const trackButtonClick = (
  buttonId: string,
  buttonText?: string,
  location?: string
): void => {
  trackGA4Event("button_click", {
    button_id: buttonId,
    button_text: buttonText || "unknown",
    button_location: location || "unknown",
    custom_domain:
      typeof window !== "undefined" ? window.location.hostname : undefined,
  });
};

/**
 * Track sale conversion (compatibilidade com analytics.ts)
 */
export const trackSaleConversion = (
  value: number,
  currency: string = "BRL",
  productName?: string
): void => {
  trackGA4Event("purchase", {
    value,
    currency,
    content_name: productName || "Product",
    content_type: "product",
    custom_domain:
      typeof window !== "undefined" ? window.location.hostname : undefined,
  });
};

/**
 * Capture UTM parameters
 */
export const captureUTMParameters = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
  ];

  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        if (ENABLE_DEBUG) {
          console.warn(`[GA4] Failed to store ${key} in localStorage`, e);
        }
      }
    }
  });

  if (Object.keys(utmParams).length > 0) {
    setGA4UserProperties(utmParams);
  }

  if (ENABLE_DEBUG) {
    console.log("[GA4] UTM parameters captured:", utmParams);
  }

  return utmParams;
};

// Auto-inicializar se estiver no browser
if (typeof window !== "undefined") {
  initGA4();
}
