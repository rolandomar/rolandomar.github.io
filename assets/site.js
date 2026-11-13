// Motor partilhado: lê window.SITE (definido no data.js de cada site) e desenha a página.
// Não é preciso editar este ficheiro para mudar conteúdos.
(function () {
  const S = window.SITE;
  if (!S) return;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const paras = (txt) => [].concat(txt || []).map((p) => `<p>${esc(p)}</p>`).join("");
  const initials = (n) => { const w = String(n || "?").trim().split(/\s+/); return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase(); };

  if (S.cor) document.documentElement.style.setProperty("--accent", S.cor);
  document.title = `Lista ${S.lista} — ${S.nomeLista} — ${S.orgao}`;
  const md = document.querySelector('meta[name="description"]');
  if (md) md.content = S.hero?.lead || "";

  // Topo
  $("#brand").innerHTML = `<span class="badge">${esc(S.lista)}</span>
    <span class="brand-txt"><b>${esc(S.nomeLista)}</b><span>${esc(S.orgao)} · ${esc(S.instituicao)}</span></span>`;
  $("#menu").addEventListener("click", (e) => {
    const n = $("#nav"); n.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", n.classList.contains("open"));
  });
  $("#nav").addEventListener("click", (e) => { if (e.target.tagName === "A") $("#nav").classList.remove("open"); });

  // Hero
  const h = S.hero || {};
  $("#hero-txt").innerHTML = `
    <p class="eyebrow">Lista ${esc(S.lista)} · ${esc(S.orgao)} · ${esc(S.instituicao)} · ${esc(S.ano)}</p>
    <h1>${esc(h.titulo)} <em>${esc(h.destaque)}</em></h1>
    <p class="lead">${esc(h.lead)}</p>
    <div class="actions">
      <a class="btn primary" href="#candidatos">Conhecer os candidatos</a>
      <a class="btn ghost" href="#manifesto">Ler o manifesto →</a>
    </div>`;
  const e = S.eleicao || {};
  $("#vote-card").innerHTML = `
    <div class="lbl">Vote</div><div class="big">${esc(S.lista)}</div>
    <div class="lbl">${esc(S.nomeLista)}</div>
    <div class="date">${esc(e.dataTexto || "")}</div>
    <div class="countdown" id="countdown" aria-live="polite"></div>`;
  if (e.data) {
    const target = new Date(e.data).getTime();
    const tick = () => {
      const d = target - Date.now();
      const el = $("#countdown");
      if (d <= 0) { el.innerHTML = `<small>Dia de eleição</small>`; return; }
      const days = Math.floor(d / 864e5), hrs = Math.floor(d / 36e5) % 24, min = Math.floor(d / 6e4) % 60;
      el.innerHTML = [[days, "dias"], [hrs, "horas"], [min, "min"]].map(([v, l]) => `<div><b>${v}</b><small>${l}</small></div>`).join("");
    };
    tick(); setInterval(tick, 30000);
  }

  // Prioridades
  $("#prio-head").innerHTML = `<p class="eyebrow">As nossas prioridades</p><h2>${esc(S.prioridades?.titulo)}</h2><p>${esc(S.prioridades?.intro)}</p>`;
  $("#prio-grid").innerHTML = (S.prioridades?.itens || []).map((p, i) => `
    <article class="prio"><div class="n">${String(i + 1).padStart(2, "0")}</div><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></article>`).join("");

  // Manifesto
  const m = S.manifesto || {};
  $("#manifesto").innerHTML = `
    <div><p class="eyebrow">Manifesto · Lista ${esc(S.lista)}</p><blockquote>${esc(m.citacao)}</blockquote></div>
    <div class="body">${paras(m.paragrafos)}
      ${(m.compromissos || []).length ? `<h3>Comprometemo-nos a</h3><ul>${m.compromissos.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}
      ${m.pdf ? `<p><a class="btn ghost" href="${esc(m.pdf)}" target="_blank" rel="noopener">Descarregar manifesto (PDF)</a></p>` : ""}
    </div>`;

  // Candidatos
  const grupos = S.candidatos?.grupos || [];
  const all = [];
  grupos.forEach((g) => (g.membros || []).forEach((c, i) => all.push({ ...c, grupo: g.titulo, ordem: i + 1 })));
  const units = [...new Set(all.map((c) => c.unidade).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt"));
  $("#cand-head").innerHTML = `<p class="eyebrow">A lista</p><h2>${esc(S.candidatos?.titulo)}</h2><p>${esc(S.candidatos?.intro)}</p>`;
  let filtro = "", unidade = "";
  $("#chips").innerHTML = units.length > 1
    ? [`<button class="chip" aria-pressed="true" data-u="">Todos</button>`].concat(units.map((u) => `<button class="chip" aria-pressed="false" data-u="${esc(u)}">${esc(u)}</button>`)).join("")
    : "";
  $("#chips").addEventListener("click", (ev) => {
    const b = ev.target.closest(".chip"); if (!b) return;
    unidade = b.dataset.u;
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    renderCands();
  });
  $("#search").addEventListener("input", (ev) => { filtro = ev.target.value.trim().toLowerCase(); renderCands(); });

  const photo = (c) => c.foto
    ? `<img src="${esc(c.foto)}" alt="Fotografia de ${esc(c.nome)}" loading="lazy">`
    : `<span class="ini" aria-hidden="true">${esc(initials(c.nome))}</span>`;
  function renderCands() {
    const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const f = norm(filtro);
    let html = "";
    grupos.forEach((g, gi) => {
      const list = all.filter((c) => c.grupo === g.titulo)
        .filter((c) => !unidade || c.unidade === unidade)
        .filter((c) => !f || norm([c.nome, c.categoria, c.unidade, c.departamento].join(" ")).includes(f));
      if (!list.length) return;
      html += `<h3 class="group-title">${esc(g.titulo)} <small>(${list.length})</small></h3><div class="cands">` +
        list.map((c) => `<button class="cand" data-i="${all.indexOf(c)}">
          <div class="ph">${photo(c)}<span class="ord">${c.ordem}</span></div>
          <div class="meta"><b>${esc(c.nome)}</b><span>${esc([c.categoria, c.departamento || c.unidade].filter(Boolean).join(" · "))}</span></div>
        </button>`).join("") + `</div>`;
    });
    $("#cands").innerHTML = html || `<p class="empty">Nenhum candidato corresponde à pesquisa.</p>`;
  }
  renderCands();
  const dlg = $("#dlg");
  $("#cands").addEventListener("click", (ev) => {
    const b = ev.target.closest(".cand"); if (!b) return;
    const c = all[+b.dataset.i];
    dlg.innerHTML = `<div class="dlg-wrap"><div class="dlg">
      <div class="cand"><div class="ph" style="height:100%">${photo(c)}</div></div>
      <div class="txt"><h3>${esc(c.nome)}</h3>
        <div class="sub">${esc([c.categoria, c.departamento, c.unidade].filter(Boolean).join(" · "))}<br>${esc(c.grupo)} · n.º ${c.ordem}</div>
        ${paras(c.bio || "Biografia a acrescentar.")}
        ${c.link ? `<p><a href="${esc(c.link)}" target="_blank" rel="noopener">Página pessoal →</a></p>` : ""}
      </div></div><button class="close" aria-label="Fechar">×</button></div>`;
    dlg.showModal();
  });
  dlg.addEventListener("click", (ev) => { if (ev.target === dlg || ev.target.closest(".close")) dlg.close(); });

  // Eleição
  $("#elei-head").innerHTML = `<p class="eyebrow">A eleição</p><h2>${esc(e.titulo || "Como votar")}</h2><p>${esc(e.intro || "")}</p>`;
  $("#info-grid").innerHTML = (e.factos || []).map((x) => `<div class="info"><div class="k">${esc(x.k)}</div><div class="v">${esc(x.v)}</div>${x.p ? `<p>${esc(x.p)}</p>` : ""}</div>`).join("");
  $("#docs").innerHTML = (e.documentos || []).map((d) => `<a class="btn ghost" href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.titulo)} ↗</a>`).join("");

  // Contacto + rodapé
  const c = S.contacto || {};
  $("#contact").innerHTML = `<div><h2>${esc(c.titulo || "Fale connosco")}</h2><p>${esc(c.texto || "")}</p></div>
    <div class="actions">${c.email ? `<a class="btn primary" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ""}
    ${c.form ? `<a class="btn ghost" href="${esc(c.form)}" target="_blank" rel="noopener">Enviar contributo ↗</a>` : ""}</div>`;
  $("#foot").innerHTML = `<span>Lista ${esc(S.lista)} · ${esc(S.nomeLista)} · ${esc(S.orgao)} · ${esc(S.instituicao)} ${esc(S.ano)}</span>
    <span><a href="../">Outras listas</a></span>`;
})();
