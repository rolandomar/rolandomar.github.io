# Eleições FCUP 2026 — sites das listas

| Site | URL | Conteúdo |
|---|---|---|
| Conselho Científico | https://rolandomar.github.io/cientifico/ | `cientifico/data.js` |
| Conselho de Representantes | https://rolandomar.github.io/representantes/ | `representantes/data.js` |

## Domínio próprio
Os sites são também publicados em **https://cc.listab.pt** (Científico) e **https://cr.listab.pt** (Representantes),
a partir dos repositórios `rolandomar/listab-cc` e `rolandomar/listab-cr`. Esses repositórios são gerados: não editar lá.
Depois de alterar e fazer commit aqui, correr `./deploy.sh` para atualizar os dois subdomínios.

DNS em listab.pt: `cc` e `cr` como registos CNAME para `rolandomar.github.io`.

### Pré-visualização (testes de layout)
`./deploy.sh preview` publica os ficheiros tal como estão na pasta (qualquer ramo, mesmo sem commit) em
**https://preview.cc.listab.pt** e **https://preview.cr.listab.pt** (repositórios `listab-cc-preview` e `listab-cr-preview`).
Essas cópias levam `noindex` e uma etiqueta «Pré-visualização» no canto. `./deploy.sh` sem argumentos (produção) só corre no ramo `main`.
Fluxo sugerido: `git switch -c preview`, experimentar, `./deploy.sh preview`; quando estiver aprovado, juntar ao `main` e correr `./deploy.sh`.

DNS: `preview.cc` e `preview.cr` como registos CNAME para `rolandomar.github.io` (DNS only).

## Editar conteúdos
Cada site é gerado a partir do respetivo `data.js`; não é preciso mexer no HTML.
- Textos, prioridades, manifesto, candidatos, datas e contactos: `*/data.js`
- Fotos: `*/fotos/` → referir como `"fotos/nome.jpg"`
- Design partilhado: `assets/site.css` e `assets/site.js`
- Imagem de pré-visualização ao partilhar a ligação: `*/og.png` (1200×630)
- Depois de alterar `assets/` ou `data.js`, aumentar o número em `?v=` nos `index.html`, para os browsers irem buscar a versão nova

## Pré-visualizar localmente
```
python3 -m http.server 8000   # abrir http://localhost:8000/cientifico/
```

Publicado via GitHub Pages (branch `main`, raiz).

## Cartazes (A3)
`cartazes/cartaz-cc.pdf` e `cartazes/cartaz-cr.pdf` (A3, 300 dpi; há também `.png`) seguem o visual de cada site.
São gerados por `python3 cartazes/gerar.py`, que lê candidatos, fotos e cores dos `data.js`.
As frases curtas das prioridades e os nomes abreviados estão no início desse script.
