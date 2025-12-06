# 🔒 Plano de Implementação de Segurança - Quiz Sell Genius

## 🎯 Objetivo

Resolver vulnerabilidades críticas de segurança identificadas no projeto Quiz Sell Genius, migrando de um sistema de autenticação mock para uma implementação segura e robusta.

## 🚨 Vulnerabilidades Críticas Identificadas

### 1. **CRÍTICO: Sistema de Autenticação Mock**

- **Arquivo**: `/src/context/AuthContext.tsx`
- **Problema**: Autenticação baseada apenas em localStorage
- **Risco**: Qualquer usuário pode obter acesso admin modificando localStorage
- **Impacto**: Comprometimento total do sistema administrativo

### 2. **ALTO: Uso Extensivo de localStorage para Dados Sensíveis**

- **Instâncias**: 202+ ocorrências em 63 arquivos
- **Dados Expostos**:
  - `userName`, `userEmail`, `userRole`
  - Tokens fictícios
  - Configurações de negócio
  - Dados de analytics

### 3. **MÉDIO: Exposição de Chaves API**

- **Localização**: Código JavaScript compilado
- **Problema**: Chaves de API visíveis no cliente

### 4. **MÉDIO: Ausência de Validação e Proteção**

- Sem validação de entrada
- Sem proteção CSRF
- Sem sanitização XSS
- Sem rate limiting

## 📋 FASE 1: Autenticação Real com Supabase (CRÍTICA)

### 1.1 Configuração do Supabase

```bash
# Instalar dependências
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Configurar variáveis de ambiente
echo "NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role" >> .env.local
```

### 1.2 Substituir AuthContext Mock

**Arquivo**: `/src/context/AuthContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminRole(session?.user);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminRole(session?.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setIsAdmin(data?.role === "admin");
    } catch (error) {
      console.error("Erro ao verificar papel do usuário:", error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
```

### 1.3 Atualizar AdminRoute com Verificação Real

**Arquivo**: `/src/components/admin/AdminRoute.tsx`

```typescript
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  requireAdmin = true,
}) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-4">
            Você não tem permissão para acessar esta área administrativa.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

### 1.4 Configuração do Banco de Dados

**SQL para Supabase**:

```sql
-- Tabela para papéis de usuários
CREATE TABLE user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role varchar(50) NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- RLS (Row Level Security)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio papel
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Política para admins gerenciarem papéis
CREATE POLICY "Admins can manage roles" ON user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configurações de quiz seguras
CREATE TABLE quiz_configurations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    config jsonb NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE quiz_configurations ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem gerenciar configurações
CREATE POLICY "Only admins can manage quiz configs" ON quiz_configurations
    FOR ALL USING (is_admin());

-- Resultados de quiz anônimos
CREATE TABLE quiz_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id varchar(255),
    result_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address inet,
    user_agent text
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Política para inserção anônima
CREATE POLICY "Allow anonymous quiz result insertion" ON quiz_results
    FOR INSERT WITH CHECK (true);

-- Apenas admins podem ver resultados
CREATE POLICY "Only admins can view quiz results" ON quiz_results
    FOR SELECT USING (is_admin());
```

## 📋 FASE 2: Migração de localStorage para Banco Seguro

### 2.1 Criar Hooks Seguros para Dados

**Arquivo**: `/src/hooks/useSecureStorage.ts`

```typescript
import { useAuth } from "@/context/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useCallback, useEffect, useState } from "react";

export const useSecureQuizConfig = () => {
  const { user, isAdmin } = useAuth();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const saveConfig = useCallback(
    async (name: string, config: any) => {
      if (!isAdmin) throw new Error("Acesso negado");

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("quiz_configurations")
          .upsert({
            name,
            config,
            created_by: user?.id,
          })
          .select();

        if (error) throw error;
        return data[0];
      } finally {
        setLoading(false);
      }
    },
    [user, isAdmin, supabase]
  );

  const loadConfigs = useCallback(async () => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quiz_configurations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConfigs(data || []);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, supabase]);

  return { configs, saveConfig, loadConfigs, loading };
};

