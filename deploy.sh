#!/usr/bin/env bash
# Publica os dois sites nos subdomínios próprios:
#   cientifico/      -> https://cc.listab.pt  (repositório rolandomar/listab-cc)
#   representantes/  -> https://cr.listab.pt  (repositório rolandomar/listab-cr)
# Cada repositório de publicação recebe uma cópia do site com assets/ na raiz e o ficheiro CNAME.
# Uso: ./deploy.sh        (correr depois de fazer commit das alterações neste repositório)
set -euo pipefail
cd "$(dirname "$0")"
NAME=$(git config user.name); EMAIL=$(git config user.email); REV=$(git rev-parse --short HEAD)
publish() {  # publish <pasta> <dominio> <repo>
  local src=$1 domain=$2 repo=$3 d
  d=$(mktemp -d)
  cp -r "$src"/. "$d"/ && cp -r assets "$d"/assets
  echo "$domain" > "$d/CNAME"; touch "$d/.nojekyll"
  sed -i "s|\.\./assets/|assets/|g; s|https://rolandomar.github.io/$src/|https://$domain/|g" "$d/index.html"
  ( cd "$d" && git init -q -b main && git add -A \
    && git -c user.name="$NAME" -c user.email="$EMAIL" commit -q -m "Publicação de $src ($REV)" \
    && git push -q -f "https://github.com/rolandomar/$repo.git" main )
  rm -rf "$d"; echo "publicado: $src -> https://$domain"
}
publish cientifico cc.listab.pt listab-cc
publish representantes cr.listab.pt listab-cr
