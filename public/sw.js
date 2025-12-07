const CACHE_NAME = "quiz-sell-genius-v5-fix-validations";

// Instalação simples
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Ativação e limpeza
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith("quiz-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first, simples e robusto
self.addEventListener("fetch", (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== "GET") return;

  // Ignorar URLs problemáticas
  try {
    const url = new URL(event.request.url);

    // Ignorar extensões do browser
    if (
      url.protocol === "chrome-extension:" ||
      url.protocol === "moz-extension:"
    )
      return;

    // Ignorar URLs externas conhecidas por causar problemas
    if (url.hostname === "cdn.lovable.dev") return;
    if (url.hostname.includes("fonts.gstatic.com")) return;
    if (url.hostname.includes("fonts.googleapis.com")) return;

    // Ignorar webmanifest
    if (url.pathname.includes("webmanifest")) return;
  } catch (e) {
    return;
  }

  // Estratégia simples: tentar rede, fallback para cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clonar e cachear respostas válidas
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => {
        // Tentar cache como fallback
        return caches.match(event.request).then((cached) => {
          if (cached) {
            return cached;
          }
          // Retornar resposta vazia em vez de undefined
          return new Response("", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      })
  );
});
