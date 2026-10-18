"use strict";
/* Motor compartilhado das avaliações: etapas, perguntas com condição (showIf), retomada, resultado.
   Cada página define PAGE antes deste script:
   { storeKey, title, eyebrow, lede, notice, sections, compute(ans) -> R, results(R) -> html,
     summary(R) -> texto, sources -> html, needsCrisis(ans) -> bool } */

const num = v => typeof v === "number";
const mean = arr => arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : 0;
const sum = arr => arr.reduce((x, y) => x + y, 0);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sectionById = id => PAGE.sections.find(s => s.id === id);

const CRISIS = `
  <div class="notice crisis" role="note">
    <p><strong>Se você está pensando em se machucar ou em suicídio, procure ajuda agora.</strong></p>
    <p>CVV (Centro de Valorização da Vida): <span class="phone">188</span>, ligação gratuita, 24 horas, ou chat em cvv.org.br. Emergência: SAMU <span class="phone">192</span> ou vá a uma UPA/pronto-socorro. Se puder, fique perto de alguém de confiança e afaste objetos que possam ser usados para se ferir.</p>
  </div>`;

// Resposta de uma etapa por chave do item (ou índice)
function pick(ans, secId, key) {
  const sec = sectionById(secId), a = ans[secId];
  if (!sec || !Array.isArray(a)) return undefined;
  const i = typeof key === "number" ? key : sec.items.findIndex(it => it.key === key);
  return a[i];
}
const visible = (it, a) => !it.showIf || it.showIf(a);

function isComplete(id, a) {
  const sec = sectionById(id);
  return Array.isArray(a) && sec.items.every((it, i) => num(a[i]) || !visible(it, a));
}

let state = { answers: {}, queue: [], view: "home", sec: null, idx: 0 };
try { const raw = localStorage.getItem(PAGE.storeKey); if (raw) state.answers = JSON.parse(raw).answers || {}; } catch (e) {}
function save() { try { localStorage.setItem(PAGE.storeKey, JSON.stringify({ answers: state.answers })); } catch (e) {} }

const app = document.getElementById("app");
const done = id => isComplete(id, state.answers[id]);
const totalItems = () => PAGE.sections.reduce((s, x) => s + x.items.length, 0);

function renderHome() {
  const S = PAGE.sections;
  const doneCount = S.filter(s => done(s.id)).length;
  app.innerHTML = `
    <header class="top">
      <span class="eyebrow">${PAGE.eyebrow}</span>
      <h1>${PAGE.title}</h1>
      <p class="lede">${PAGE.lede}</p>
    </header>
    <div class="stack-lg">
      <div class="notice">${PAGE.notice}<p class="muted">As respostas ficam só neste navegador. Você pode parar e continuar depois.</p></div>
      ${CRISIS}
      <div class="row">
        <button class="btn" id="startAll">${doneCount === 0 ? "Começar a avaliação" : doneCount < S.length ? "Continuar de onde parei" : "Refazer tudo"}</button>
        ${doneCount ? `<button class="btn ghost" id="seeResults">Ver resultado (${doneCount}/${S.length} etapas)</button>` : ""}
      </div>
      <ol class="steps">
        ${S.map((s, i) => `
          <li>
            <span class="n">${String(i + 1).padStart(2, "0")}</span>
            <div class="body">
              <strong>${esc(s.name)}</strong>
              <span class="muted small">${esc(s.about)}</span>
              <span class="meta">${s.items.length} perguntas${s.validated ? " · instrumento validado" : ""} · ${done(s.id) ? '<span class="chip ok">Concluída</span>' : Array.isArray(state.answers[s.id]) && state.answers[s.id].some(num) ? '<span class="chip warn">Em andamento</span>' : '<span class="chip none">Não iniciada</span>'}</span>
            </div>
            <button class="btn sm ${done(s.id) ? "ghost" : ""}" data-start="${s.id}">${done(s.id) ? "Refazer" : "Fazer"}</button>
          </li>`).join("")}
      </ol>
      ${PAGE.sources}
    </div>`;
  app.querySelector("#startAll").onclick = () => {
    const pending = S.filter(s => !done(s.id)).map(s => s.id);
    if (!pending.length) S.forEach(s => { state.answers[s.id] = []; });
    startQueue(pending.length ? pending : S.map(s => s.id));
  };
  const sr = app.querySelector("#seeResults");
  if (sr) sr.onclick = () => go("results");
  app.querySelectorAll("[data-start]").forEach(b => b.onclick = () => {
    if (done(b.dataset.start)) state.answers[b.dataset.start] = [];
    startQueue([b.dataset.start]);
  });
}

