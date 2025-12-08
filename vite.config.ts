import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from "vite-plugin-compression";
import { componentTagger } from "./src/plugins/lovable-component-tagger.js";

// Configuração principal do Vite
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
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://res.cloudinary.com https://*.supabase.co https://www.facebook.com https://*.cloudinary.com data: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co ws://localhost:* wss://* http://localhost:*;",
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
    // Usar chunking padrão para evitar problemas de ordem de carregamento do React
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
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
