# 📘 Exemplos Práticos de Uso

Este documento contém exemplos práticos de como usar os novos sistemas implementados.

---

## 🎯 Google Analytics (GA4)

### Tracking Básico

```typescript
import {
  trackGA4Event,
  trackGA4PageView,
  trackGA4Lead,
} from "@/utils/googleAnalytics";

// Track evento customizado
trackGA4Event("button_click", {
  button_name: "cta_primary",
  page: "/landing",
});

// Track page view
trackGA4PageView("/quiz/resultado");

// Track lead gerado
trackGA4Lead("email", 0); // value = 0 (lead qualificado)
```

### Tracking de Quiz

```typescript
import {
  trackGA4QuizStart,
  trackGA4QuizComplete,
  trackGA4QuizQuestion,
} from "@/utils/googleAnalytics";

// Início do quiz
const handleQuizStart = () => {
  trackGA4QuizStart("Descubra Seu Estilo");
};

// Responder questão
const handleAnswer = (questionNumber: number) => {
  trackGA4QuizQuestion(questionNumber, "Qual seu estilo preferido?");
};

// Completar quiz
const handleComplete = (result: string) => {
  trackGA4QuizComplete("Descubra Seu Estilo", result, 85);
};
```

### Tracking de Conversão

```typescript
import { trackGA4Conversion } from "@/utils/googleAnalytics";

// Lead capturado
const handleEmailSubmit = (email: string) => {
  // Salvar no banco...

  // Track conversão
  trackGA4Conversion(50, "BRL", `lead_${Date.now()}`);
};
```

---

## 🐛 Sentry (Error Tracking)

### Captura Manual de Erros

```typescript
import {
  captureException,
  captureMessage,
  addBreadcrumb,
  setSentryUser,
} from "@/utils/sentry";

// Capturar exceção
try {
  await fetchUserData();
} catch (error) {
  captureException(error as Error, {
    context: "user_data_fetch",
    userId: user.id,
  });
}

// Mensagem de warning
captureMessage("Usuário tentou ação não permitida", "warning", {
  action: "delete_quiz",
  userId: user.id,
});

// Adicionar breadcrumb (rastro)
addBreadcrumb("User clicked submit button", "user_action", "info", {
  formData: { email: user.email },
});

// Setar contexto do usuário
setSentryUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

### Wrapper de Funções

```typescript
import { withErrorBoundary, withAsyncErrorBoundary } from "@/utils/sentry";

// Função síncrona com error tracking
const processData = withErrorBoundary((data: any) => {
  // Processamento que pode falhar
  return data.map((item) => item.value);
}, []); // fallback = []

// Função assíncrona com error tracking
const fetchData = withAsyncErrorBoundary(async (url: string) => {
  const response = await fetch(url);
  return response.json();
}, null); // fallback = null
```

### Performance Timer

```typescript
import { PerformanceTimer } from "@/utils/sentry";

const processLargeData = async (data: any[]) => {
  const timer = new PerformanceTimer("process_large_data", "processing");

  // Processamento pesado
  const result = await heavyProcessing(data);

  const duration = timer.finish();
  console.log(`Processamento levou ${duration}ms`);

  return result;
};
```

---

## 📊 Performance Monitoring

### Tracking Manual

```typescript
import {
  markPerformance,
  measurePerformance,
  trackResourceTiming,
} from "@/utils/performanceMonitoring";

// Marcar início
markPerformance("quiz_start");

// ... ações do usuário ...

// Marcar fim
markPerformance("quiz_complete");

// Medir duração
const duration = measurePerformance(
  "quiz_duration",
  "quiz_start",
  "quiz_complete"
);

console.log(`Quiz completado em ${duration}ms`);
```

### Resource Timing

```typescript
import { trackResourceTiming } from "@/utils/performanceMonitoring";

// Após carregar imagem importante
const img = new Image();
img.onload = () => {
  trackResourceTiming(img.src);
};
img.src = "https://cdn.com/hero-image.jpg";
```

---

## 🧪 Testes A/B

### Uso em Componente React

```typescript
import { useABTest } from "@/utils/abTesting";

