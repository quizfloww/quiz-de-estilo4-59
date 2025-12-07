import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { QuizProvider } from "./context/QuizContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { captureUTMParameters } from "./utils/analytics";
import { loadFacebookPixelDynamic } from "./utils/facebookPixelDynamic";
import { trackGA4PageView } from "./utils/googleAnalytics";
// import { addBreadcrumb } from "./utils/sentry"; // Desabilitado até configurar Sentry
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CriticalCSSLoader from "./components/CriticalCSSLoader";
import { initialCriticalCSS, heroCriticalCSS } from "./utils/critical-css";
import { AdminRoute } from "./components/admin/AdminRoute";

const queryClient = new QueryClient();

// Componente de loading para Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" color="#B89B7A" className="mx-auto" />
      <p className="mt-4 text-gray-600">Carregando...</p>
    </div>
  </div>
);

// Lazy loading das páginas essenciais
const LandingPage = lazy(() => import("./pages/LandingPage"));
const QuizPage = lazy(() => import("./components/QuizPage"));
const DynamicQuizPage = lazy(() => import("./pages/DynamicQuizPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const QuizDescubraSeuEstilo = lazy(
  () => import("./pages/quiz-descubra-seu-estilo")
);
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const FunnelEditorPage = lazy(() => import("./pages/admin/FunnelEditorPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Componente interno para tracking de navegação
const NavigationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view no GA4
    trackGA4PageView(location.pathname + location.search);

    // Breadcrumb no Sentry - desabilitado até configurar
    // addBreadcrumb(`Navigation: ${location.pathname}`, "navigation", "info", {
    //   search: location.search,
    // });
  }, [location]);

  return null;
};

const App = () => {
  // Inicializar analytics na montagem do componente
  useEffect(() => {
    try {
      loadFacebookPixelDynamic();
      captureUTMParameters();

      console.log("App initialized with monitoring systems");
    } catch (error) {
      console.error("Erro ao inicializar aplicativo:", error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <QuizProvider>
          <TooltipProvider>
            <Router>
              <NavigationTracker />
              <CriticalCSSLoader
                cssContent={initialCriticalCSS}
                id="initial-critical"
                removeOnLoad={true}
              />
              <CriticalCSSLoader
                cssContent={heroCriticalCSS}
                id="hero-critical"
                removeOnLoad={true}
              />

              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Página inicial com teste A/B */}
                  <Route path="/" element={<LandingPage />} />
                  {/* Rota do quiz específica */}
                  <Route path="/quiz" element={<QuizPage />} />
                  {/* Quiz dinâmico por slug */}
                  <Route path="/quiz/:slug" element={<DynamicQuizPage />} />
                  {/* Rotas do teste A/B */}
                  <Route path="/resultado" element={<ResultPage />} />
                  <Route
                    path="/quiz-descubra-seu-estilo"
                    element={<QuizDescubraSeuEstilo />}
                  />
                  {/* Manter rota antiga para compatibilidade */}
                  <Route
                    path="/descubra-seu-estilo"
                    element={<QuizDescubraSeuEstilo />}
                  />
                  {/* Funnel Editor - full screen */}
                  <Route
                    path="/admin/funnels/:id/edit"
                    element={
                      <AdminAuthProvider>
                        <AdminRoute>
                          <FunnelEditorPage />
                        </AdminRoute>
                      </AdminAuthProvider>
                    }
                  />
                  {/* Admin - protegido com AdminAuthProvider */}
                  <Route
                    path="/admin/*"
                    element={
                      <AdminAuthProvider>
                        <AdminRoute>
                          <DashboardPage />
                        </AdminRoute>
                      </AdminAuthProvider>
                    }
                  />
                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Router>
            <Toaster />
          </TooltipProvider>
        </QuizProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
