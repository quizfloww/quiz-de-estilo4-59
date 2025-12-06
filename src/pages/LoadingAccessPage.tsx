import React from "react";
import FileLoadingSimulator from "@/components/loading/FileLoadingSimulator";
import { useParams } from "react-router-dom";

const LoadingAccessPage = () => {
  const { route } = useParams();

  // Definir as rotas disponíveis e seus redirecionamentos
  const routeMap: Record<string, string> = {
    editor: "/admin",
    admin: "/admin",
    dashboard: "/admin/dashboard",
  };

  // Determinar para onde redirecionar
  let redirectPath = route && routeMap[route] ? routeMap[route] : "/admin";

  // Configurações dinâmicas baseadas na rota
  const getSpeedForRoute = (route?: string): "slow" | "medium" | "fast" => {
    if (!route) return "medium";

    if (["editor"].includes(route)) {
      return "medium"; // Editores são médios
    }

    return "fast"; // Outras rotas são rápidas
  };

  const getTotalFiles = (route?: string): number => {
    if (!route) return 3700;

    if (["editor"].includes(route)) {
      return 3700; // Quantidade padrão para editores
    }

    return 2500; // Menos arquivos para outras rotas
  };

  return (
    <FileLoadingSimulator
      initialLoaded={2000}
      totalFiles={getTotalFiles(route)}
      redirectAfterComplete={redirectPath}
      speed={getSpeedForRoute(route)}
    />
  );
};

export default LoadingAccessPage;