const LandingPage = () => {
  const { variant, isVariantB, trackConversion, trackInteraction } =
    useABTest("landing_page");

  // Renderizar baseado na variante
  return (
    <div>
      {isVariantB ? <QuizHero /> : <TraditionalHero />}

      <button
        onClick={() => {
          trackInteraction("cta_click", "primary_button");
          trackConversion("button_click");
        }}
      >
        {isVariantB ? "Começar Quiz" : "Saiba Mais"}
      </button>
    </div>
  );
};
```

### Tracking Manual

```typescript
import {
  getABTestVariant,
  trackABTestConversion,
  trackABTestInteraction,
} from "@/utils/abTesting";

// Obter variante
const variant = getABTestVariant("landing_page");

// Track conversão
const handlePurchase = (value: number) => {
  trackABTestConversion("landing_page", "purchase", value);
};

// Track interação
const handleScroll = (depth: number) => {
  if (depth > 75) {
    trackABTestInteraction("landing_page", "scroll_deep", "75_percent");
  }
};
```

### Redirecionamento Automático

```typescript
import { redirectToCorrectVariant } from "@/utils/abTesting";

// No componente de rota
useEffect(() => {
  // Redireciona usuário para variante correta
  redirectToCorrectVariant("landing_page");
}, []);
```

---

## 🔐 Validação e Segurança

### Validação de Formulários

```typescript
import { validators, sanitizers } from "@/utils/validation";

// Validar email
const handleEmailSubmit = (email: string) => {
  if (!validators.email(email)) {
    toast.error("Email inválido");
    return;
  }

  // Sanitizar antes de salvar
  const cleanEmail = sanitizers.text(email);
  saveToDatabase(cleanEmail);
};

// Validar telefone
const handlePhoneSubmit = (phone: string) => {
  if (!validators.phone(phone)) {
    toast.error("Telefone inválido");
    return;
  }

  savePhone(phone);
};
```

### Sanitização de Dados

```typescript
import { sanitizeHTML, sanitizeObject } from "@/utils/validation";

// Sanitizar HTML (prevenir XSS)
const handleRichTextSubmit = (content: string) => {
  const cleanContent = sanitizeHTML(content);
  saveContent(cleanContent);
};

// Sanitizar objeto (whitelist de campos)
const handleFormSubmit = (formData: any) => {
  const cleanData = sanitizeObject(formData, [
    "name",
    "email",
    "phone",
    "message",
  ]);

  saveToDatabase(cleanData);
};
```

### Rate Limiting

```typescript
import { checkRateLimit } from "@/utils/validation";

const handleFormSubmit = async (data: any) => {
  const userIP = getUserIP(); // função fictícia

  // Permitir no máximo 5 submissões em 60 segundos
  if (!checkRateLimit(userIP, 5, 60000)) {
    toast.error("Muitas tentativas. Aguarde 1 minuto.");
    return;
  }

  await submitForm(data);
};
```

---

## 🎨 Componente Completo com Todos os Sistemas

```typescript
import React, { useEffect, useState } from "react";
import { useABTest } from "@/utils/abTesting";
import { trackGA4Event } from "@/utils/googleAnalytics";
import { captureException, addBreadcrumb } from "@/utils/sentry";
import { validators, sanitizers } from "@/utils/validation";
import {
  markPerformance,
  measurePerformance,
} from "@/utils/performanceMonitoring";

