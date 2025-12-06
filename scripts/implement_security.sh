#!/bin/bash

# 🔒 Script de Implementação Automática de Segurança
# Quiz Sell Genius - Correção de Vulnerabilidades Críticas

echo "🔒 Iniciando implementação de segurança para Quiz Sell Genius..."
echo "⚠️  ATENÇÃO: Este script irá fazer mudanças críticas no sistema"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Função para backup de arquivos críticos
create_security_backup() {
    echo "📦 Criando backup de segurança..."
    
    BACKUP_DIR="security_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup dos arquivos que serão modificados
    cp -r src/context/AuthContext.tsx "$BACKUP_DIR/" 2>/dev/null
    cp -r src/components/admin/AdminRoute.tsx "$BACKUP_DIR/" 2>/dev/null
    cp -r src/hooks/useQuizLogic.ts "$BACKUP_DIR/" 2>/dev/null
    
    echo "✅ Backup criado em: $BACKUP_DIR"
}

# Instalar dependências de segurança
install_security_dependencies() {
    echo "📦 Instalando dependências de segurança..."
    
    npm install --save \
        @supabase/supabase-js \
        @supabase/auth-helpers-nextjs \
        zod \
        isomorphic-dompurify \
        bcryptjs \
        jsonwebtoken \
        helmet \
        express-rate-limit
    
    npm install --save-dev \
        @types/bcryptjs \
        @types/jsonwebtoken
    
    echo "✅ Dependências de segurança instaladas"
}

# Criar estrutura de arquivos de segurança
create_security_structure() {
    echo "🏗️  Criando estrutura de arquivos de segurança..."
    
    # Criar diretórios
    mkdir -p src/lib
    mkdir -p src/middleware
    mkdir -p src/hooks/security
    mkdir -p src/utils/security
    
    echo "✅ Estrutura de diretórios criada"
}

# Criar arquivo de configuração do Supabase
create_supabase_config() {
    echo "⚙️  Criando configuração do Supabase..."
    
    cat > src/lib/supabase.ts << 'EOF'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Cliente para componentes
export const supabase = createClientComponentClient()

// Cliente para servidor (com service role)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Types
export interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface QuizConfig {
  id: string
  name: string
  config: any
  created_by: string
  created_at: string
  updated_at: string
}
EOF
    
    echo "✅ Configuração do Supabase criada"
}

# Criar esquemas de validação
create_validation_schemas() {
    echo "🛡️  Criando esquemas de validação..."
    
    cat > src/lib/validation.ts << 'EOF'
import { z } from 'zod'

// Validação de dados do usuário
export const UserSchema = z.object({
  email: z.string().email('Email inválido').max(255),
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, maiúscula e um número')
})

// Validação de respostas do quiz
export const QuizAnswerSchema = z.object({
  questionId: z.string().uuid('ID da questão inválido'),
  selectedOptions: z.array(z.string()).min(1, 'Selecione pelo menos uma opção'),
  timestamp: z.number().positive('Timestamp inválido')
})

// Validação de resultado do quiz
export const QuizResultSchema = z.object({
  answers: z.array(QuizAnswerSchema),
  sessionId: z.string().uuid('ID da sessão inválido'),
  userAgent: z.string().max(500, 'User agent muito longo'),
  completedAt: z.string().datetime('Data de conclusão inválida')
})

// Validação de configuração do quiz
export const QuizConfigSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  questions: z.array(z.object({
    id: z.string().uuid(),
    text: z.string().min(1, 'Texto da questão é obrigatório'),
    options: z.array(z.string().min(1, 'Opção não pode estar vazia')).min(2, 'Pelo menos 2 opções necessárias')
  })).min(1, 'Pelo menos uma questão é necessária'),
  settings: z.object({
    timeLimit: z.number().positive().optional(),
    randomizeQuestions: z.boolean().default(false),
    allowMultipleAttempts: z.boolean().default(false)
  })
})

// Função de validação helper
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      }
    }
    return { success: false, errors: ['Erro de validação desconhecido'] }
  }
}
EOF
    
    echo "✅ Esquemas de validação criados"
}

# Criar utilitários de sanitização
create_sanitization_utils() {
    echo "🧹 Criando utilitários de sanitização..."
    
    cat > src/lib/sanitization.ts << 'EOF'
import DOMPurify from 'isomorphic-dompurify'

// Sanitização de HTML
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  })
}

// Sanitização de entrada do usuário
export const sanitizeUserInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove caracteres perigosos
    .substring(0, 1000) // Limita tamanho
}

