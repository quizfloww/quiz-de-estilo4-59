import { test, expect } from "../fixtures/auth";

/**
 * TESTE FOCADO: Imagens das opções no Editor de Funis (/admin/funnels)
 *
 * PROBLEMA RELATADO:
 * - Imagens das opções das questões 4-9 não renderizam no editor de funis
 *
 * FLUXO DE DADOS:
 * 1. FunnelEditorPage carrega stages e blocks do Supabase
 * 2. Para cada stage tipo "question", busca options de stage_options
 * 3. OptionsBlock renderiza as opções usando QuizOption
 * 4. QuizOption mostra imagem se displayType !== 'text' && imageUrl existe
 *
 * HIPÓTESES:
 * 1. As options no banco não têm image_url populado para questões 4-9
 * 2. O displayType está como "text" para essas questões
 * 3. O config.options não tem imageUrl nas questões 4-9
 */

test.describe("Editor Funis - Diagnóstico Imagens Q4-9", () => {
  test.beforeEach(async ({ page }) => {
    // O fixture auth já navega para /admin/funnels/:id/edit
    await page.waitForLoadState("networkidle");
  });

  test("verificar se o editor carrega e exibe stages", async ({ page }) => {
    // Verificar se o editor carregou
    const header = page.locator('h1, [data-testid="funnel-name"]').first();
    await expect(header).toBeVisible({ timeout: 10000 });

    // Verificar se há stages na sidebar
    const stageButtons = page.locator(
      '[data-testid="stage-button"], button:has-text("Questão"), button:has-text("Intro")'
    );
    const count = await stageButtons.count();
    console.log(`📋 Stages encontrados na sidebar: ${count}`);

    expect(count).toBeGreaterThan(0);
  });

  test("navegar pelas questões 4-9 e verificar opções com imagens", async ({
    page,
  }) => {
    // Esperar carregar
    await page.waitForTimeout(2000);

    // Buscar todos os botões de stage que parecem ser questões
    const questionButtons = page.locator(
      'button:has-text("Questão"), button:has-text("Q"), [data-stage-type="question"]'
    );
    const questionCount = await questionButtons.count();
    console.log(`📋 Botões de questão encontrados: ${questionCount}`);

    // Para cada questão 4-9 (índices 3-8 se houver)
    for (let i = 3; i < Math.min(9, questionCount); i++) {
      const questionBtn = questionButtons.nth(i);

      if (await questionBtn.isVisible().catch(() => false)) {
        await questionBtn.click();
        await page.waitForTimeout(1000);

        // Capturar screenshot
        await page.screenshot({
          path: `test-results/editor-q${i + 1}.png`,
          fullPage: true,
        });

        // Verificar se há imagens no canvas
        const canvasImages = await page
          .locator('.canvas img, [data-block-type="options"] img')
          .count();
        const optionButtons = await page
          .locator('[data-block-type="options"] button, .options-block button')
          .count();

        console.log(
          `Q${i + 1}: ${canvasImages} imagens, ${optionButtons} opções`
        );

        if (canvasImages === 0) {
          console.log(`   ⚠️  Questão ${i + 1} sem imagens no canvas`);

          // Verificar displayType no painel de propriedades
          const displayTypeSelect = page.locator(
            'select:has-text("Texto"), [name="displayType"]'
          );
          if (await displayTypeSelect.isVisible().catch(() => false)) {
            const value = await displayTypeSelect.inputValue();
            console.log(`   displayType selecionado: ${value}`);
          }
        }
      }
    }
  });

  test("interceptar dados de stage_options do Supabase", async ({ page }) => {
    const optionsData: any[] = [];

    // Interceptar chamadas ao Supabase
    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes("stage_options") && response.status() === 200) {
        try {
          const data = await response.json();
          if (Array.isArray(data)) {
            optionsData.push(...data);
          }
        } catch {}
      }
    });

    // Navegar para o editor (já estamos nele via fixture)
    await page.waitForTimeout(3000);

    console.log(`\n📦 Total de options capturadas: ${optionsData.length}`);

    // Agrupar por stage_id
    const byStage: Record<string, any[]> = {};
    optionsData.forEach((opt) => {
      if (!byStage[opt.stage_id]) byStage[opt.stage_id] = [];
      byStage[opt.stage_id].push(opt);
    });

    console.log(`\n📋 Options por stage:`);
    Object.entries(byStage).forEach(([stageId, opts], idx) => {
      const withImages = opts.filter((o) => o.image_url).length;
      console.log(
        `   Stage ${idx + 1} (${stageId.substring(0, 8)}...): ${
          opts.length
        } options, ${withImages} com image_url`
      );

      if (withImages === 0 && opts.length > 0) {
        console.log(`      ⚠️  NENHUMA imagem neste stage!`);
      }
    });
  });

  test("verificar bloco de opções selecionado", async ({ page }) => {
    await page.waitForTimeout(2000);

    // Clicar em uma questão
    const questionBtn = page.locator('button:has-text("Questão")').first();
    if (await questionBtn.isVisible().catch(() => false)) {
      await questionBtn.click();
      await page.waitForTimeout(1000);
    }

    // Tentar clicar no bloco de opções
    const optionsBlock = page
      .locator('[data-block-type="options"], .options-block')
      .first();
    if (await optionsBlock.isVisible().catch(() => false)) {
      await optionsBlock.click();
      await page.waitForTimeout(500);

      // Verificar painel de propriedades
      const propsPanel = page.locator(
        '[data-testid="properties-panel"], .properties-panel, aside'
      );
      if (await propsPanel.isVisible().catch(() => false)) {
        // Capturar informações do painel
        const panelText = await propsPanel.textContent();
        console.log(`\n📝 Painel de propriedades:`);
        console.log(panelText?.substring(0, 500));

        // Verificar se displayType está visível
        const displayTypeLabel = page.locator(
          'label:has-text("Tipo de exibição"), label:has-text("Display")'
        );
        if (await displayTypeLabel.isVisible().catch(() => false)) {
          console.log(`\n✅ Campo displayType encontrado no painel`);
        } else {
          console.log(`\n⚠️  Campo displayType NÃO encontrado no painel`);
        }
      }
    }
  });

  test("verificar config.options de cada stage", async ({ page }) => {
    const stagesData: any[] = [];

    // Interceptar stages
    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes("funnel_stages") && response.status() === 200) {
        try {
          const data = await response.json();
          if (Array.isArray(data)) {
            stagesData.push(...data);
          }
        } catch {}
      }
    });

    await page.waitForTimeout(3000);

    console.log(`\n📋 Stages capturados: ${stagesData.length}`);

    // Filtrar apenas questões
    const questionStages = stagesData
      .filter((s) => s.type === "question" || s.type === "strategic")
      .sort((a, b) => a.order_index - b.order_index);

    console.log(`\n📋 Questões (${questionStages.length}):\n`);

    questionStages.forEach((stage, idx) => {
      const config = stage.config || {};
      const displayType = config.displayType || "não definido";
      const configOptions = config.options || [];
      const optionsWithImages = configOptions.filter(
        (o: any) => o.imageUrl || o.image_url
      ).length;

      const isProblematic = idx >= 3 && idx <= 8; // Q4-Q9
      const icon = isProblematic
        ? optionsWithImages === 0 && displayType !== "text"
          ? "❌"
          : "🔍"
        : "✅";

      console.log(`${icon} Q${idx + 1}: displayType="${displayType}"`);
      console.log(
        `   config.options: ${configOptions.length} (${optionsWithImages} com imagem)`
      );

      if (optionsWithImages === 0 && displayType !== "text" && isProblematic) {
        console.log(
          `   ⚠️  PROBLEMA: displayType espera imagens mas config.options não tem!`
        );
      }

      console.log("");
    });
  });
});

