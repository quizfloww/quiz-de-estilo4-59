#!/usr/bin/env bash
set -euo pipefail

# Diretório raiz do repositório (um nível acima de scripts/)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_DIR="$ROOT_DIR/docs"
SCRIPTS_DIR="$ROOT_DIR/scripts"

move_markdowns() {
  echo "Movendo arquivos .md da raiz para $DOCS_DIR"
  mkdir -p "$DOCS_DIR"
  for file in "$ROOT_DIR"/*.md; do
    [[ -e "$file" ]] || continue
    base="${file##*/}"
    [[ "$base" == "README.md" ]] && continue
    if [[ -e "$DOCS_DIR/$base" ]]; then
      echo "  Ignorando $base (já existe em docs/)"
      continue
    fi
    mv "$file" "$DOCS_DIR/"
    echo "  $base" moved
  done
}

move_shell_scripts() {
  echo "Movendo scripts .sh da raiz para $SCRIPTS_DIR"
  mkdir -p "$SCRIPTS_DIR"
  for file in "$ROOT_DIR"/*.sh; do
    [[ -e "$file" ]] || continue
    base="${file##*/}"
    if [[ -e "$SCRIPTS_DIR/$base" ]]; then
      echo "  Ignorando $base (já existe em scripts/)"
      continue
    fi
    mv "$file" "$SCRIPTS_DIR/"
    echo "  $base" moved
  done
}

remove_unneeded_files() {
  echo "Removendo arquivos de backup, testes e binários temporários"
  local cleanup=(
    ".lovable.backup"
    ".lovable.backup.1748993154"
    "google-chrome.deb"
    "bfg.jar"
    "eslint.config.js.bak"
    ".eslintrc.js.bak"
  )
  for entry in "${cleanup[@]}"; do
    if [[ -e "$ROOT_DIR/$entry" ]]; then
      rm -f "$ROOT_DIR/$entry"
      echo "  removido $entry"
    fi
  done

  find "$ROOT_DIR" -maxdepth 1 -type f \( -name '*.br' -o -name '*.gz' \) -print -delete
  find "$ROOT_DIR" -maxdepth 1 -type f -name 'test*.html' -print -delete
  find "$ROOT_DIR" -maxdepth 1 -type f -name 'teste*.html' -print -delete
  find "$ROOT_DIR" -maxdepth 1 -type f \( -name 'vite.config.js' -o -name 'vite.config.performance.ts' -o -name '.eslintrc.cjs' -o -name '.eslintrc.js' \) -print -delete
}

print_summary() {
  echo
  echo "Resumo do cleanup"
  echo "- arquivos .md restantes na raiz: "
  ls "$ROOT_DIR"/*.md 2>/dev/null || echo "  (apenas README.md permanece)"
  echo "- scripts .sh restantes na raiz:"
  ls "$ROOT_DIR"/*.sh 2>/dev/null || echo "  (nenhum)"
}

main() {
  move_markdowns
  move_shell_scripts
  remove_unneeded_files
  print_summary
  echo "Operação concluída. Revise as mudanças e rode git status."
}

main "$@"