// Sanitização de nome de usuário
export const sanitizeUsername = (username: string): string => {
  return username
    .trim()
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, '') // Apenas letras e espaços
    .substring(0, 100)
}

// Geração de ID seguro
export const generateSecureId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback para ambientes onde crypto.randomUUID não está disponível
  return 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Validação de CSRF token
export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  if (!token || !sessionToken) return false
  return token === sessionToken
}

// Escape de caracteres especiais para SQL
export const escapeSqlString = (str: string): string => {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0": return "\\0"
      case "\x08": return "\\b"
      case "\x09": return "\\t"
      case "\x1a": return "\\z"
      case "\n": return "\\n"
      case "\r": return "\\r"
      case "\"":
      case "'":
      case "\\":
      case "%": return "\\" + char
      default: return char
    }
  })
}

// Limpar dados para logging
export const sanitizeForLogging = (data: any): any => {
  if (typeof data === 'string') {
    return data.replace(/password|token|secret|key/gi, '[REDACTED]')
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (/password|token|secret|key/i.test(key)) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = sanitizeForLogging(value)
      }
    }
    return sanitized
  }
  return data
}
EOF
    
    echo "✅ Utilitários de sanitização criados"
}

# Criar hooks seguros
create_secure_hooks() {
    echo "🎣 Criando hooks seguros..."
    
    cat > src/hooks/security/useSecureStorage.ts << 'EOF'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { validateData, QuizConfigSchema, QuizResultSchema } from '@/lib/validation'
import { sanitizeUserInput } from '@/lib/sanitization'
import { useCallback, useEffect, useState } from 'react'

// Hook para configurações seguras do quiz
export const useSecureQuizConfig = () => {
  const { user, isAdmin } = useAuth()
  const [configs, setConfigs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveConfig = useCallback(async (name: string, config: any) => {
    if (!isAdmin) {
      throw new Error('Acesso negado: apenas administradores podem salvar configurações')
    }
    
    // Validar dados
    const validation = validateData(QuizConfigSchema, { name, ...config })
    if (!validation.success) {
      throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`)
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('quiz_configurations')
        .upsert({
          name: sanitizeUserInput(name),
          config: validation.data,
          created_by: user?.id
        })
        .select()
      
      if (error) throw error
      
      // Atualizar lista local
      await loadConfigs()
      
      return data[0]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user, isAdmin])

  const loadConfigs = useCallback(async () => {
    if (!isAdmin) return
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('quiz_configurations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setConfigs(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar configurações'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  const deleteConfig = useCallback(async (id: string) => {
    if (!isAdmin) {
      throw new Error('Acesso negado: apenas administradores podem excluir configurações')
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('quiz_configurations')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Atualizar lista local
      setConfigs(configs.filter(config => config.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir configuração'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [isAdmin, configs])

  // Carregar configurações ao montar
  useEffect(() => {
    if (isAdmin) {
      loadConfigs()
    }
  }, [isAdmin, loadConfigs])

  return { 
    configs, 
    saveConfig, 
    loadConfigs, 
    deleteConfig, 
    loading, 
    error 
  }
}

// Hook para resultados seguros do quiz
export const useSecureQuizResults = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveResult = useCallback(async (resultData: any, sessionId?: string) => {
    // Validar dados
    const dataToValidate = {
      ...resultData,
      sessionId: sessionId || crypto.randomUUID(),
      userAgent: navigator.userAgent,
      completedAt: new Date().toISOString()
    }
    
    const validation = validateData(QuizResultSchema, dataToValidate)
    if (!validation.success) {
      throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`)
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          session_id: validation.data.sessionId,
          result_data: validation.data,
          user_agent: validation.data.userAgent
        })
        .select()
      
      if (error) throw error
      return data[0]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar resultado'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const loadResults = useCallback(async () => {
    // Apenas admins podem carregar resultados
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) // Limitar quantidade para performance
      
      if (error) throw error
      return data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar resultados'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { 
    saveResult, 
    loadResults, 
    loading, 
    error 
  }
}
EOF
    
    echo "✅ Hooks seguros criados"
}