test.describe("Análise do Código", () => {
  test("documentar fluxo de dados das imagens no editor", async ({ page }) => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  FLUXO DE DADOS: Imagens das Opções no Editor de Funis          ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  1. FunnelEditorPage.tsx                                        ║
║     └─ Carrega funnel via useQuery                              ║
║     └─ Para cada stage, carrega config e options                ║
║                                                                  ║
║  2. stage_options (tabela Supabase)                             ║
║     └─ Campos: id, stage_id, text, image_url, style_category    ║
║     └─ image_url deve conter URL da imagem                      ║
║                                                                  ║
║  3. funnel_stages.config (JSON)                                 ║
║     └─ displayType: 'text' | 'image' | 'both'                   ║
║     └─ options: [{ id, text, imageUrl, ... }]                   ║
║                                                                  ║
║  4. OptionsBlock.tsx                                            ║
║     └─ Recebe content.options e content.displayType             ║
║     └─ Converte para QuizOptionItem                             ║
║     └─ imageUrl = opt.imageUrl || opt.image_url                 ║
║                                                                  ║
║  5. QuizOption.tsx                                              ║
║     └─ showImage = displayType !== 'text' && imageUrl           ║
║     └─ Se showImage = true, renderiza <img src={imageUrl}>      ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  POSSÍVEIS CAUSAS DO PROBLEMA:                                  ║
║                                                                  ║
║  A) image_url está NULL no banco para questões 4-9              ║
║     → Solução: Popular image_url no banco via editor            ║
║                                                                  ║
║  B) displayType está como 'text' nas questões 4-9               ║
║     → Solução: Alterar displayType para 'image' ou 'both'       ║
║                                                                  ║
║  C) config.options não tem imageUrl (fallback não funciona)     ║
║     → Solução: Verificar sincronização entre config e banco     ║
║                                                                  ║
║  D) Erro de carregamento da imagem (URL inválida ou 404)        ║
║     → Solução: Verificar se URLs são válidas e acessíveis       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);

    expect(true).toBe(true);
  });
});
