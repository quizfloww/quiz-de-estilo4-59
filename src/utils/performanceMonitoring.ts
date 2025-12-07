/**
 * Performance Monitoring Utilities
 * Métricas de Web Vitals e performance para escala
 */

import { trackGA4Event } from "./googleAnalytics";
// import { addBreadcrumb, captureMessage } from "./sentry";

// Funções dummy do Sentry até configurar DSN
const addBreadcrumb = (...args: any[]) => {
  // Noop até Sentry configurado
};
const captureMessage = (...args: any[]) => {
  // Noop até Sentry configurado
};

// Configuração
const ENABLE_MONITORING =
  import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === "true";
const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === "production";

// Thresholds Web Vitals (Core Web Vitals)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 }, // First Input Delay
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
};

interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta?: number;
  id?: string;
}

/**
 * Calcula rating baseado em threshold
 */
const getRating = (
  value: number,
  threshold: { good: number; poor: number }
): "good" | "needs-improvement" | "poor" => {
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
};

/**
 * Report métrica para analytics
 */
const reportMetric = (metric: PerformanceMetric): void => {
  if (!ENABLE_MONITORING) return;

  // Log em desenvolvimento
  if (!IS_PRODUCTION) {
    console.log(
      `[Performance] ${metric.name}:`,
      metric.value.toFixed(2),
      `(${metric.rating})`
    );
  }

  // Enviar para GA4
  trackGA4Event("web_vitals", {
    metric_name: metric.name,
    metric_value: Math.round(metric.value),
    metric_rating: metric.rating,
    metric_delta: metric.delta ? Math.round(metric.delta) : undefined,
  });

  // Breadcrumb no Sentry
  addBreadcrumb(
    `Web Vital: ${metric.name}`,
    "performance",
    metric.rating === "poor" ? "warning" : "info",
    {
      value: metric.value,
      rating: metric.rating,
    }
  );

  // Alerta se performance ruim
  if (metric.rating === "poor") {
    captureMessage(
      `Poor performance: ${metric.name} = ${metric.value}ms`,
      "warning",
      { metric }
    );
  }
};

/**
 * Observa Largest Contentful Paint (LCP)
 */
const observeLCP = (): void => {
  if (!("PerformanceObserver" in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      reportMetric({
        name: "LCP",
        value: lastEntry.startTime,
        rating: getRating(lastEntry.startTime, THRESHOLDS.LCP),
      });
    });

    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch (error) {
    console.error("[Performance] Erro ao observar LCP:", error);
  }
};

/**
 * Observa First Input Delay (FID)
 */
const observeFID = (): void => {
  if (!("PerformanceObserver" in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        reportMetric({
          name: "FID",
          value: entry.processingStart - entry.startTime,
          rating: getRating(
            entry.processingStart - entry.startTime,
            THRESHOLDS.FID
          ),
        });
      });
    });

    observer.observe({ type: "first-input", buffered: true });
  } catch (error) {
    console.error("[Performance] Erro ao observar FID:", error);
  }
};

/**
 * Observa Cumulative Layout Shift (CLS)
 */
const observeCLS = (): void => {
  if (!("PerformanceObserver" in window)) return;

  let clsValue = 0;
  const clsEntries: PerformanceEntry[] = [];

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });

      reportMetric({
        name: "CLS",
        value: clsValue,
        rating: getRating(clsValue, THRESHOLDS.CLS),
      });
    });

    observer.observe({ type: "layout-shift", buffered: true });
  } catch (error) {
    console.error("[Performance] Erro ao observar CLS:", error);
  }
};

/**
 * Observa First Contentful Paint (FCP)
 */
const observeFCP = (): void => {
  if (!("PerformanceObserver" in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        reportMetric({
          name: "FCP",
          value: entry.startTime,
          rating: getRating(entry.startTime, THRESHOLDS.FCP),
        });
      });
    });

    observer.observe({ type: "paint", buffered: true });
  } catch (error) {
    console.error("[Performance] Erro ao observar FCP:", error);
  }
};

/**
 * Observa Time to First Byte (TTFB)
 */
const observeTTFB = (): void => {
  try {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;

      reportMetric({
        name: "TTFB",
        value: ttfb,
        rating: getRating(ttfb, THRESHOLDS.TTFB),
      });
    }
  } catch (error) {
    console.error("[Performance] Erro ao calcular TTFB:", error);
  }
};

/**
 * Observa resource timing
 */
export const trackResourceTiming = (resourceName: string): void => {
  if (!ENABLE_MONITORING) return;

  try {
    const resources = performance.getEntriesByName(resourceName);
    if (resources.length > 0) {
      const resource = resources[0] as PerformanceResourceTiming;

      trackGA4Event("resource_timing", {
        resource_name: resourceName,
        duration: Math.round(resource.duration),
        size: resource.transferSize,
        type: resource.initiatorType,
      });
    }
  } catch (error) {
    console.error("[Performance] Erro ao trackear resource:", error);
  }
};

/**
 * Marca performance mark
 */
export const markPerformance = (name: string): void => {
  if (!ENABLE_MONITORING) return;

  try {
    performance.mark(name);
  } catch (error) {
    console.error("[Performance] Erro ao marcar:", error);
  }
};

/**
 * Mede performance entre duas marks
 */
export const measurePerformance = (
  name: string,
  startMark: string,
  endMark: string
): number | null => {
  if (!ENABLE_MONITORING) return null;

  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];

    if (measure) {
      trackGA4Event("performance_measure", {
        measure_name: name,
        duration: Math.round(measure.duration),
      });

      return measure.duration;
    }
  } catch (error) {
    console.error("[Performance] Erro ao medir:", error);
  }

  return null;
};

/**
 * Limpa performance marks
 */
export const clearPerformanceMarks = (): void => {
  try {
    performance.clearMarks();
    performance.clearMeasures();
  } catch (error) {
    console.error("[Performance] Erro ao limpar marks:", error);
  }
};

/**
 * Get performance metrics summary
 */
export const getPerformanceSummary = (): Record<string, any> => {
  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;

  return {
    dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
    tcp: Math.round(navigation.connectEnd - navigation.connectStart),
    ttfb: Math.round(navigation.responseStart - navigation.requestStart),
    download: Math.round(navigation.responseEnd - navigation.responseStart),
    domInteractive: Math.round(navigation.domInteractive),
    domComplete: Math.round(navigation.domComplete),
    loadComplete: Math.round(
      navigation.loadEventEnd - navigation.loadEventStart
    ),
  };
};

/**
 * Inicializa monitoramento de performance
 */
export const initPerformanceMonitoring = (): void => {
  if (!ENABLE_MONITORING) {
    console.log("[Performance] Monitoramento desabilitado");
    return;
  }

  if (typeof window === "undefined") return;

  console.log("[Performance] Iniciando monitoramento...");

  // Observar Web Vitals
  observeLCP();
  observeFID();
  observeCLS();
  observeFCP();
  observeTTFB();

  // Log summary após load
  window.addEventListener("load", () => {
    setTimeout(() => {
      const summary = getPerformanceSummary();
      console.log("[Performance] Summary:", summary);

      trackGA4Event("page_load_complete", {
        ...summary,
      });
    }, 0);
  });
};

// Auto-inicializar
if (typeof window !== "undefined") {
  // Aguardar DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPerformanceMonitoring);
  } else {
    initPerformanceMonitoring();
  }
}