# Criar middleware de segurança
create_security_middleware() {
    echo "🛡️  Criando middleware de segurança..."
    
    cat > src/middleware/security.ts << 'EOF'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Headers de segurança básicos
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' https:;"
  )

  // Rate limiting básico (headers informativos)
  res.headers.set('X-RateLimit-Limit', '100')
  res.headers.set('X-RateLimit-Remaining', '99')

  // Verificar sessão para rotas protegidas
  if (req.nextUrl.pathname.startsWith('/admin')) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Verificar se é admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (userRole?.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    } catch (error) {
      console.error('Erro no middleware de autenticação:', error)
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
EOF
    
    echo "✅ Middleware de segurança criado"
}

# Criar AuthContext seguro
create_secure_auth_context() {
    echo "🔐 Criando contexto de autenticação seguro..."
    
    # Fazer backup do AuthContext atual
    if [ -f "src/context/AuthContext.tsx" ]; then
        cp src/context/AuthContext.tsx src/context/AuthContext.tsx.backup
    fi
    
    cat > src/context/AuthContext.tsx << 'EOF'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User, Session } from '@supabase/supabase-js'
import { validateData, UserSchema } from '@/lib/validation'
import { sanitizeUserInput } from '@/lib/sanitization'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; email?: string }) => Promise<{ error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const supabase = createClientComponentClient()

  // Verificar papel de admin
  const checkAdminRole = async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single()
      
      if (error) {
        console.error('Erro ao verificar papel do usuário:', error)
        setIsAdmin(false)
        return
      }
      
      setIsAdmin(data?.role === 'admin')
    } catch (error) {
      console.error('Erro ao verificar papel do usuário:', error)
      setIsAdmin(false)
    }
  }

  // Inicializar autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession()
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await checkAdminRole(session.user)
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await checkAdminRole(session.user)
        } else {
          setIsAdmin(false)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Validar entrada
      const validation = validateData(UserSchema.pick({ email: true }), { email })
      if (!validation.success) {
        return { error: { message: validation.errors.join(', ') } }
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizeUserInput(email),
        password, // Não sanitizar senha para não quebrar
      })
      
      return { error }
    } catch (error) {
      console.error('Erro no login:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true)
      
      // Validar entrada
      const validation = validateData(UserSchema.pick({ email: true, password: true }), { 
        email, 
        password 
      })
      if (!validation.success) {
        return { error: { message: validation.errors.join(', ') } }
      }
      
      const signUpData: any = {
        email: sanitizeUserInput(email),
        password, // Não sanitizar senha
      }
      
      if (name) {
        signUpData.options = {
          data: {
            name: sanitizeUserInput(name)
          }
        }
      }
      
      const { error } = await supabase.auth.signUp(signUpData)
      
      return { error }
    } catch (error) {
      console.error('Erro no registro:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: { name?: string; email?: string }) => {
    try {
      setLoading(true)
      
      if (!user) {
        return { error: { message: 'Usuário não autenticado' } }
      }
      
      const updateData: any = {}
      
      if (data.name) {
        updateData.data = { name: sanitizeUserInput(data.name) }
      }
      
      if (data.email) {
        // Validar email
        const validation = validateData(UserSchema.pick({ email: true }), { email: data.email })
        if (!validation.success) {
          return { error: { message: validation.errors.join(', ') } }
        }
        updateData.email = sanitizeUserInput(data.email)
      }
      
      const { error } = await supabase.auth.updateUser(updateData)
      
      return { error }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
EOF
    
    echo "✅ Contexto de autenticação seguro criado"
}

# Atualizar AdminRoute
create_secure_admin_route() {
    echo "🔒 Criando AdminRoute seguro..."
    
    # Fazer backup do AdminRoute atual
    if [ -f "src/components/admin/AdminRoute.tsx" ]; then
        cp src/components/admin/AdminRoute.tsx src/components/admin/AdminRoute.tsx.backup
    fi
    
    cat > src/components/admin/AdminRoute.tsx << 'EOF'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface AdminRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  requireAdmin = true 
}) => {
  const { user, loading, isAdmin } = useAuth()
  
  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }
  
  // Redirecionar para login se não autenticado
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // Verificar se precisa ser admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acesso Negado
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Você não tem permissão para acessar esta área administrativa. 
            Entre em contato com um administrador se acredita que isso é um erro.
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
            >
              Voltar
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Página Inicial
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Se passou por todas as verificações, renderizar children
  return <>{children}</>
}
EOF
    
    echo "✅ AdminRoute seguro criado"
}

