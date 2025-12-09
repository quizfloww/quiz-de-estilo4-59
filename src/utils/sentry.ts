/**
 * Sentry Error Tracking & Performance Monitoring
 * Sistema centralizado de monitoramento para produção
 */

import * as Sentry from "@sentry/react";

// Configurações do ambiente
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENVIRONMENT =
  import.meta.env.VITE_SENTRY_ENVIRONMENT || "production";
const TRACES_SAMPLE_RATE = parseFloat(
  import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || "0.2"
);
const REPLAYS_SESSION_SAMPLE_RATE = parseFloat(
  import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || "0.1"
);
const REPLAYS_ON_ERROR_SAMPLE_RATE = parseFloat(
  import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || "1.0"
);

const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === "production";
const ENABLE_DEBUG = !IS_PRODUCTION;

// Types para compatibilidade
export type SeverityLevel =
  | "fatal"
  | "error"
  | "warning"
  | "log"
  | "info"
  | "debug";

/**
 * Inicializa o Sentry
 */
export const initSentry = (): void => {
  // Não inicializar se DSN não estiver configurado
  if (!SENTRY_DSN) {
    if (ENABLE_DEBUG) {
      console.log(
        "[Sentry] DSN não configurado. Monitoramento desabilitado (configure VITE_SENTRY_DSN para habilitar)."
      );
    }
    return;
  }

  // Não inicializar se DSN não estiver configurado corretamente
  if (!SENTRY_DSN.includes("ingest.sentry.io")) {
    console.warn("[Sentry] DSN inválido. Ignorando inicialização.");
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,

      // Performance Monitoring - integrations opcionais
      integrations: [
        ...(typeof Sentry.browserTracingIntegration === "function"
          ? [
              Sentry.browserTracingIntegration(),
            ]
          : []),
        ...(typeof Sentry.replayIntegration === "function"
          ? [
              Sentry.replayIntegration({
                maskAllText: true,
                blockAllMedia: true,
              }),
            ]
          : []),
      ],

      // Sampling rates
      tracesSampleRate: TRACES_SAMPLE_RATE,
      replaysSessionSampleRate: REPLAYS_SESSION_SAMPLE_RATE,
      replaysOnErrorSampleRate: REPLAYS_ON_ERROR_SAMPLE_RATE,

      // Filtros e configurações adicionais
      beforeSend(event, hint) {
        // Filtrar erros conhecidos/irrelevantes
        const error = hint.originalException;

        if (error instanceof Error) {
          // Ignorar erros de extensões do browser
          if (error.message.includes("chrome-extension://")) {
            return null;
          }

          // Ignorar erros de rede temporários
          if (error.message.includes("Network request failed")) {
            return null;
          }

          // Ignorar erro de manifest
          if (error.message.includes("manifest")) {
            return null;
          }
        }

        return event;
      },

      // Ignora lista de URLs
      ignoreErrors: [
        // Erros comuns de browser extensions
        "top.GLOBALS",
        "originalCreateNotification",
        "canvas.contentDocument",
        "MyApp_RemoveAllHighlights",
        "atomicFindClose",
        // Network errors
        "NetworkError",
        "Failed to fetch",
        // Erros de ResizeObserver (benignos)
        "ResizeObserver loop limit exceeded",
      ],

      // Contexto adicional
      initialScope: {
        tags: {
          app_version: import.meta.env.VITE_APP_VERSION || "1.0.0",
        },
      },
    });

    if (ENABLE_DEBUG) {
      console.log("[Sentry] Inicializado com sucesso");
    }
  } catch (error) {
    console.error("[Sentry] Erro ao inicializar:", error);
  }
};

/**
 * Captura exceção manualmente
 */
export const captureException = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  if (ENABLE_DEBUG) {
    console.error("[Sentry] Exception captured:", error, context);
  }

  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Captura mensagem (warning/info)
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: Record<string, unknown>
): void => {
  if (ENABLE_DEBUG) {
    console.log(`[Sentry] Message (${level}):`, message, context);
  }

  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
};

/**
 * Set user context
 */
export const setSentryUser = (user: {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}): void => {
  Sentry.setUser(user);

  if (ENABLE_DEBUG) {
    console.log("[Sentry] User context set:", user);
  }
};

/**
 * Clear user context
 */
export const clearSentryUser = (): void => {
  Sentry.setUser(null);

  if (ENABLE_DEBUG) {
    console.log("[Sentry] User context cleared");
  }
};

/**
 * Add breadcrumb (rastro de ações)
 */
export const addBreadcrumb = (
  message: string,
  category?: string,
  level?: Sentry.SeverityLevel,
  data?: Record<string, unknown>
): void => {
  Sentry.addBreadcrumb({
    message,
    category,
    level: level || "info",
    data,
  });
};

/**
 * Set context data
 */
export const setSentryContext = (
  name: string,
  context: Record<string, unknown>
): void => {
  Sentry.setContext(name, context);
};

/**
 * Add tag
 */
export const setSentryTag = (key: string, value: string): void => {
  Sentry.setTag(key, value);
};

/**
 * Start transaction (performance monitoring)
 * Simplificado para evitar conflitos
 */
export const startTransaction = (name: string, op: string): undefined => {
  // Retorna undefined - performance será monitorado pelo performanceMonitoring.ts
  if (ENABLE_DEBUG) {
    console.log(`[Sentry] Transaction: ${name} (${op})`);
  }
  return undefined;
};

/**
 * Wrapper de função com error tracking
 */
export const withErrorBoundary = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  fallback?: unknown
): T => {
  return ((...args: unknown[]) => {
    try {
      return fn(...args);
    } catch (error) {
      captureException(error as Error, {
        function: fn.name,
        arguments: args,
      });
      return fallback;
    }
  }) as T;
};

/**
 * Async wrapper com error tracking
 */
export const withAsyncErrorBoundary = <
  T extends (...args: unknown[]) => Promise<unknown>
>(
  fn: T,
  fallback?: unknown
): T => {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error as Error, {
        function: fn.name,
        arguments: args,
      });
      return fallback;
    }
  }) as T;
};

/**
 * Performance timer
 */
export class PerformanceTimer {
  private name: string;
  private startTime: number;
  private transaction: ReturnType<typeof startTransaction> | undefined;

  constructor(name: string, op: string = "custom") {
    this.name = name;
    this.startTime = performance.now();
    this.transaction = startTransaction(name, op);
  }

  finish(): number {
    const duration = performance.now() - this.startTime;

    // startTransaction returns undefined - no finish method needed
    
    addBreadcrumb(`${this.name} completed`, "performance", "info", {
      duration,
    });

    return duration;
  }
}

// Auto-inicializar se estiver no browser
if (typeof window !== "undefined") {
  initSentry();
}