interface QuizFormProps {
  onComplete: (result: string) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ onComplete }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { variant, trackConversion, trackInteraction } =
    useABTest("landing_page");

  useEffect(() => {
    // Marcar início do componente
    markPerformance("quiz_form_mount");

    // Breadcrumb para debugging
    addBreadcrumb("QuizForm mounted", "ui", "info", { variant });

    return () => {
      // Medir tempo total
      measurePerformance(
        "quiz_form_lifetime",
        "quiz_form_mount",
        "quiz_form_unmount"
      );
      markPerformance("quiz_form_unmount");
    };
  }, [variant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar email
    if (!validators.email(email)) {
      trackGA4Event("validation_error", { field: "email" });
      alert("Email inválido");
      return;
    }

    // Sanitizar
    const cleanEmail = sanitizers.text(email);

    setLoading(true);
    markPerformance("submit_start");

    try {
      // Simular envio
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Track conversão
      trackConversion("email_submit");
      trackGA4Event("lead_generated", { email: cleanEmail });

      // Medir performance
      measurePerformance("submit_duration", "submit_start", "submit_end");
      markPerformance("submit_end");

      onComplete("success");
    } catch (error) {
      // Capturar erro
      captureException(error as Error, {
        context: "quiz_form_submit",
        email: cleanEmail,
        variant,
      });

      trackGA4Event("form_error", { error: (error as Error).message });
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          trackInteraction("field_edit", "email");
        }}
        placeholder="Seu melhor email"
        required
      />

      <button
        type="submit"
        disabled={loading}
        onClick={() => trackInteraction("button_click", "submit")}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
};

export default QuizForm;
```

---

## 🎬 Exemplo: Página Completa

```typescript
import React, { useEffect } from "react";
import { useABTest } from "@/utils/abTesting";
import { trackGA4PageView } from "@/utils/googleAnalytics";
import { setSentryTag } from "@/utils/sentry";
import QuizForm from "./QuizForm";

const LandingPage = () => {
  const { variant, isVariantB } = useABTest("landing_page");

  useEffect(() => {
    // Track page view
    trackGA4PageView("/landing", "Landing Page");

    // Tag no Sentry
    setSentryTag("ab_variant", variant);

    // Tag no GA4
    window.gtag?.("set", "user_properties", {
      ab_test_variant: variant,
    });
  }, [variant]);

  return (
    <div className="landing-page">
      <h1>
        {isVariantB
          ? "Descubra Seu Estilo em 2 Minutos"
          : "Transforme Seu Visual"}
      </h1>

      <QuizForm
        onComplete={(result) => {
          console.log("Quiz completed:", result);
        }}
      />
    </div>
  );
};

export default LandingPage;
```

---

## 📱 Exemplo: Hook Customizado

```typescript
import { useEffect, useCallback } from "react";
import { trackGA4Event } from "@/utils/googleAnalytics";
import { addBreadcrumb } from "@/utils/sentry";

export const usePageTracking = (pageName: string) => {
  useEffect(() => {
    // Track pageview
    trackGA4Event("page_view", { page_name: pageName });

    // Breadcrumb
    addBreadcrumb(`Viewed ${pageName}`, "navigation", "info");
  }, [pageName]);

  const trackAction = useCallback(
    (action: string, data?: any) => {
      trackGA4Event(`${pageName}_${action}`, data);
      addBreadcrumb(`Action: ${action}`, "user_action", "info", data);
    },
    [pageName]
  );

  return { trackAction };
};

// Uso:
const MyPage = () => {
  const { trackAction } = usePageTracking("quiz_results");

  return (
    <button onClick={() => trackAction("download_result")}>Download</button>
  );
};
```

---

## 🧩 Integração com Componentes Existentes

### Adicionar tracking a botões existentes:

```typescript
// Antes:
<Button onClick={handleClick}>Clique Aqui</Button>;

// Depois:
import { trackGA4Event } from "@/utils/googleAnalytics";

<Button
  onClick={() => {
    trackGA4Event("button_click", { button_id: "cta_primary" });
    handleClick();
  }}
>
  Clique Aqui
</Button>;
```

### Adicionar validação a forms existentes:

```typescript
// Antes:
const handleSubmit = (data) => {
  saveData(data);
};

// Depois:
import { validators, sanitizers } from "@/utils/validation";

const handleSubmit = (data) => {
  // Validar
  if (!validators.email(data.email)) return;

  // Sanitizar
  const clean = sanitizers.object(data, ["email", "name", "phone"]);

  saveData(clean);
};
```

---

**Documentação:** [GUIA-SETUP-ESCALA.md](./GUIA-SETUP-ESCALA.md)  
**Última atualização:** Dezembro 2024