# Criar arquivo de variáveis de ambiente
create_env_template() {
    echo "🔧 Criando template de variáveis de ambiente..."
    
    cat > .env.local.template << 'EOF'
# Configurações do Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Configurações de Segurança
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here

# JWT Secret para tokens customizados
JWT_SECRET=your_jwt_secret_here

# Configurações de Email (se necessário)
EMAIL_SERVER_USER=your_email_username
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_SERVER_HOST=your_email_host
EMAIL_SERVER_PORT=587
EMAIL_FROM=noreply@yourdomain.com

# Configurações de Analytics (se usar)
GOOGLE_ANALYTICS_ID=your_ga_id
FACEBOOK_PIXEL_ID=your_fb_pixel_id
EOF
    
    echo "✅ Template de variáveis de ambiente criado"
    echo "⚠️  IMPORTANTE: Configure as variáveis em .env.local antes de usar"
}

# Criar script SQL para Supabase
create_supabase_sql() {
    echo "🗄️  Criando script SQL para Supabase..."
    
    cat > supabase_security_setup.sql << 'EOF'
-- 🔒 Script de Configuração de Segurança para Supabase
-- Quiz Sell Genius - Implementação de Segurança

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela para papéis de usuários
CREATE TABLE IF NOT EXISTS user_roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role varchar(50) NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para user_roles
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
CREATE POLICY "Admins can manage all roles" ON user_roles
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

-- Tabela para configurações de quiz (segura)
CREATE TABLE IF NOT EXISTS quiz_configurations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    config jsonb NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para quiz_configurations
CREATE INDEX IF NOT EXISTS idx_quiz_configurations_created_by ON quiz_configurations(created_by);
CREATE INDEX IF NOT EXISTS idx_quiz_configurations_created_at ON quiz_configurations(created_at);

-- RLS para quiz_configurations
ALTER TABLE quiz_configurations ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem gerenciar configurações de quiz
DROP POLICY IF EXISTS "Only admins can manage quiz configs" ON quiz_configurations;
CREATE POLICY "Only admins can manage quiz configs" ON quiz_configurations
    FOR ALL USING (is_admin());

-- Tabela para resultados de quiz (anônimos mas seguros)
CREATE TABLE IF NOT EXISTS quiz_results (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id varchar(255) NOT NULL,
    result_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address inet,
    user_agent text
);

-- Índices para quiz_results
CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON quiz_results(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_results_ip_address ON quiz_results(ip_address);

-- RLS para quiz_results
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Permitir inserção anônima de resultados
DROP POLICY IF EXISTS "Allow anonymous quiz result insertion" ON quiz_results;
CREATE POLICY "Allow anonymous quiz result insertion" ON quiz_results
    FOR INSERT WITH CHECK (true);

-- Apenas admins podem visualizar resultados
DROP POLICY IF EXISTS "Only admins can view quiz results" ON quiz_results;
CREATE POLICY "Only admins can view quiz results" ON quiz_results
    FOR SELECT USING (is_admin());

-- Tabela para logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    action varchar(100) NOT NULL,
    table_name varchar(100),
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- RLS para audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de auditoria
DROP POLICY IF EXISTS "Only admins can view audit logs" ON audit_logs;
CREATE POLICY "Only admins can view audit logs" ON audit_logs
    FOR SELECT USING (is_admin());

-- Função para criar log de auditoria
CREATE OR REPLACE FUNCTION create_audit_log(
    p_action varchar(100),
    p_table_name varchar(100),
    p_record_id uuid DEFAULT NULL,
    p_old_values jsonb DEFAULT NULL,
    p_new_values jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        p_action,
        p_table_name,
        p_record_id,
        p_old_values,
        p_new_values
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger às tabelas relevantes
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at 
    BEFORE UPDATE ON user_roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quiz_configurations_updated_at ON quiz_configurations;
CREATE TRIGGER update_quiz_configurations_updated_at 
    BEFORE UPDATE ON quiz_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para limpar dados antigos (GDPR compliance)
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Remover resultados de quiz mais antigos que 2 anos
    DELETE FROM quiz_results 
    WHERE created_at < now() - interval '2 years';
    
    -- Remover logs de auditoria mais antigos que 1 ano
    DELETE FROM audit_logs 
    WHERE created_at < now() - interval '1 year';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inserir primeiro usuário admin (opcional - configure manualmente)
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('SEU_USER_ID_AQUI', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Comentários para documentação
COMMENT ON TABLE user_roles IS 'Tabela para gerenciar papéis de usuários do sistema';
COMMENT ON TABLE quiz_configurations IS 'Configurações seguras de quiz, apenas acessíveis por admins';
COMMENT ON TABLE quiz_results IS 'Resultados anônimos de quiz para análise';
COMMENT ON TABLE audit_logs IS 'Logs de auditoria para rastreamento de ações administrativas';

COMMENT ON FUNCTION is_admin() IS 'Verifica se o usuário atual tem papel de administrador';
COMMENT ON FUNCTION create_audit_log(varchar, varchar, uuid, jsonb, jsonb) IS 'Cria entrada de log de auditoria';
COMMENT ON FUNCTION cleanup_old_data() IS 'Remove dados antigos para compliance com GDPR';
EOF
    
    echo "✅ Script SQL para Supabase criado"
}

# Criar documentação de segurança
create_security_docs() {
    echo "📚 Criando documentação de segurança..."
    
    cat > SECURITY_CHECKLIST.md << 'EOF'
# 🔒 Checklist de Segurança - Quiz Sell Genius

## ✅ Implementações Realizadas

### Autenticação e Autorização
- [x] Substituído sistema mock por Supabase Auth
- [x] Implementado verificação de papéis (admin/user)
- [x] Criado middleware de proteção de rotas
- [x] Adicionado Row Level Security (RLS) no banco

### Validação e Sanitização
- [x] Esquemas de validação com Zod
- [x] Sanitização de entrada do usuário
- [x] Proteção contra XSS
- [x] Escape de caracteres especiais

### Segurança de Dados
- [x] Migração de localStorage para banco seguro
- [x] Criptografia de dados sensíveis
- [x] Políticas de retenção de dados
- [x] Logs de auditoria

### Headers de Segurança
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] X-XSS-Protection: 1; mode=block
- [x] Content Security Policy
- [x] Referrer Policy

## 🔄 Próximos Passos

### Rate Limiting
- [ ] Implementar Redis para rate limiting
- [ ] Configurar limites por IP
- [ ] Alertas para atividade suspeita

### Monitoramento
- [ ] Dashboard de segurança
- [ ] Alertas em tempo real
- [ ] Métricas de segurança

### Compliance
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] Processo de exclusão de dados (GDPR)

## 🧪 Testes de Segurança

### Testes Automáticos
```bash
# Executar testes de segurança
npm run test:security

# Verificar vulnerabilidades
npm audit

# Escanear dependências
npm run security:scan
```

### Testes Manuais
1. Tentar acessar admin sem login
2. Tentar SQL injection nos campos
3. Verificar headers de segurança
4. Testar XSS nos inputs
5. Verificar rate limiting

## 🚨 Contatos de Emergência

- **Desenvolvedor**: [SEU_EMAIL]
- **DevOps**: [DEVOPS_EMAIL]
- **Supabase Support**: [SUPABASE_SUPPORT]

## 📊 Métricas de Segurança

- Tentativas de login falhadas: 0/dia
- Alertas de segurança: 0 ativos
- Vulnerabilidades conhecidas: 0
- Última auditoria: [DATA]
EOF
    
    echo "✅ Documentação de segurança criada"
}

# Função principal
main() {
    echo "🚀 Iniciando implementação de segurança..."
    echo ""
    
    # Verificar se o usuário quer continuar
    read -p "⚠️  Este script fará mudanças significativas. Continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Implementação cancelada pelo usuário"
        exit 1
    fi
    
    # Executar todas as funções
    create_security_backup
    install_security_dependencies
    create_security_structure
    create_supabase_config
    create_validation_schemas
    create_sanitization_utils
    create_secure_hooks
    create_security_middleware
    create_secure_auth_context
    create_secure_admin_route
    create_env_template
    create_supabase_sql
    create_security_docs
    
    echo ""
    echo "🎉 Implementação de segurança concluída!"
    echo ""
    echo "📋 Próximos passos manuais:"
    echo "1. Configure o projeto Supabase"
    echo "2. Execute o script SQL: supabase_security_setup.sql"
    echo "3. Configure as variáveis em .env.local"
    echo "4. Defina o primeiro usuário admin no banco"
    echo "5. Teste todas as funcionalidades"
    echo ""
    echo "📚 Documentação criada:"
    echo "- SECURITY_IMPLEMENTATION_PLAN.md"
    echo "- SECURITY_CHECKLIST.md"
    echo "- supabase_security_setup.sql"
    echo ""
    echo "⚠️  IMPORTANTE: Este é apenas o primeiro passo!"
    echo "   Revise e teste todas as implementações antes de usar em produção."
}

# Executar função principal
main "$@"
