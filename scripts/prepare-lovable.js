#!/usr/bin/env node

/**
 * Script para preparar componentes para sincronização com Lovable
 * Funciona sem necessidade de token LOVABLE_TOKEN
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 Preparando componentes para Lovable...");

// Função para encontrar componentes React
function findReactComponents(dir, components = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      findReactComponents(fullPath, components);
    } else if (file.match(/\.(tsx|jsx)$/)) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (
        content.includes("export default") ||
        content.includes("export const")
      ) {
        components.push({
          path: fullPath,
          name: path.basename(file, path.extname(file)),
          type: file.endsWith(".tsx") ? "typescript" : "javascript",
        });
      }
    }
  }

  return components;
}

// Encontrar componentes
const components = findReactComponents("./src");

// Criar manifesto de componentes
const manifest = {
  timestamp: new Date().toISOString(),
  components: components.length,
  files: components.map((c) => ({
    name: c.name,
    path: c.path.replace("./src/", ""),
    type: c.type,
  })),
};

// Salvar manifesto
fs.writeFileSync(
  "./lovable-components.json",
  JSON.stringify(manifest, null, 2)
);

console.log(`✅ Encontrados ${components.length} componentes`);
console.log("📄 Manifesto salvo em lovable-components.json");

// Verificar configuração do Lovable
const lovableConfig = "./.lovable";
if (fs.existsSync(lovableConfig)) {
  const config = JSON.parse(fs.readFileSync(lovableConfig, "utf8"));
  config.lastSync = new Date().toISOString();
  config.componentCount = components.length;
  fs.writeFileSync(lovableConfig, JSON.stringify(config, null, 2));
  console.log("🔄 Configuração do Lovable atualizada");
}

console.log("🎯 Preparação concluída!");