function startQueue(ids) { state.queue = ids.slice(); nextSection(); }

// Abre a próxima etapa da fila, na primeira pergunta visível ainda sem resposta.
function nextSection() {
  state.sec = state.queue.shift();
  const sec = sectionById(state.sec);
  if (!Array.isArray(state.answers[sec.id])) state.answers[sec.id] = [];
  const a = state.answers[sec.id];
  let i = 0;
  while (i < sec.items.length && (num(a[i]) || !visible(sec.items[i], a))) i++;
  state.idx = i < sec.items.length ? i : firstVisible(sec, a);
  go("quiz");
}
function firstVisible(sec, a) { const i = sec.items.findIndex(it => visible(it, a)); return i < 0 ? 0 : i; }
function nextVisible(sec, a, from) {
  for (let j = from + 1; j < sec.items.length; j++) if (visible(sec.items[j], a)) return j;
  return -1;
}
function prevVisible(sec, a, from) {
  for (let j = from - 1; j >= 0; j--) if (visible(sec.items[j], a)) return j;
  return -1;
}

function go(view) { state.view = view; render(); window.scrollTo(0, 0); }

function renderQuiz() {
  const sec = sectionById(state.sec);
  const a = state.answers[sec.id];
  const it = sec.items[state.idx];
  const opts = it.options || sec.options;
  const total = sec.items.length;
  const secNum = PAGE.sections.indexOf(sec) + 1;
  const showCrisis = (sec.crisisAtStart && state.idx === firstVisible(sec, a)) || PAGE.needsCrisis(state.answers);
  app.innerHTML = `
    <div class="quiz">
      <div class="qnav">
        <button class="btn ghost sm" id="exit">Salvar e sair</button>
        <span class="count">Etapa ${secNum} de ${PAGE.sections.length} · pergunta ${state.idx + 1} de ${total}</span>
      </div>
      <div class="progress" aria-hidden="true"><span style="width:${Math.round((state.idx / total) * 100)}%"></span></div>
      ${state.idx === firstVisible(sec, a) ? `<div class="instr"><strong>${esc(sec.name)}</strong><br>${esc(sec.instr)}</div>` : ""}
      ${showCrisis ? CRISIS : ""}
      ${it.tag ? `<span class="eyebrow">${esc(it.tag)}</span>` : ""}
      <p class="question" id="q">${sec.prefix && !it.noPrefix ? `<span class="prefix">${esc(sec.prefix)}</span>` : ""}${esc(it.t)}</p>
      ${it.hint ? `<p class="hint">${esc(it.hint)}</p>` : ""}
      <div class="options" role="group" aria-labelledby="q">
        ${opts.map((o, i) => `<button class="opt" data-v="${i}" aria-pressed="${a[state.idx] === i}"><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join("")}
      </div>
      <div class="qnav">
        <button class="btn ghost sm" id="back" ${prevVisible(sec, a, state.idx) < 0 ? "disabled" : ""}>Voltar</button>
        <span class="count">Teclas 1–${opts.length}</span>
      </div>
    </div>`;
  app.querySelectorAll(".opt").forEach(b => b.onclick = () => choose(+b.dataset.v));
  app.querySelector("#back").onclick = back;
  app.querySelector("#exit").onclick = () => { save(); go("home"); };
}

function back() {
  const sec = sectionById(state.sec);
  const p = prevVisible(sec, state.answers[sec.id], state.idx);
  if (p >= 0) { state.idx = p; render(); }
}

function choose(v) {
  const sec = sectionById(state.sec);
  const a = state.answers[sec.id];
  a[state.idx] = v;
  // Perguntas que deixaram de valer são apagadas, para não pesarem na pontuação
  sec.items.forEach((it, i) => { if (!visible(it, a)) a[i] = undefined; });
  save();
  app.querySelectorAll(".opt").forEach(b => b.setAttribute("aria-pressed", +b.dataset.v === v));
  setTimeout(() => {
    const n = nextVisible(sec, a, state.idx);
    if (n >= 0) { state.idx = n; render(); return; }
    if (state.queue.length) nextSection();
    else go("results");
  }, 160);
}

document.addEventListener("keydown", e => {
  if (state.view !== "quiz" || e.altKey || e.ctrlKey || e.metaKey) return;
  const sec = sectionById(state.sec);
  const opts = sec.items[state.idx].options || sec.options;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= opts.length) choose(n - 1);
  else if (e.key === "Backspace") back();
});

/* ---------- Peças do resultado ---------- */
function meter(score, max, cuts, label, thin) {
  const p = v => (v / max) * 100;
  return `<div class="meter">
    <div class="lbl"><span>${label}</span><span>${score} / ${max}</span></div>
    <div class="track${thin ? " thin" : ""}" role="img" aria-label="${label}: ${score} de ${max}">
      <div class="fill" style="width:${p(score)}%"></div>
      ${cuts.map(c => `<div class="cut" style="left:calc(${p(c.v)}% - 1px)"><span>${c.l}</span></div>`).join("")}
    </div></div>`;
}
function resultCard(title, chipText, level, body) {
  return `<article class="result">
    <div class="result-head"><h3>${title}</h3>${chipText ? `<span class="chip ${level}">${chipText}</span>` : ""}</div>
    ${body}
  </article>`;
}

function renderResults() {
  const R = PAGE.compute(state.answers, done);
  const missing = PAGE.sections.filter(s => !done(s.id)).map(s => s.short);
  app.innerHTML = `
    <header class="top">
      <span class="eyebrow">Resultado · ${PAGE.sections.length - missing.length} de ${PAGE.sections.length} etapas</span>
      <h1>Seu perfil</h1>
      <div class="row"><button class="btn ghost sm" id="home">Voltar ao início</button></div>
    </header>
    <div class="stack-lg">
      ${missing.length ? `<div class="notice"><p class="small">Etapas não concluídas: ${missing.join(", ")}. O resultado fica mais preciso com todas as etapas.</p></div>` : ""}
      ${PAGE.results(R)}
      <section class="block">
        <label for="summaryText" class="eyebrow">Resumo para levar à consulta</label>
        <textarea id="summaryText" readonly>${esc(PAGE.summary(R))}</textarea>
        <div class="row">
          <button class="btn sm" id="copy">Copiar resumo</button>
          <span class="muted small" id="copyMsg" aria-live="polite"></span>
        </div>
        <div class="row">
          <button class="btn ghost sm" id="reset">Apagar todas as respostas</button>
          <span id="resetConfirm" hidden><button class="btn sm" id="resetYes">Confirmar: apagar</button></span>
        </div>
      </section>
      ${PAGE.sources}
    </div>`;
  app.querySelector("#home").onclick = () => go("home");
  app.querySelector("#copy").onclick = () => {
    const ta = app.querySelector("#summaryText"), msg = app.querySelector("#copyMsg");
    const fallback = () => { ta.focus(); ta.select(); msg.textContent = "Texto selecionado. Use Ctrl+C (ou Copiar) para copiar."; };
    try { navigator.clipboard.writeText(ta.value).then(() => msg.textContent = "Resumo copiado.", fallback); } catch (e) { fallback(); }
  };
  app.querySelector("#reset").onclick = () => { app.querySelector("#resetConfirm").hidden = false; };
  app.querySelector("#resetYes").onclick = () => { state.answers = {}; save(); go("home"); };
}

function render() {
  if (state.view === "quiz") renderQuiz();
  else if (state.view === "results") renderResults();
  else renderHome();
}
render();
