import { test, expect } from "@playwright/test";

/**
 * TESTE FOCADO: Imagens das opções nas questões 4-9 do quiz dinâmico
 *
 * PROBLEMA RELATADO:
 * - As questões 4-9 do funil 'quiz' não renderizam imagens nas opções
 * - Questões 1-3 funcionam normalmente
 *
 * HIPÓTESES A TESTAR:
 * 1. image_url está null no banco (tabela stage_options) para questões 4-9
 * 2. displayType está configurado como "text" para questões 4-9
 * 3. config.options não tem imageUrl para essas questões
 * 4. Erro no merge enrichedOptions no DynamicQuestion
 *
 * Execute com:
 *   npx playwright test tests/e2e/quiz-options-images-q4-9.spec.ts --headed
 */

// Dados capturados para análise
interface StageData {
  stageId: string;
  title: string;
  type: string;
  orderIndex: number;
  displayType: string | null;
  configOptionsCount: number;
  configOptionsWithImages: number;
  dbOptionsCount: number;
  dbOptionsWithImages: number;
}

test.describe("Diagnóstico: Imagens Q4-9 Quiz Dinâmico", () => {
  test("interceptar dados do Supabase e analisar image_url", async ({
    page,
  }) => {
    const capturedData: {
      stages: any[];
      options: any[];
    } = { stages: [], options: [] };

    // Interceptar TODAS as respostas do Supabase
    page.on("response", async (response) => {
      const url = response.url();

      // Capturar funnel_stages
      if (url.includes("funnel_stages") && response.status() === 200) {
        try {
          const data = await response.json();
          if (Array.isArray(data)) {
            capturedData.stages = data;
            console.log(`\n📋 Capturado ${data.length} stages do funil`);
          }
        } catch {}
      }

      // Capturar stage_options
      if (url.includes("stage_options") && response.status() === 200) {
        try {
          const data = await response.json();
          if (Array.isArray(data)) {
            capturedData.options = data;
            console.log(`📋 Capturado ${data.length} options do banco`);
          }
        } catch {}
      }
    });

    // Navegar para um quiz dinâmico (precisa do slug correto)
    // Primeiro tentamos descobrir o slug
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Navegar para o quiz público - ajustar slug conforme necessário
    // O slug 'quiz' é o padrão, mas pode ser diferente
    await page.goto("/quiz/quiz");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Análise dos dados capturados
    console.log("\n" + "=".repeat(60));
    console.log("📊 ANÁLISE DOS DADOS CAPTURADOS");
    console.log("=".repeat(60));

    if (capturedData.stages.length === 0) {
      console.log("⚠️  Nenhum stage capturado - verificar se o funil existe");
      console.log("   Tentando rota alternativa: /quiz");

      await page.goto("/quiz");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(3000);
    }

    // Ordenar stages por order_index
    const sortedStages = capturedData.stages
      .filter((s) => s.type === "question" || s.type === "strategic")
      .sort((a, b) => a.order_index - b.order_index);

    console.log(`\n📋 ${sortedStages.length} stages de questão encontrados:\n`);

    // Análise detalhada de cada questão
    sortedStages.forEach((stage, idx) => {
      const questionNumber = idx + 1;
      const config = stage.config || {};
      const displayType = config.displayType || "não definido";
      const configOptions = config.options || [];

      // Opções do banco para este stage
      const dbOptions = capturedData.options.filter(
        (o) => o.stage_id === stage.id
      );

      // Contar imagens
      const configWithImages = configOptions.filter(
        (o: any) => o.imageUrl || o.image_url
      ).length;
      const dbWithImages = dbOptions.filter((o) => o.image_url).length;

      // Determinar status
      const isProblematic = questionNumber >= 4 && questionNumber <= 9;
      const hasImageIssue = dbWithImages === 0 && displayType !== "text";

      const statusIcon = isProblematic ? (hasImageIssue ? "❌" : "🔍") : "✅";

      console.log(
        `${statusIcon} Questão ${questionNumber}: "${
          stage.title?.substring(0, 40) || config.questionText?.substring(0, 40)
        }..."`
      );
      console.log(`   Stage ID: ${stage.id}`);
      console.log(`   Tipo: ${stage.type}`);
      console.log(`   DisplayType: ${displayType}`);
      console.log(
        `   Config options: ${configOptions.length} (${configWithImages} com imagem)`
      );
      console.log(
        `   DB options: ${dbOptions.length} (${dbWithImages} com image_url)`
      );

      if (hasImageIssue && isProblematic) {
        console.log(
          `   ⚠️  PROBLEMA DETECTADO: displayType=${displayType} mas sem imagens no banco!`
        );
      }

      if (displayType === "text") {
        console.log(
          `   ℹ️  displayType='text' - imagens não serão exibidas (comportamento esperado)`
        );
      }

      console.log("");
    });

    // Resumo do diagnóstico
    console.log("=".repeat(60));
    console.log("🔎 DIAGNÓSTICO RESUMIDO");
    console.log("=".repeat(60));

    const problematicStages = sortedStages.slice(3, 9); // Q4-Q9
    const issuesFound: string[] = [];

    problematicStages.forEach((stage, idx) => {
      const questionNumber = idx + 4;
      const config = stage.config || {};
      const displayType = config.displayType;
      const dbOptions = capturedData.options.filter(
        (o) => o.stage_id === stage.id
      );
      const dbWithImages = dbOptions.filter((o) => o.image_url).length;

      if (displayType === "text") {
        issuesFound.push(
          `Q${questionNumber}: displayType='text' (não exibe imagens por design)`
        );
      } else if (dbWithImages === 0) {
        issuesFound.push(
          `Q${questionNumber}: image_url NULL em todas as ${dbOptions.length} opções do banco`
        );
      }
    });

    if (issuesFound.length === 0) {
      console.log("✅ Nenhum problema óbvio encontrado nos dados");
      console.log("   Pode ser um problema de renderização no frontend");
    } else {
      console.log("❌ Problemas encontrados:");
      issuesFound.forEach((issue) => console.log(`   - ${issue}`));
    }

    // Sugestões de correção
    console.log("\n📝 PRÓXIMOS PASSOS:");
    if (issuesFound.some((i) => i.includes("image_url NULL"))) {
      console.log(
        "   1. Verificar no editor se as imagens foram adicionadas às opções"
      );
      console.log(
        "   2. Verificar se syncBlocksToDatabase está salvando image_url corretamente"
      );
      console.log(
        "   3. Verificar se há imagens no config.options que deveriam ser migradas"
      );
    }
    if (issuesFound.some((i) => i.includes("displayType='text'"))) {
      console.log("   1. Alterar displayType para 'image' ou 'both' no editor");
    }

    expect(true).toBe(true); // Teste sempre passa, é diagnóstico
  });

  test("navegar pelo quiz e verificar renderização visual", async ({
    page,
  }) => {
    // Limpar localStorage para começar do zero
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Ir para o quiz
    await page.goto("/quiz");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Preencher nome na intro se necessário
    const nameInput = page.locator(
      'input[type="text"], input[placeholder*="nome"]'
    );
    if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nameInput.fill("Teste Diagnóstico");

      // Clicar em começar
      const startButton = page.locator(
        'button:has-text("Começar"), button:has-text("Iniciar"), button:has-text("Descubra")'
      );
      if (await startButton.isVisible().catch(() => false)) {
        await startButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // Navegar pelas questões e capturar screenshots
    for (let q = 1; q <= 10; q++) {
      await page.waitForTimeout(1000);

      // Capturar screenshot da questão
      await page.screenshot({
        path: `test-results/questao-${q}.png`,
        fullPage: true,
      });

      // Verificar se há imagens visíveis
      const visibleImages = await page.locator("button img").count();
      const questionTitle = await page
        .locator("h1")
        .first()
        .textContent()
        .catch(() => "");

      console.log(
        `Q${q}: "${questionTitle?.substring(
          0,
          30
        )}..." - ${visibleImages} imagens visíveis`
      );

      if (q >= 4 && q <= 9 && visibleImages === 0) {
        console.log(`   ⚠️  Questão ${q} SEM imagens renderizadas`);
      }

      // Clicar na primeira opção
      const options = page.locator("button[aria-pressed], button[aria-label]");
      if ((await options.count()) > 0) {
        await options.first().click();
        await page.waitForTimeout(300);

        // Clicar em continuar se necessário
        const continueBtn = page.locator(
          'button:has-text("Continuar"), button:has-text("Próximo")'
        );
        if (await continueBtn.isVisible({ timeout: 500 }).catch(() => false)) {
          await continueBtn.click();
        }
      } else {
        // Tentar outros botões
        const anyButton = page.locator("button:visible").first();
        if (await anyButton.isVisible().catch(() => false)) {
          await anyButton.click();
        }
      }

      await page.waitForTimeout(500);
    }

    console.log("\n📸 Screenshots salvos em test-results/questao-N.png");
  });
});

test.describe("Verificação direta do banco de dados", () => {
  test("consultar Supabase REST API diretamente", async ({ request, page }) => {
    // Buscar configuração do Supabase do ambiente
    await page.goto("/");

    const supabaseConfig = await page.evaluate(() => {
      // Tentar capturar do bundle ou window
      return {
        url:
          (window as any).VITE_SUPABASE_URL ||
          import.meta?.env?.VITE_SUPABASE_URL ||
          "não encontrado",
      };
    });

    console.log("Config Supabase:", supabaseConfig);

    // Este teste é informativo - mostra que precisamos das credenciais para consultar diretamente
    console.log("\n💡 Para consultar diretamente o banco:");
    console.log("   1. Acesse o Supabase Dashboard");
    console.log(
      "   2. Execute: SELECT * FROM stage_options WHERE stage_id IN (SELECT id FROM funnel_stages WHERE type IN ('question', 'strategic') ORDER BY order_index LIMIT 9 OFFSET 3);"
    );
    console.log("   3. Verifique se image_url está preenchido");

    expect(true).toBe(true);
  });
});
