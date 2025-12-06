#!/bin/bash

# Script para criar favicons básicos
# Este script cria favicon.ico e versões PNG em tamanhos padrão

echo "Iniciando criação de favicons para a marca..."

# Criando diretório para os favicons (caso não exista)
mkdir -p public/favicon

# Cores da marca (baseadas nas variáveis CSS do projeto)
# --primary: 33 42% 63%; (tom dourado/marrom)
# Convertendo para hex aproximado: #B89B7A

# Criar PNG de 32x32 com a letra "G" em fundo dourado
convert -size 32x32 xc:#B89B7A -fill white -gravity center -font Arial -pointsize 20 -annotate 0 "G" public/favicon/favicon-32x32.png

# Criar PNG de 16x16
convert -size 16x16 xc:#B89B7A -fill white -gravity center -font Arial -pointsize 10 -annotate 0 "G" public/favicon/favicon-16x16.png

# Criar o favicon.ico (combinando os dois tamanhos)
convert public/favicon/favicon-16x16.png public/favicon/favicon-32x32.png public/favicon/favicon.ico

# Copiar o favicon.ico para a raiz public/ também
cp public/favicon/favicon.ico public/favicon.ico

# Criar manifest
echo '{
  "name": "Gisele Galvão",
  "short_name": "GGalvão",
  "icons": [
    {
      "src": "/favicon/favicon-16x16.png",
      "sizes": "16x16",
      "type": "image/png"
    },
    {
      "src": "/favicon/favicon-32x32.png",
      "sizes": "32x32",
      "type": "image/png"
    }
  ],
  "theme_color": "#B89B7A",
  "background_color": "#ffffff",
  "display": "standalone"
}' > public/favicon/site.webmanifest

echo "Favicons criados com sucesso!"
