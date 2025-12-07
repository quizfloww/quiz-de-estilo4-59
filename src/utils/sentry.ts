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

/**
 * Inicializa o Sentry
 */
export const initSentry = (): void => {
  if (!SENTRY_DSN) {
    if (ENABLE_DEBUG) {
      console.warn(
        "[Sentry] DSN não configurado. Monitoramento de erros desabilitado."
      );
    }
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,

      // Performance Monitoring
      integrations: [
        Sentry.browserTracingIntegration({
          // Tracking de navegação
          tracePropagationTargets: ["localhost", /^https:\/\/yourapp\.com/],
        }),
        Sentry.replayIntegration({
          // Session Replay para debugging
          maskAllText: true,
          blockAllMedia: true,
        }),
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
  context?: Record<string, any>
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
  context?: Record<string, any>
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
  [key: string]: any;
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
  data?: Record<string, any>
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
  context: Record<string, any>
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
 * Nota: startTransaction está deprecated no Sentry v8+
 * Use startSpan() para novas implementações
 */
export const startTransaction = (name: string, op: string): any => {
  // Compatibilidade com versão atual do Sentry
  if (typeof Sentry.startSpan === "function") {
    return Sentry.startSpan({ name, op }, (span) => span);
  }
  return undefined;
};

/**
 * Wrapper de função com error tracking
 */
export const withErrorBoundary = <T extends (...args: any[]) => any>(
  fn: T,
  fallback?: any
): T => {
  return ((...args: any[]) => {
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
  T extends (...args: any[]) => Promise<any>
>(
  fn: T,
  fallback?: any
): T => {
  return (async (...args: any[]) => {
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
  private transaction?: any;

  constructor(name: string, op: string = "custom") {
    this.name = name;
    this.startTime = performance.now();
    this.transaction = startTransaction(name, op);
  }

  finish(): number {
    const duration = performance.now() - this.startTime;

    if (this.transaction && typeof this.transaction.finish === "function") {
      this.transaction.finish();
    }

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