export const useSecureQuizResults = () => {
  const supabase = createClientComponentClient();

  const saveResult = useCallback(
    async (resultData: any, sessionId?: string) => {
      const { data, error } = await supabase
        .from("quiz_results")
        .insert({
          session_id: sessionId || crypto.randomUUID(),
          result_data: resultData,
          ip_address: null, // Será preenchido pelo servidor
          user_agent: navigator.userAgent,
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    [supabase]
  );

  return { saveResult };
};
```

### 2.2 Middleware de Segurança

**Arquivo**: `/src/middleware/security.ts`

```typescript
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Verificar sessão
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Proteger rotas administrativas
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Verificar se é admin
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (userRole?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Headers de segurança
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; connect-src 'self' https:;"
  );

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## 📋 FASE 3: Validação e Sanitização

### 3.1 Esquemas de Validação

**Arquivo**: `/src/lib/validation.ts`

```typescript
import { z } from "zod";

export const QuizAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedOptions: z.array(z.string()).min(1),
  timestamp: z.number().positive(),
});

export const QuizResultSchema = z.object({
  answers: z.array(QuizAnswerSchema),
  sessionId: z.string().uuid(),
  userAgent: z.string().max(500),
  completedAt: z.string().datetime(),
});

export const QuizConfigSchema = z.object({
  name: z.string().min(1).max(255),
  questions: z.array(
    z.object({
      id: z.string().uuid(),
      text: z.string().min(1),
      options: z.array(z.string().min(1)),
    })
  ),
  settings: z.object({
    timeLimit: z.number().positive().optional(),
    randomizeQuestions: z.boolean().default(false),
  }),
});

export const UserInputSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/),
  message: z.string().max(1000).optional(),
});
```

### 3.2 Utilitários de Sanitização

**Arquivo**: `/src/lib/sanitization.ts`

```typescript
import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
  });
};

export const sanitizeUserInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"'&]/g, "") // Remove caracteres perigosos
    .substring(0, 1000); // Limita tamanho
};

export const generateSecureId = (): string => {
  return crypto.randomUUID();
};

export const validateCSRFToken = (
  token: string,
  sessionToken: string
): boolean => {
  // Implementar validação CSRF adequada
  return token === sessionToken;
};
```

## 📋 FASE 4: Implementação de Rate Limiting

### 4.1 Rate Limiting com Redis

**Arquivo**: `/src/lib/rateLimit.ts`

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface RateLimitOptions {
  key: string;
  limit: number;
  window: number; // em segundos
}

export async function rateLimit({ key, limit, window }: RateLimitOptions) {
  const now = Date.now();
  const pipeline = redis.pipeline();

  pipeline.zremrangebyscore(key, 0, now - window * 1000);
  pipeline.zadd(key, { score: now, member: now });
  pipeline.zcount(key, 0, "+inf");
  pipeline.expire(key, window);

  const results = await pipeline.exec();
  const count = results[2] as number;

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: new Date(now + window * 1000),
  };
}

// Middleware para API routes
export function withRateLimit(limit: number, window: number) {
  return async (req: any, res: any, next: any) => {
    const ip = req.ip || req.connection.remoteAddress;
    const result = await rateLimit({
      key: `rate_limit:${ip}`,
      limit,
      window,
    });

    if (!result.success) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: result.reset,
      });
    }

    return next();
  };
}
```

## 📋 Cronograma de Implementação

### **Semana 1: CRÍTICO**

- [x] Configurar Supabase
- [x] Implementar AuthContext real
- [x] Atualizar AdminRoute
- [x] Migrar primeira funcionalidade crítica

### **Semana 2: ALTO**

- [ ] Migrar todo localStorage para banco
- [ ] Implementar middleware de segurança
- [ ] Adicionar validação de entrada

### **Semana 3: MÉDIO**

- [ ] Implementar rate limiting
- [ ] Adicionar sanitização XSS
- [ ] Configurar CSP headers

### **Semana 4: MONITORAMENTO**

- [ ] Implementar logging de segurança
- [ ] Configurar alertas
- [ ] Testes de penetração básicos

## 🔍 Verificação e Testes

### Checklist de Segurança

- [ ] ✅ Autenticação real implementada
- [ ] ✅ Dados sensíveis fora do localStorage
- [ ] ✅ Validação de entrada ativa
- [ ] ✅ Proteção CSRF implementada
- [ ] ✅ Rate limiting configurado
- [ ] ✅ Headers de segurança ativos
- [ ] ✅ Logs de auditoria funcionando

### Comandos de Teste

```bash
# Testar autenticação
npm run test:auth

# Verificar headers de segurança
curl -I https://seudominio.com

# Testar rate limiting
for i in {1..10}; do curl https://seudominio.com/api/quiz; done

# Escanear vulnerabilidades
npm audit
```

## 🚨 Ações Imediatas Recomendadas

1. **IMPLEMENTAR IMEDIATAMENTE**: Nova autenticação com Supabase
2. **MIGRAR URGENTE**: Dados do localStorage para banco seguro
3. **CONFIGURAR**: Headers de segurança básicos
4. **MONITORAR**: Logs de acesso administrativo

---

**⚠️ ALERTA**: O sistema atual está vulnerável a ataques básicos. A implementação dessas medidas é CRÍTICA para a segurança do negócio.
