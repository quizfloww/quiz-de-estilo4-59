/**
 * Sistema de Testes A/B
 * Gerenciamento centralizado de variantes para otimização de conversão
 */

import { trackGA4Event } from "./googleAnalytics";
// import { addBreadcrumb } from "./sentry";

// Função dummy do Sentry até configurar DSN
const addBreadcrumb = (...args: unknown[]) => {
  // Noop até Sentry configurado
};

// Configuração
const AB_TEST_ACTIVE = import.meta.env.VITE_AB_TEST_ACTIVE === "true";
const VARIANT_A_WEIGHT = parseInt(
  import.meta.env.VITE_AB_TEST_VARIANT_A_WEIGHT || "50",
  10
);
const VARIANT_B_WEIGHT = parseInt(
  import.meta.env.VITE_AB_TEST_VARIANT_B_WEIGHT || "50",
  10
);
const STORAGE_KEY = "ab_test_variant";
const ENABLE_DEBUG = import.meta.env.VITE_APP_ENV !== "production";

export type ABTestVariant = "A" | "B";

export interface ABTestConfig {
  name: string;
  description: string;
  variantA: {
    name: string;
    path: string;
    description: string;
  };
  variantB: {
    name: string;
    path: string;
    description: string;
  };
  active: boolean;
}

/**
 * Configurações de testes A/B disponíveis
 */
export const AB_TESTS: Record<string, ABTestConfig> = {
  landing_page: {
    name: "Landing Page Test",
    description: "Teste de conversão entre duas versões da landing page",
    variantA: {
      name: "Original",
      path: "/",
      description: "Página original com hero padrão",
    },
    variantB: {
      name: "Quiz First",
      path: "/quiz-descubra-seu-estilo",
      description: "Quiz como primeira interação",
    },
    active: AB_TEST_ACTIVE,
  },
};

/**
 * Obtém variante atual do usuário
 */
export const getABTestVariant = (
  testName: string = "landing_page"
): ABTestVariant => {
  if (typeof window === "undefined") return "A";

  const test = AB_TESTS[testName];
  if (!test || !test.active) {
    return "A"; // Retorna controle se teste inativo
  }

  // Verifica localStorage
  const stored = localStorage.getItem(`${STORAGE_KEY}_${testName}`);
  if (stored === "A" || stored === "B") {
    return stored;
  }

  // Gera nova variante baseada em peso
  const variant = Math.random() * 100 < VARIANT_A_WEIGHT ? "A" : "B";

  // Salva no localStorage
  localStorage.setItem(`${STORAGE_KEY}_${testName}`, variant);

  // Track assignment
  trackABTestAssignment(testName, variant);

  return variant;
};

/**
 * Define variante manualmente (útil para testes)
 */
export const setABTestVariant = (
  testName: string,
  variant: ABTestVariant
): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(`${STORAGE_KEY}_${testName}`, variant);

  if (ENABLE_DEBUG) {
    console.log(`[A/B Test] Variant set manually: ${testName} = ${variant}`);
  }
};

/**
 * Track assignment de variante
 */
export const trackABTestAssignment = (
  testName: string,
  variant: ABTestVariant
): void => {
  const test = AB_TESTS[testName];
  if (!test) return;

  const variantData = variant === "A" ? test.variantA : test.variantB;

  // Track no GA4
  trackGA4Event("ab_test_assignment", {
    test_name: testName,
    variant: variant,
    variant_name: variantData.name,
    variant_path: variantData.path,
  });

  // Breadcrumb no Sentry
  addBreadcrumb(`A/B Test Assignment: ${testName}`, "ab_test", "info", {
    variant,
    variant_name: variantData.name,
  });

  if (ENABLE_DEBUG) {
    console.log(
      `[A/B Test] Assignment: ${testName} = ${variant} (${variantData.name})`
    );
  }
};

/**
 * Track conversão de variante
 */
export const trackABTestConversion = (
  testName: string,
  conversionType: string,
  value?: number
): void => {
  const variant = getABTestVariant(testName);
  const test = AB_TESTS[testName];

  if (!test) return;

  // Track no GA4
  trackGA4Event("ab_test_conversion", {
    test_name: testName,
    variant: variant,
    conversion_type: conversionType,
    value: value,
  });

  // Breadcrumb no Sentry
  addBreadcrumb(`A/B Test Conversion: ${testName}`, "ab_test", "info", {
    variant,
    conversion_type: conversionType,
    value,
  });

  if (ENABLE_DEBUG) {
    console.log(
      `[A/B Test] Conversion: ${testName} (${variant}) - ${conversionType}`,
      value
    );
  }
};

