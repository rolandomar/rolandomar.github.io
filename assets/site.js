// Motor partilhado: lê window.SITE (definido no data.js de cada site) e desenha a página.
// Não é preciso editar este ficheiro para mudar conteúdos.
(function () {
  const S = window.SITE;
  if (!S) return;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const paras = (txt) => [].concat(txt || []).map((p) => `<p>${esc(p)}</p>`).join("");
  const initials = (n) => { const w = String(n || "?").trim().split(/\s+/); return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase(); };
  const svg = (inner) => `<svg viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
  const ICONS = {
    data: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    local: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    quem: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.1.7 3.5 2.6 3.5 5.7"/>',
    como: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8l8 8M16 8l-8 8"/>',
    resultados: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  };
  const iconFor = (k) => { const key = String(k || "").toLowerCase().split(/\s+/)[0]; return svg(ICONS[key] || ICONS.info); };

  if (S.cor) document.documentElement.style.setProperty("--accent", S.cor);
  document.title = `Lista ${S.lista} · ${S.orgao} · ${S.instituicao} ${S.ano}`;

  // ---------- Topo ----------
  // Logótipo: a caixa do boletim com a cruz + «Lista B» + órgão
  const MARK = '<svg class="mark" viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="4" width="40" height="40" rx="10"/><path d="M16 16l16 16M32 16L16 32"/></svg>';
  const logo = (sub) => `${MARK}<span class="logo-txt"><b>Lista <i>${esc(S.lista)}</i></b><span>${sub}</span></span>`;
  const logoSub = `${esc(S.orgao)}<em> · ${esc(S.instituicao)} ${esc(S.ano)}</em>`;
  $("#brand").innerHTML = logo(logoSub);
  const nav = $("#nav");
  $("#menu").addEventListener("click", (ev) => {
    nav.classList.toggle("open");
    ev.currentTarget.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
  nav.addEventListener("click", (ev) => { if (ev.target.tagName === "A") { nav.classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); } });

  // ---------- Hero ----------
  const h = S.hero || {};
  const e = S.eleicao || {};
  $("#hero-txt").innerHTML = `
    <p class="pill"><i></i>Lista ${esc(S.lista)} · ${esc(S.orgao)} · ${esc(S.instituicao)} ${esc(S.ano)}</p>
    <h1>${esc(h.titulo)} <em>${esc(h.destaque)}</em></h1>
    <p class="lead">${esc(h.lead)}</p>
    <div class="actions">
      <a class="btn light" href="#candidatos">Conhecer os candidatos</a>
      <a class="btn outline" href="#manifesto-sec">Ler o manifesto →</a>
    </div>`;

  const start = e.data ? new Date(e.data) : null;
  const end = e.fim ? new Date(e.fim) : null;
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  let ics = "";
  if (start && end && !isNaN(start) && !isNaN(end)) {
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Lista " + S.lista + "//FCUP//PT", "BEGIN:VEVENT",
      "UID:eleicao-" + stamp(start) + "@fcup-lista-" + String(S.lista).toLowerCase(),
      "DTSTAMP:" + stamp(new Date()), "DTSTART:" + stamp(start), "DTEND:" + stamp(end),
      "SUMMARY:Eleições FCUP, " + S.orgao + " (votar Lista " + S.lista + ")",
      "LOCATION:" + String(e.local || "").replace(/,/g, "\\,"),
      "URL:" + location.href.split("#")[0], "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    ics = "data:text/calendar;charset=utf-8," + encodeURIComponent(body);
  }
  $("#vote-card").innerHTML = `
    <div class="lbl">No boletim de voto</div>
    <div class="ballot">
      ${MARK}
      <span class="who"><b>Lista <i>${esc(S.lista)}</i></b><span>${esc(S.orgao)}</span></span>
    </div>
    <div class="date">${esc(e.dataTexto || "")}</div>
    <div class="countdown" id="countdown" aria-live="polite"></div>
    ${ics ? `<a class="ics" href="${ics}" download="eleicoes-fcup-lista-${esc(String(S.lista).toLowerCase())}.ics">+ Adicionar ao calendário</a>` : ""}`;
  if (start && !isNaN(start)) {
    const tick = () => {
      const now = Date.now(), d = start.getTime() - now, el = $("#countdown");
      if (end && now > end.getTime()) { el.innerHTML = `<div class="done">Eleição concluída. Obrigado!</div>`; return; }
      if (d <= 0) { el.innerHTML = `<div class="done">Hoje é dia de votar!</div>`; return; }
      const days = Math.floor(d / 864e5), hrs = Math.floor(d / 36e5) % 24, min = Math.floor(d / 6e4) % 60;
      el.innerHTML = [[days, days === 1 ? "dia" : "dias"], [hrs, "horas"], [min, "min"]].map(([v, l]) => `<div><b>${v}</b><small>${l}</small></div>`).join("");
    };
    tick(); setInterval(tick, 30000);
  }

  // ---------- Candidatos (dados) ----------
  const grupos = S.candidatos?.grupos || [];
  const all = [];
  grupos.forEach((g) => (g.membros || []).forEach((c, i) => all.push({ ...c, grupo: g.titulo, ordem: i + 1 })));
  const units = [...new Set(all.map((c) => c.unidade).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt"));

  // ---------- Faixa de números ----------
  const MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const stats = [];
  if (all.length) stats.push([all.length, "candidatos na lista"]);
  if (units.length > 1) stats.push([units.length, "departamentos representados"]);
  if (start && !isNaN(start)) stats.push([`${start.getDate()} ${MES[start.getMonth()]}`, "dia da eleição"]);
  if (e.horario) stats.push([e.horario, e.localCurto || "horário das urnas"]);
  $("#stats").innerHTML = stats.length ? `<div class="stats-in">${stats.map(([b, l]) => `<div class="stat"><b>${esc(b)}</b><span>${esc(l)}</span></div>`).join("")}</div>` : "";

  // ---------- Prioridades ----------
  // "etiqueta" (por omissão «As nossas prioridades») e "intro" são opcionais: vazios, não aparecem.
  const pEtq = S.prioridades?.etiqueta ?? "As nossas prioridades", pIntro = S.prioridades?.intro;
  $("#prio-head").innerHTML = `${pEtq ? `<p class="eyebrow">${esc(pEtq)}</p>` : ""}<h2>${esc(S.prioridades?.titulo)}</h2>${pIntro ? `<p>${esc(pIntro)}</p>` : ""}`;
  $("#prio-grid").classList.add("n" + (S.prioridades?.itens || []).length);
  $("#prio-grid").innerHTML = (S.prioridades?.itens || []).map((p, i) => `
    <article class="prio"><div class="n">${i + 1}</div><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></article>`).join("");

  // ---------- Manifesto ----------
  const m = S.manifesto || {};
  const itens = (l) => (l || []).length ? `<ul class="mitems">${l.map((x) => `<li><b>${esc(x.t)}.</b> ${esc(x.d)}</li>`).join("")}</ul>` : "";
  const secHtml = (s, i) => `<details class="msec"><summary><span class="i">${i + 1}</span><span class="t">${esc(s.titulo)}</span></summary><div class="msec-body">
      ${paras(s.texto)}${itens(s.itens)}${paras(s.fecho)}
      ${(s.subsec || []).map((u) => `<h4>${esc(u.titulo)}</h4>${paras(u.texto)}${itens(u.itens)}`).join("")}
    </div></details>`;
  const secs = m.seccoes || [];
  $("#manifesto").innerHTML = `
    <div class="side"><p class="eyebrow">Manifesto · Lista ${esc(S.lista)}</p>
      <blockquote class="${String(m.citacao || "").length > 140 ? "long" : ""}">${esc(m.citacao)}</blockquote>
      ${secs.length > 1 ? `<button class="linkbtn" id="mtoggle" type="button">Abrir todas as secções</button>` : ""}
    </div>
    <div class="body">${m.compacto ? [].concat(m.paragrafos || []).map((p) => `<p class="junto">${esc(p)}</p>`).join("") : paras(m.paragrafos)}
      ${secs.length ? `<div class="msecs">${secs.map(secHtml).join("")}</div>` : ""}
      ${paras(m.fecho)}
      ${(m.compromissos || []).length ? `<h3>Comprometemo-nos a</h3><ul>${m.compromissos.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}
      ${m.pdf ? `<p><a class="btn ghost" href="${esc(m.pdf)}" target="_blank" rel="noopener">Descarregar manifesto (PDF)</a></p>` : ""}
    </div>`;
  const mt = $("#mtoggle");
  if (mt) mt.addEventListener("click", () => {
    const ds = [...document.querySelectorAll(".msec")], open = ds.some((d) => !d.open);
    ds.forEach((d) => { d.open = open; });
    mt.textContent = open ? "Fechar todas as secções" : "Abrir todas as secções";
  });

  // ---------- Candidatos (lista) ----------
  $("#cand-head").innerHTML = `<p class="eyebrow">A lista</p><h2>${esc(S.candidatos?.titulo)}</h2><p>${esc(S.candidatos?.intro)}</p>`;
  let filtro = "", unidade = "";
  // "semCategoria": true no data.js esconde a categoria profissional (ex.: «Professor Auxiliar») nos cartões e nas fichas.
  const semCat = !!S.candidatos?.semCategoria;
  if (semCat) $("#search").placeholder = "Pesquisar por nome ou departamento…";
  $("#chips").innerHTML = units.length > 1
    ? [`<button class="chip" type="button" aria-pressed="true" data-u="">Todos</button>`].concat(units.map((u) => `<button class="chip" type="button" aria-pressed="false" data-u="${esc(u)}">${esc(u)}</button>`)).join("")
    : "";
  $("#chips").addEventListener("click", (ev) => {
    const b = ev.target.closest(".chip"); if (!b) return;
    unidade = b.dataset.u;
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    renderCands();
  });
  $("#search").addEventListener("input", (ev) => { filtro = ev.target.value.trim(); renderCands(); });

  const photo = (c) => c.foto
    ? `<img src="${esc(c.foto)}" alt="Fotografia de ${esc(c.nome)}" loading="lazy">`
    : `<span class="ini" aria-hidden="true">${esc(initials(c.nome))}</span>`;
  const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function renderCands() {
    const f = norm(filtro);
    let html = "";
    grupos.forEach((g) => {
      const list = all.filter((c) => c.grupo === g.titulo)
        .filter((c) => !unidade || c.unidade === unidade)
        .filter((c) => !f || norm([c.nome, semCat ? "" : c.categoria, c.unidade, c.departamento].join(" ")).includes(f));
      if (!list.length) return;
      html += `<h3 class="group-title">${esc(g.titulo)} <small>${list.length}</small></h3><div class="cands">` +
        list.map((c) => `<button class="cand" type="button" data-i="${all.indexOf(c)}">
          <span class="av-wrap"><span class="av">${photo(c)}</span><span class="ord">${c.ordem}</span></span>
          <span class="meta"><b>${esc(c.nome)}</b>${semCat ? "" : `<span class="cat">${esc(c.categoria)}</span>`}${c.unidade ? `<span class="tag">${esc(c.unidade)}</span>` : ""}</span>
          <span class="go" aria-hidden="true">›</span>
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
      <div class="ph">${photo(c)}</div>
      <div class="txt"><span class="role">${esc(c.grupo)} · n.º ${c.ordem}</span>
        <h3>${esc(c.nome)}</h3>
        <div class="sub">${esc([semCat ? "" : c.categoria, c.departamento || c.unidade].filter(Boolean).join(" · "))}</div>
        ${paras(c.bio || "Biografia a acrescentar.")}
        ${c.link ? `<p><a href="${esc(c.link)}" target="_blank" rel="noopener">Página no SIGARRA →</a></p>` : ""}
      </div></div><button class="close" type="button" aria-label="Fechar">×</button></div>`;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  });
  dlg.addEventListener("click", (ev) => { if (ev.target === dlg || ev.target.closest(".close")) { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); } });

  // ---------- Eleição ----------
  $("#elei-head").innerHTML = `<p class="eyebrow">A eleição</p><h2>${esc(e.titulo || "Como votar")}</h2><p>${esc(e.intro || "")}</p>`;
  $("#info-grid").innerHTML = (e.factos || []).map((x) => `<div class="info"><span class="ic">${iconFor(x.k)}</span>
    <div><div class="k">${esc(x.k)}</div><div class="v">${esc(x.v)}</div>${x.p ? `<p>${esc(x.p)}</p>` : ""}</div></div>`).join("");
  $("#docs").innerHTML = (e.documentos || []).map((d) => `<a class="btn ghost" href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.titulo)} ↗</a>`).join("");

  // ---------- Contacto + rodapé ----------
  const c = S.contacto || {};
  $("#contact").innerHTML = `<div><h2>${esc(c.titulo || "Fale connosco")}</h2><p>${esc(c.texto || "")}</p></div>
    <div class="actions">${c.email ? `<a class="btn light" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ""}
    ${c.form ? `<a class="btn outline" href="${esc(c.form)}" target="_blank" rel="noopener">Enviar contributo ↗</a>` : ""}
    <button class="btn outline" id="share" type="button">Partilhar esta página</button></div>`;
  $("#share").addEventListener("click", async (ev) => {
    const btn = ev.currentTarget, url = location.href.split("#")[0];
    try {
      if (navigator.share) await navigator.share({ title: document.title, url });
      else { await navigator.clipboard.writeText(url); btn.textContent = "Ligação copiada ✓"; }
    } catch (_) { /* partilha cancelada */ }
  });
  const isCR = /representantes/i.test(S.orgao);
  // No domínio próprio (ex.: cc.listab.pt) liga ao subdomínio do outro conselho; no github.io usa o caminho relativo.
  const noDominio = S.dominio && location.hostname === S.dominio && S.dominioOutro;
  const outro = [noDominio ? `https://${S.dominioOutro}/` : (isCR ? "../cientifico/" : "../representantes/"),
    isCR ? "Lista B ao Conselho Científico" : "Lista B ao Conselho de Representantes"];
  const doc0 = (e.documentos || [])[0];
  $("#foot").innerHTML = `<div class="foot-brand">${logo(logoSub)}</div>
    <nav aria-label="Rodapé"><a href="${outro[0]}">${outro[1]} →</a>${doc0 ? `<a href="${esc(doc0.url)}" target="_blank" rel="noopener">Eleições no SIGARRA ↗</a>` : ""}<a href="#topo">Voltar ao topo ↑</a></nav>`;

  // ---------- Navegação ativa + entrada suave ----------
  if ("IntersectionObserver" in window) {
    const links = [...nav.querySelectorAll('a[href^="#"]:not(.cta)')];
    const byId = Object.fromEntries(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting && byId[en.target.id]) { links.forEach((a) => a.classList.remove("on")); byId[en.target.id].classList.add("on"); }
    }), { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const ro = new IntersectionObserver((ents) => ents.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      }), { rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".sec-head, .prio, .info, .msec, .contact, .manifesto .side").forEach((el) => { el.classList.add("reveal"); ro.observe(el); });
    }
  }
})();
