// Hook para gerenciar testes A/B em blocos individuais
// Controla atribuição de variantes, persistência e tracking

import { useState, useEffect, useRef } from "react";
import { ABTestConfig } from "@/types/canvasBlocks";

interface WindowWithAnalytics extends Window {
  gtag?: (
    command: string,
    action: string,
    params: Record<string, unknown>
  ) => void;
  dataLayer?: Array<Record<string, unknown>>;
}

interface BlockABTestState {
  variant: string; // Pode ser qualquer ID de variante (ex: "A", "B", "C", "control", etc.)
  testName: string;
  isAssigned: boolean;
}

export function useBlockABTest(config?: ABTestConfig): BlockABTestState {
  const [variant, setVariant] = useState<string>("A");
  const [isAssigned, setIsAssigned] = useState(false);
  const hasAssignedRef = useRef(false);

  useEffect(() => {
    if (!config || !config.enabled || hasAssignedRef.current) {
      return;
    }

    const storageKey = `ab_test_block_${config.testName}`;

    // Tentar recuperar variante existente
    let assignedVariant = localStorage.getItem(storageKey);

    if (!assignedVariant) {
      // Atribuir nova variante baseada nos pesos
      assignedVariant = assignVariant(config.variants);
      localStorage.setItem(storageKey, assignedVariant);
    }

    setVariant(assignedVariant);
    setIsAssigned(true);
    hasAssignedRef.current = true;

    // Tracking de visualização
    const trackingEvents = config.trackingEvents;
    if (
      trackingEvents &&
      typeof trackingEvents === "object" &&
      !Array.isArray(trackingEvents) &&
      trackingEvents.view
    ) {
      trackEvent("ab_test_view", {
        test_name: config.testName,
        variant: assignedVariant,
        event_label: trackingEvents.view,
      });
    }
  }, [config]);

  return {
    variant,
    testName: config?.testName || "",
    isAssigned,
  };
}

// Atribui variante baseado nos pesos
function assignVariant(variants: ABTestConfig["variants"]): string {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);

  if (totalWeight !== 100) {
    console.warn(
      `A/B Test: Weights don't sum to 100 (got ${totalWeight}). Using equal distribution.`
    );
  }

  const random = Math.random() * 100;
  let cumulative = 0;

  for (const v of variants) {
    cumulative += v.weight;
    if (random <= cumulative) {
      return v.id;
    }
  }

  return variants[0]?.id || "A";
}

// Envia evento de tracking
function trackEvent(eventName: string, params: Record<string, unknown>) {
  const win = window as WindowWithAnalytics;

  if (typeof window !== "undefined" && win.gtag) {
    win.gtag("event", eventName, params);
  } else if (typeof window !== "undefined" && win.dataLayer) {
    win.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

// Hook para tracking de conversão em teste A/B
export function useBlockABTestConversion(testName: string, variant: string) {
  const trackConversion = (eventLabel?: string) => {
    trackEvent("ab_test_conversion", {
      test_name: testName,
      variant,
      event_label: eventLabel || "conversion",
      event_category: "ecommerce",
    });
  };

  return { trackConversion };
}

// Limpa todos os testes A/B de blocos do localStorage (útil para testes)
export function clearBlockABTests() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("ab_test_block_")) {
      localStorage.removeItem(key);
    }
  });
}

// Retorna todos os testes A/B de blocos ativos
export function getActiveBlockABTests(): Record<string, string> {
  const tests: Record<string, string> = {};
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.startsWith("ab_test_block_")) {
      const testName = key.replace("ab_test_block_", "");
      const variant = localStorage.getItem(key);
      if (variant) {
        tests[testName] = variant;
      }
    }
  });

  return tests;
}