/**
 * Track interação com elemento da variante
 */
export const trackABTestInteraction = (
  testName: string,
  interactionType: string,
  elementName?: string
): void => {
  const variant = getABTestVariant(testName);

  trackGA4Event("ab_test_interaction", {
    test_name: testName,
    variant: variant,
    interaction_type: interactionType,
    element_name: elementName,
  });

  if (ENABLE_DEBUG) {
    console.log(
      `[A/B Test] Interaction: ${testName} (${variant}) - ${interactionType}`
    );
  }
};

/**
 * Reseta variante (força novo assignment)
 */
export const resetABTestVariant = (testName: string): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(`${STORAGE_KEY}_${testName}`);

  if (ENABLE_DEBUG) {
    console.log(`[A/B Test] Variant reset: ${testName}`);
  }
};

/**
 * Reseta todos os testes A/B
 */
export const resetAllABTests = (): void => {
  if (typeof window === "undefined") return;

  Object.keys(AB_TESTS).forEach((testName) => {
    resetABTestVariant(testName);
  });

  if (ENABLE_DEBUG) {
    console.log("[A/B Test] All variants reset");
  }
};

/**
 * Obtém URL da variante
 */
export const getABTestURL = (testName: string = "landing_page"): string => {
  const variant = getABTestVariant(testName);
  const test = AB_TESTS[testName];

  if (!test) return "/";

  return variant === "A" ? test.variantA.path : test.variantB.path;
};

/**
 * Verifica se está na variante correta
 */
export const isCorrectVariant = (
  testName: string,
  currentPath: string
): boolean => {
  const variant = getABTestVariant(testName);
  const test = AB_TESTS[testName];

  if (!test) return true;

  const expectedPath =
    variant === "A" ? test.variantA.path : test.variantB.path;
  return currentPath === expectedPath;
};

/**
 * Redireciona para variante correta (se necessário)
 */
export const redirectToCorrectVariant = (
  testName: string = "landing_page"
): void => {
  if (typeof window === "undefined") return;

  const test = AB_TESTS[testName];
  if (!test || !test.active) return;

  const currentPath = window.location.pathname;

  // Não redirecionar se já estiver na URL correta
  if (isCorrectVariant(testName, currentPath)) return;

  // Não redirecionar de páginas internas
  if (
    currentPath.startsWith("/admin") ||
    currentPath.startsWith("/resultado") ||
    currentPath.includes("/quiz/")
  ) {
    return;
  }

  const targetURL = getABTestURL(testName);

  if (ENABLE_DEBUG) {
    console.log(`[A/B Test] Redirecting to variant: ${targetURL}`);
  }

  window.location.href = targetURL;
};

/**
 * Hook React para usar A/B Test
 */
export const useABTest = (testName: string = "landing_page") => {
  const variant = getABTestVariant(testName);
  const test = AB_TESTS[testName];

  return {
    variant,
    isVariantA: variant === "A",
    isVariantB: variant === "B",
    test,
    trackConversion: (conversionType: string, value?: number) =>
      trackABTestConversion(testName, conversionType, value),
    trackInteraction: (interactionType: string, elementName?: string) =>
      trackABTestInteraction(testName, interactionType, elementName),
    reset: () => resetABTestVariant(testName),
  };
};

interface ABTestStats {
  [key: string]: ABTestConfig & {
    currentVariant: ABTestVariant;
    active: boolean;
    weights: {
      variantA: number;
      variantB: number;
    };
  };
}

/**
 * Obtém estatísticas dos testes (para admin)
 */
export const getABTestStats = (): ABTestStats => {
  const stats: ABTestStats = {} as ABTestStats;

  Object.entries(AB_TESTS).forEach(([testName, test]) => {
    stats[testName] = {
      ...test,
      currentVariant: getABTestVariant(testName),
      active: test.active,
      weights: {
        variantA: VARIANT_A_WEIGHT,
        variantB: VARIANT_B_WEIGHT,
      },
    };
  });

  return stats;
};

// Log de inicialização
if (typeof window !== "undefined" && ENABLE_DEBUG) {
  console.log("[A/B Test] Sistema inicializado", {
    active: AB_TEST_ACTIVE,
    tests: Object.keys(AB_TESTS),
    weights: { A: VARIANT_A_WEIGHT, B: VARIANT_B_WEIGHT },
  });
}
