/**
 * Script de diagnóstico para imagens no Editor de Funis
 *
 * COMO USAR:
 * 1. Abra o editor de funis no navegador: /admin/funnels/<id>/edit
 * 2. Abra o DevTools (F12) > Console
 * 3. Cole e execute este script
 *
 * O script irá:
 * - Listar todos os stages do funil
 * - Para cada stage de questão, verificar displayType e options
 * - Identificar quais opções não têm imagens
 */

(function diagnoseEditorImages() {
  console.log("🔍 DIAGNÓSTICO: Imagens no Editor de Funis");
  console.log("=".repeat(60));

  // Tentar encontrar os dados do funil no estado do React
  const findReactFiber = (element) => {
    const key = Object.keys(element).find(
      (k) =>
        k.startsWith("__reactFiber$") ||
        k.startsWith("__reactInternalInstance$")
    );
    return key ? element[key] : null;
  };

  // Buscar no React Query cache
  const queryCache = window.__REACT_QUERY_DEVTOOLS__?.queryCache;
  if (queryCache) {
    console.log("✅ React Query cache encontrado");
    const queries = queryCache.getAll();
    queries.forEach((q) => {
      if (q.queryKey?.includes("funnel") || q.queryKey?.includes("stages")) {
        console.log("Query:", q.queryKey, q.state?.data);
      }
    });
  }

  // Alternativa: interceptar chamadas de rede recentes
  if (window.performance) {
    const entries = window.performance.getEntriesByType("resource");
    const supabaseRequests = entries.filter(
      (e) => e.name.includes("supabase") || e.name.includes("stage")
    );
    console.log("\n📡 Requisições Supabase recentes:");
    supabaseRequests.slice(-10).forEach((r) => {
      console.log(`  ${r.name.substring(0, 80)}...`);
    });
  }

  // Verificar dados no DOM
  const canvasBlocks = document.querySelectorAll("[data-block-type]");
  console.log(`\n🎨 Blocos no Canvas: ${canvasBlocks.length}`);

  canvasBlocks.forEach((block, idx) => {
    const type = block.getAttribute("data-block-type");
    const images = block.querySelectorAll("img");
    console.log(`  ${idx + 1}. ${type} - ${images.length} imagens`);

    if (type === "options" && images.length === 0) {
      console.log("     ⚠️  Bloco de opções SEM imagens!");
    }
  });

  // Verificar botões de opções
  const optionButtons = document.querySelectorAll(
    "button[aria-pressed], button[aria-label]"
  );
  console.log(`\n🔘 Botões de opção encontrados: ${optionButtons.length}`);

  let withImages = 0;
  let withoutImages = 0;

  optionButtons.forEach((btn) => {
    const img = btn.querySelector("img");
    if (img) {
      withImages++;
      const src = img.getAttribute("src");
      if (!src || src === "" || src === "undefined") {
        console.log(`  ⚠️  Imagem com src inválido: ${src}`);
      }
    } else {
      withoutImages++;
    }
  });

  console.log(`  ✅ Com imagem: ${withImages}`);
  console.log(`  ❌ Sem imagem: ${withoutImages}`);

  // Verificar sidebar de stages
  const stageButtons = document.querySelectorAll(
    '[data-testid="stage-button"], .stage-item, [role="button"]'
  );
  console.log(`\n📋 Botões de stage na sidebar: ${stageButtons.length}`);

  console.log("\n" + "=".repeat(60));
  console.log("📝 PRÓXIMOS PASSOS DE DIAGNÓSTICO:");
  console.log("1. Execute no DevTools > Network: filtre por 'stage_options'");
  console.log("2. Verifique se a resposta contém 'image_url' preenchido");
  console.log("3. Verifique o config.displayType de cada stage");
  console.log("=".repeat(60));
})();
