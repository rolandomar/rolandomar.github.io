# Eleições FCUP 2026 — sites das listas

| Site | URL | Conteúdo |
|---|---|---|
| Conselho Científico | https://rolandomar.github.io/cientifico/ | `cientifico/data.js` |
| Conselho de Representantes | https://rolandomar.github.io/representantes/ | `representantes/data.js` |

## Editar conteúdos
Cada site é gerado a partir do respetivo `data.js`; não é preciso mexer no HTML.
- Textos, prioridades, manifesto, candidatos, datas e contactos: `*/data.js`
- Fotos: `*/fotos/` → referir como `"fotos/nome.jpg"`
- Design partilhado: `assets/site.css` e `assets/site.js`

## Pré-visualizar localmente
```
python3 -m http.server 8000   # abrir http://localhost:8000/cientifico/
```

Publicado via GitHub Pages (branch `main`, raiz).
