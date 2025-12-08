import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from "vite-plugin-compression";
import { componentTagger } from "./src/plugins/lovable-component-tagger.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: ".",
  base: "/",

  server: {
    host: "0.0.0.0",
    port: 8080,
    // Configurações CORS e mime-types para desenvolvimento
    headers: {
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://res.cloudinary.com https://*.supabase.co https://www.facebook.com https://cakto-quiz-br01.b-cdn.net https://*.b-cdn.net https://*.cloudinary.com data: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co ws://localhost:* wss://* http://localhost:*;",
    },
    fs: {
      allow: ["../"],
    },
    allowedHosts: ["a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com"],
  },

  plugins: [
    react(),
    componentTagger(),
    // Compressão GZIP
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
      deleteOriginFile: false,
    }),
    // Compressão Brotli
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
      deleteOriginFile: false,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Força deduplicação do React para evitar múltiplas instâncias
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    dedupe: ["react", "react-dom"],
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    sourcemap: false,
    target: "es2015",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
      },
    },
    // Configurações para evitar problemas de MIME type
    rollupOptions: {
      output: {
        // Garantir que React seja carregado primeiro
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks: (id) => {
          // Dependências React e Router - chunk separado para carregar primeiro
          if (id.includes("node_modules")) {
            // React DEVE estar em um chunk próprio para evitar problemas de ordem
            if (id.includes("/react/") || id.includes("/react-dom/")) {
              return "react-core";
            }

            if (id.includes("react-router")) {
              return "vendor-react";
            }

            // Componentes Radix UI
            if (id.includes("@radix-ui")) {
              return "vendor-ui";
            }

            // Utilitários gerais
            if (
              id.includes("lodash") ||
              id.includes("date-fns") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "vendor-utils";
            }

            // Supabase e autenticação
            if (id.includes("@supabase") || id.includes("gotrue-js")) {
              return "vendor-supabase";
            }

            // Zod e validação
            if (id.includes("zod")) {
              return "vendor-validation";
            }

            // Recharts
            if (id.includes("recharts") || id.includes("d3-")) {
              return "charts";
            }

            // Framer Motion
            if (id.includes("framer-motion")) {
              return "animations";
            }

            // IndexedDB
            if (id.includes("idb")) {
              return "vendor-db";
            }

            // Outros node_modules
            return "vendor";
          }

          // Código do app
          if (id.includes("/src/")) {
            // Páginas de admin
            if (id.includes("/pages/admin/")) {
              return "admin";
            }

            // Componentes do editor
            if (
              id.includes("/components/canvas/") ||
              id.includes("/components/editor/")
            ) {
              return "editor";
            }

            // Analytics
            if (
              id.includes("/utils/analytics") ||
              id.includes("/utils/facebookPixel")
            ) {
              return "analytics";
            }

            // Schemas e validação
            if (
              id.includes("/schemas/") ||
              id.includes("/utils/blockSchemas") ||
              id.includes("/utils/stageConfigSchema")
            ) {
              return "schemas";
            }

            // Serviços
            if (id.includes("/services/")) {
              return "services";
            }
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split("/").pop()
            : "chunk";
          return `assets/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split(".").at(1);
          if (/webp|png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || "")) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|otf|eot/i.test(extType || "")) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "clsx",
      "tailwind-merge",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "idb", // IndexedDB otimizado
    ],
    exclude: ["@huggingface/transformers"],
  },

  // Performance: preload de imagens críticas
  experimental: {
    renderBuiltUrl(filename: string) {
      // Preload de logos e imagens de estilo
      if (filename.includes("logo") || filename.includes("style-")) {
        return { runtime: `window.__IMAGE_BASE__ + '${filename}'` };
      }
      return { relative: true };
    },
  },

  css: {
    devSourcemap: mode === "development",
  },

  // Lovable integration configuration (sem token)
  define: {
    __LOVABLE_PROJECT_ID__: JSON.stringify("quiz-sell-genius-66"),
    __LOVABLE_ENABLED__: JSON.stringify(true),
    __LOVABLE_SYNC_METHOD__: JSON.stringify("webhook-alternative"),
  },
}));
