#!/usr/bin/env bash
# Publica os dois sites nos subdomínios próprios.
#   ./deploy.sh           produção (só a partir do ramo main, depois de fazer commit):
#       cientifico/      -> https://cc.listab.pt  (repositório rolandomar/listab-cc)
#       representantes/  -> https://cr.listab.pt  (repositório rolandomar/listab-cr)
#   ./deploy.sh preview   pré-visualização (qualquer ramo, publica os ficheiros tal como estão na pasta):
#       cientifico/      -> https://preview.cc.listab.pt  (repositório rolandomar/listab-cc-preview)
#       representantes/  -> https://preview.cr.listab.pt  (repositório rolandomar/listab-cr-preview)
# Cada repositório de publicação recebe uma cópia do site com assets/ na raiz e o ficheiro CNAME.
# As pré-visualizações levam "noindex" e uma etiqueta no canto, para não se confundirem com os sites reais.
set -euo pipefail
cd "$(dirname "$0")"
MODE=${1:-prod}
NAME=$(git config user.name); EMAIL=$(git config user.email); REV=$(git rev-parse --short HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
publish() {  # publish <pasta> <dominio> <repo> [preview]
  local src=$1 domain=$2 repo=$3 preview=${4:-} d
  d=$(mktemp -d)
  cp -r "$src"/. "$d"/ && cp -r assets "$d"/assets
  echo "$domain" > "$d/CNAME"; touch "$d/.nojekyll"
  sed -i "s|\.\./assets/|assets/|g; s|https://rolandomar.github.io/$src/|https://$domain/|g" "$d/index.html"
  if [ -n "$preview" ]; then
    printf 'User-agent: *\nDisallow: /\n' > "$d/robots.txt"
    sed -i 's|<meta name="viewport"[^>]*>|&\n  <meta name="robots" content="noindex,nofollow">|' "$d/index.html"
    sed -i "s|</body>|<div style=\"position:fixed;left:12px;bottom:12px;z-index:9999;pointer-events:none;background:#111;color:#fff;font:600 12px/1 system-ui,sans-serif;padding:7px 10px;border-radius:999px;opacity:.82\">Pré-visualização · $BRANCH · $REV</div>\n</body>|" "$d/index.html"
  fi
  ( cd "$d" && git init -q -b main && git add -A \
    && git -c user.name="$NAME" -c user.email="$EMAIL" commit -q -m "Publicação de $src ($BRANCH $REV)" \
    && git push -q -f "https://github.com/rolandomar/$repo.git" main )
  rm -rf "$d"; echo "publicado: $src -> https://$domain"
}
case "$MODE" in
  prod)
    if [ "$BRANCH" != main ]; then
      echo "Produção só a partir do ramo main (ramo atual: $BRANCH). Para testar: ./deploy.sh preview" >&2; exit 1
    fi
    publish cientifico cc.listab.pt listab-cc
    publish representantes cr.listab.pt listab-cr ;;
  preview)
    publish cientifico preview.cc.listab.pt listab-cc-preview preview
    publish representantes preview.cr.listab.pt listab-cr-preview preview ;;
  *) echo "Uso: ./deploy.sh [preview]" >&2; exit 2 ;;
esac
