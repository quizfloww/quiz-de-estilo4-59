/**
 * Script de diagnóstico para problemas de imagens no quiz
 *
 * Para usar:
 * 1. Abra o quiz no navegador
 * 2. Abra o console do navegador (F12 > Console)
 * 3. Cole e execute este script
 */

(async function debugQuizImages() {
  console.log("🔍 Diagnóstico de Imagens do Quiz");
  console.log("=".repeat(50));

  // Verificar se há uma instância do Supabase disponível
  const supabaseModules = await import("/src/integrations/supabase/client.ts");
  const supabase = supabaseModules.supabase;

  if (!supabase) {
    console.error("❌ Supabase não está configurado");
    return;
  }

  // Buscar o funil 'quiz' pelo slug
  const { data: funnel, error: funnelError } = await supabase
    .from("funnels")
    .select("*")
    .eq("slug", "quiz")
    .maybeSingle();

  if (funnelError) {
    console.error("❌ Erro ao buscar funil:", funnelError);
    return;
  }

  if (!funnel) {
    console.error("❌ Funil 'quiz' não encontrado");
    return;
  }

  console.log("✅ Funil encontrado:", funnel.name, `(${funnel.id})`);

  // Buscar stages do funil
  const { data: stages, error: stagesError } = await supabase
    .from("funnel_stages")
    .select("*")
    .eq("funnel_id", funnel.id)
    .eq("is_enabled", true)
    .order("order_index", { ascending: true });

  if (stagesError) {
    console.error("❌ Erro ao buscar stages:", stagesError);
    return;
  }

  console.log(`\n📋 Total de stages: ${stages?.length || 0}`);

  // Filtrar apenas stages de questão (question, strategic)
  const questionStages =
    stages?.filter((s) => s.type === "question" || s.type === "strategic") ||
    [];
  console.log(`📋 Stages de questão: ${questionStages.length}`);

  // Para cada stage de questão, verificar as opções
  for (let i = 0; i < questionStages.length; i++) {
    const stage = questionStages[i];
    const config = stage.config || {};

    console.log("\n" + "=".repeat(50));
    console.log(
      `📌 Questão ${i + 1}: ${
        stage.title || config.questionText || "Sem título"
      }`
    );
    console.log(`   ID: ${stage.id}`);
    console.log(`   Tipo: ${stage.type}`);
    console.log(`   DisplayType: ${config.displayType || "não definido"}`);

    // Buscar options do banco
    const { data: dbOptions, error: optionsError } = await supabase
      .from("stage_options")
      .select("*")
      .eq("stage_id", stage.id)
      .order("order_index", { ascending: true });

    if (optionsError) {
      console.error(`   ❌ Erro ao buscar options: ${optionsError.message}`);
      continue;
    }

    console.log(`\n   📦 Options do Banco (stage_options):`);
    if (!dbOptions || dbOptions.length === 0) {
      console.log("   ⚠️  Nenhuma opção encontrada no banco!");
    } else {
      dbOptions.forEach((opt, j) => {
        const hasImage = !!opt.image_url;
        console.log(
          `      ${j + 1}. "${opt.text}" - image_url: ${
            hasImage
              ? "✅ " + opt.image_url.substring(0, 50) + "..."
              : "❌ null"
          }`
        );
      });
    }

    // Verificar options no config
    const configOptions = config.options || [];
    console.log(`\n   📦 Options no Config (stage.config.options):`);
    if (configOptions.length === 0) {
      console.log("   ⚠️  Nenhuma opção no config!");
    } else {
      configOptions.forEach((opt, j) => {
        const imageUrl = opt.imageUrl || opt.image_url;
        const hasImage = !!imageUrl;
        console.log(
          `      ${j + 1}. "${opt.text || "sem texto"}" - imageUrl: ${
            hasImage ? "✅ " + imageUrl.substring(0, 50) + "..." : "❌ null"
          }`
        );
      });
    }

    // Diagnóstico
    console.log(`\n   🔎 Diagnóstico:`);
    if (config.displayType === "text") {
      console.log(
        "   ⚠️  displayType='text' - Imagens não serão exibidas por design!"
      );
    } else if (
      (!dbOptions || dbOptions.length === 0) &&
      configOptions.length === 0
    ) {
      console.log("   ❌ Nenhuma opção definida (nem no banco, nem no config)");
    } else if (
      dbOptions?.every((o) => !o.image_url) &&
      configOptions.every((o) => !o.imageUrl && !o.image_url)
    ) {
      console.log(
        "   ❌ Nenhuma imagem definida nas opções (nem no banco, nem no config)"
      );
    } else if (dbOptions?.some((o) => !!o.image_url)) {
      console.log("   ✅ Algumas imagens encontradas no banco");
    } else if (configOptions.some((o) => o.imageUrl || o.image_url)) {
      console.log(
        "   ✅ Algumas imagens encontradas no config (serão usadas como fallback)"
      );
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🏁 Diagnóstico concluído!");
})();
