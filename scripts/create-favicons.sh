#!/bin/bash

# Diretório de saída
OUTPUT_DIR="/workspaces/quiz-sell-genius-66/public/favicons"

# Criar arquivo SVG temporário com a letra "G" em um círculo dourado
cat > temp_favicon.svg << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#B89B7A"/>
  <text x="256" y="300" font-family="Arial" font-size="300" font-weight="bold" text-anchor="middle" fill="white">G</text>
</svg>
EOF

# Verificar se o imagemagick está instalado
if command -v convert >/dev/null 2>&1; then
  # Usar ImageMagick para converter SVG em PNG
  convert -background none temp_favicon.svg -resize 16x16 "$OUTPUT_DIR/favicon-16x16.png"
  convert -background none temp_favicon.svg -resize 32x32 "$OUTPUT_DIR/favicon-32x32.png"
  convert -background none temp_favicon.svg -resize 64x64 "$OUTPUT_DIR/favicon.ico"
else
  echo "ImageMagick não está instalado. Usando método alternativo."
  # Método alternativo - criar arquivos binários simples com cores sólidas
  echo -ne '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x10\x00\x00\x00\x10\x08\x02\x00\x00\x00\x90\x91\x68\x36\x00\x00\x00\x0c\x49\x44\x41\x54\x78\x9c\x63\x58\xb0\x60\x01\x03\x49\x00\x00\x02\xec\x01\x1e\x05\x44\xee\x96\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > "$OUTPUT_DIR/favicon-16x16.png"
  echo -ne '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x20\x00\x00\x00\x20\x08\x02\x00\x00\x00\xfc\x18\xed\xa3\x00\x00\x00\x0c\x49\x44\x41\x54\x78\x9c\x63\x88\x8e\x8e\x86\xa3\x01\x0d\x13\x03\xac\xa5\x00\xcb\x61\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > "$OUTPUT_DIR/favicon-32x32.png"
  cp "$OUTPUT_DIR/favicon-32x32.png" "$OUTPUT_DIR/favicon.ico"
fi

# Atualizar o site.webmanifest
cat > "$OUTPUT_DIR/site.webmanifest" << EOF
{
  "name": "Gisele Galvão",
  "short_name": "GGalvão",
  "icons": [
    {
      "src": "/favicons/favicon-16x16.png",
      "sizes": "16x16",
      "type": "image/png"
    },
    {
      "src": "/favicons/favicon-32x32.png",
      "sizes": "32x32",
      "type": "image/png"
    }
  ],
  "theme_color": "#B89B7A",
  "background_color": "#ffffff",
  "display": "standalone"
}
EOF

# Limpeza
rm -f temp_favicon.svg

echo "Favicons criados com sucesso!"
