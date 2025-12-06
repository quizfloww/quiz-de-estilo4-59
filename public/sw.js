const CACHE_NAME = "quiz-sell-genius-v3";
const STATIC_CACHE_NAME = "quiz-static-v3";
const DYNAMIC_CACHE_NAME = "quiz-dynamic-v3";
const IMAGE_CACHE_NAME = "quiz-images-v3";

// Recursos estáticos essenciais para cache inicial
const STATIC_ASSETS = ["/", "/index.html"];

// Estratégias de cache por tipo de recurso
const CACHE_STRATEGIES = {
  static: [/\.js$/, /\.css$/, /\.woff2?$/, /\.ttf$/],
  image: [/\.png$/, /\.jpg$/, /\.jpeg$/, /\.svg$/, /\.webp$/, /\.avif$/],
  api: [/api\//, /supabase/],
};

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Falha ao cachear alguns recursos estáticos:", err);
      });
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Limpar caches de versões anteriores
          if (
            cacheName.includes("quiz-") &&
            ![
              CACHE_NAME,
              STATIC_CACHE_NAME,
              DYNAMIC_CACHE_NAME,
              IMAGE_CACHE_NAME,
            ].includes(cacheName)
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Helper para criar resposta de fallback
function createFallbackResponse() {
  return new Response("", { status: 404, statusText: "Not Found" });
}

// Estratégias de fetch otimizadas
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Apenas processar requisições válidas
  try {
    const url = new URL(request.url);

    // Ignorar requisições não-GET
    if (request.method !== "GET") return;

    // Ignorar extensões do browser e URLs externas problemáticas
    if (url.protocol === "chrome-extension:") return;
    if (url.protocol === "moz-extension:") return;
    if (url.hostname === "cdn.lovable.dev") return;
    if (url.hostname.includes("fonts.gstatic.com")) return;
    if (url.hostname.includes("fonts.googleapis.com")) return;

    // Ignorar requisições para o manifest
    if (url.pathname.includes("webmanifest")) return;

    // Estratégia para imagens: Cache First
    if (CACHE_STRATEGIES.image.some((pattern) => pattern.test(url.pathname))) {
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then((response) => {
              if (!response || response.status !== 200) {
                return response || createFallbackResponse();
              }

              const responseToCache = response.clone();
              caches.open(IMAGE_CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });

              return response;
            })
            .catch(() => createFallbackResponse());
        })
      );
      return;
    }

    // Estratégia para assets estáticos: Cache First
    if (CACHE_STRATEGIES.static.some((pattern) => pattern.test(url.pathname))) {
      event.respondWith(
        caches.match(request).then((response) => {
          if (response) return response;

          return fetch(request)
            .then((fetchResponse) => {
              if (!fetchResponse || fetchResponse.status !== 200) {
                return fetchResponse || createFallbackResponse();
              }

              const responseToCache = fetchResponse.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });

              return fetchResponse;
            })
            .catch(() => createFallbackResponse());
        })
      );
      return;
    }

    // Estratégia para API: Network First com cache fallback
    if (CACHE_STRATEGIES.api.some((pattern) => pattern.test(url.pathname))) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return caches
                .match(request)
                .then((cached) => cached || createFallbackResponse());
            }

            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            return caches
              .match(request)
              .then((cached) => cached || createFallbackResponse());
          })
      );
      return;
    }

    // Estratégia padrão: Network First
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => {
          return caches
            .match(request)
            .then((cached) => cached || createFallbackResponse());
        })
    );
  } catch (error) {
    // Ignorar erros de parsing de URL
    console.warn("Service Worker fetch error:", error);
  }
});

// Sincronização em background (quando voltar online)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-analytics") {
    event.waitUntil(syncAnalytics());
  }
});

// Função para sincronizar analytics offline
async function syncAnalytics() {
  try {
    const cache = await caches.open("offline-analytics");
    const requests = await cache.keys();

    await Promise.all(
      requests.map(async (request) => {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.error("Falha ao sincronizar analytics:", error);
        }
      })
    );
  } catch (error) {
    console.error("Erro na sincronização:", error);
  }
}
