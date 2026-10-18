"use strict";
/* Avaliação de Depressão: PHQ-9, duração e curso, especificadores do DSM-5-TR, SHAPS (anedonia),
   C-SSRS (risco de suicídio), MDQ (bipolaridade), prejuízo funcional e causas físicas. */

const FREQ_PHQ = ["Nenhuma vez", "Vários dias", "Mais da metade dos dias", "Quase todos os dias"];
const SN = ["Sim", "Não"];
const SAN = ["Sim", "Às vezes / em parte", "Não"];
const SHAPS_OPTS = ["Concordo totalmente", "Concordo", "Discordo", "Discordo totalmente"];
const IMPAIR = ["Nada", "Pouco", "Moderadamente", "Muito", "Extremamente"];
const YN3D = ["Sim", "Não", "Não sei"];

const SECTIONS_DEP = [
  {
    id: "contexto", short: "Sobre você", name: "Sobre você",
    about: "Contexto que muda a interpretação do resultado.",
    instr: "Perguntas rápidas de contexto. Não entram na pontuação.",
    items: [
      { key: "age", t: "Qual a sua idade?", options: ["Menos de 18 anos", "18 a 29 anos", "30 a 49 anos", "50 a 64 anos", "65 anos ou mais"] },
      { key: "gender", t: "Qual o seu gênero?", options: ["Mulher", "Homem", "Não binário / outro", "Prefiro não informar"] },
      { key: "peri", t: "Você está grávida ou teve bebê nos últimos 12 meses?", options: ["Estou grávida", "Tive bebê nos últimos 12 meses", "Não", "Não se aplica"] },
      { key: "loss", t: "Nos últimos 6 meses, você passou por alguma perda ou acontecimento muito difícil (morte de alguém próximo, separação, demissão, doença grave)?", options: ["Sim, uma morte de alguém próximo", "Sim, outro acontecimento difícil", "Não"] },
      { key: "treat", t: "Você faz algum tratamento para depressão hoje?", options: ["Nenhum", "Psicoterapia", "Medicação", "Psicoterapia e medicação"] }
    ]
  },
  {
    id: "phq9", short: "PHQ-9", name: "Questionário de Saúde do Paciente (PHQ-9)", validated: true,
    about: "Os 9 critérios do episódio depressivo do DSM. Validado em adultos brasileiros.",
    instr: "Nas últimas 2 semanas, com que frequência você foi incomodado(a) pelos problemas abaixo?",
    prefix: "Nas últimas 2 semanas…",
    options: FREQ_PHQ,
    items: [
      { t: "Pouco interesse ou pouco prazer em fazer as coisas" },
      { t: "Sentir-se para baixo, deprimido(a) ou sem perspectiva" },
      { t: "Dificuldade para pegar no sono ou permanecer dormindo, ou dormir mais do que de costume" },
      { t: "Sentir-se cansado(a) ou com pouca energia" },
      { t: "Falta de apetite ou comer demais" },
      { t: "Sentir-se mal consigo mesmo(a), achar que é um fracasso ou que decepcionou sua família ou a si mesmo(a)" },
      { t: "Dificuldade para se concentrar nas coisas, como ler ou assistir televisão" },
      { t: "Mover-se ou falar tão devagar que outras pessoas poderiam notar; ou o oposto: estar tão agitado(a) ou inquieto(a) que fica andando de um lado para o outro muito mais do que de costume" },
      { t: "Pensar em se ferir de alguma maneira ou que seria melhor estar morto(a)" },
      { key: "diff", noPrefix: true, t: "Se você teve algum desses problemas, quanta dificuldade eles causaram para trabalhar, cuidar das coisas de casa ou se relacionar com as pessoas?",
        options: ["Nenhuma dificuldade", "Alguma dificuldade", "Muita dificuldade", "Extrema dificuldade"] }
    ]
  },
  {
    id: "curso", short: "Duração e curso", name: "Duração e curso dos sintomas",
    about: "Diferencia episódio atual, depressão recorrente e depressão persistente (distimia).",
    instr: "O DSM-5-TR separa a depressão pelo tempo de duração e pela repetição dos episódios.",
    items: [
      { key: "dur", t: "Há quanto tempo você está assim?", options: ["Menos de 2 semanas", "De 2 semanas a 2 meses", "De 2 meses a 2 anos", "Mais de 2 anos"] },
      { key: "prev", t: "Você já teve outros períodos parecidos antes, separados por pelo menos 2 meses em que esteve bem?", options: ["Não, é a primeira vez", "Sim, uma vez", "Sim, duas vezes ou mais"] },
      { key: "chronic", t: "Nos últimos 2 anos, você se sentiu para baixo na maior parte do dia, mais dias sim do que não, sem passar mais de 2 meses seguidos bem?", options: SN },
      { key: "seasonal", t: "Seus períodos de depressão começam e terminam sempre na mesma época do ano (por exemplo, todo inverno)?", options: ["Sim", "Não", "Não sei / é a primeira vez"] }
    ]
  },
  {
    id: "espec", short: "Características", name: "Características do episódio (especificadores do DSM-5-TR)",
    about: "Identifica traços melancólicos, atípicos, ansiosos e psicóticos, que mudam o tratamento indicado.",
    instr: "Estas perguntas descrevem tipos diferentes de depressão. Pense nas últimas 2 semanas.",
    options: SAN,
    items: [
      { key: "react", tag: "Reatividade do humor", t: "Quando acontece algo bom (uma visita, uma boa notícia), o seu humor melhora, mesmo que por pouco tempo?",
        options: ["Sim, melhora bem", "Melhora só um pouco", "Não melhora nada"] },
      { key: "allpleasure", tag: "Melancolia", t: "Você perdeu o prazer em praticamente todas as atividades, inclusive nas que mais gostava?" },
      { key: "quality", tag: "Melancolia", t: "A sua tristeza é diferente da tristeza comum, como um vazio ou um peso de outra natureza?" },
      { key: "morning", tag: "Melancolia", t: "Você se sente pior pela manhã, e melhora um pouco ao longo do dia?" },
      { key: "early", tag: "Melancolia", t: "Você acorda pelo menos 2 horas antes do habitual e não consegue voltar a dormir?" },
      { key: "weightloss", tag: "Melancolia", t: "Você perdeu o apetite quase totalmente ou emagreceu sem fazer dieta?" },
      { key: "guilt", tag: "Melancolia", t: "Você sente culpa excessiva ou fora de proporção, por coisas pequenas ou que não dependem de você?" },
      { key: "gain", tag: "Características atípicas", t: "Seu apetite aumentou muito ou você ganhou peso de forma importante?" },
      { key: "hypersom", tag: "Características atípicas", t: "Você está dormindo muito mais que o habitual (10 horas ou mais por dia, somando cochilos)?" },
      { key: "leaden", tag: "Características atípicas", t: "Você sente braços e pernas pesados, como se fossem de chumbo?" },
      { key: "reject", tag: "Características atípicas", t: "Você é muito sensível a rejeição ou crítica, a ponto de isso prejudicar suas relações, mesmo fora dos períodos de depressão?" },
      { key: "keyed", tag: "Sofrimento ansioso", t: "Você se sente tenso(a), “no limite”?" },
      { key: "restless", tag: "Sofrimento ansioso", t: "Você se sente inquieto(a) de um jeito fora do comum?" },
      { key: "worryconc", tag: "Sofrimento ansioso", t: "Você tem dificuldade de se concentrar por causa de preocupações?" },
      { key: "dread", tag: "Sofrimento ansioso", t: "Você tem medo de que algo terrível vá acontecer?" },
      { key: "control", tag: "Sofrimento ansioso", t: "Você sente que pode perder o controle de si mesmo(a)?" },
      { key: "psychotic", tag: "Características psicóticas", t: "Neste período, você ouviu vozes ou viu coisas que outras pessoas não percebiam, ou teve certeza de algo que todos diziam não ser real (por exemplo, que está sendo perseguido(a), que tem uma doença grave sem ter, ou que merece ser punido(a))?" }
    ]
  },
  {
    id: "shaps", short: "SHAPS", name: "Capacidade de sentir prazer (SHAPS)", validated: true,
    about: "Escala Snaith-Hamilton, mede a anedonia, um dos sintomas centrais da depressão.",
    instr: "Estas frases falam da sua capacidade de sentir prazer nos últimos dias. Marque o quanto concorda com cada uma.",
    prefix: "Nos últimos dias…",
    options: SHAPS_OPTS,
    items: [
      "…eu gostaria de assistir ao meu programa favorito de TV ou de ouvir meu programa favorito de rádio.",
      "…eu gostaria de estar com minha família ou com amigos próximos.",
      "…eu sentiria prazer nos meus hobbies e passatempos.",
      "…eu conseguiria aproveitar minha comida favorita.",
      "…eu gostaria de um banho quente ou de uma ducha refrescante.",
      "…eu sentiria prazer com o perfume de flores, a brisa do mar ou o cheiro de pão saindo do forno.",
      "…eu gostaria de ver outras pessoas sorrindo.",
      "…eu gostaria de me ver bem arrumado(a) depois de me esforçar com a aparência.",
      "…eu gostaria de ler um livro, uma revista ou um jornal.",
      "…eu gostaria de tomar um café, um chá ou minha bebida favorita.",
      "…eu sentiria prazer com pequenas coisas, como um dia de sol ou uma ligação de um amigo.",
      "…eu conseguiria aproveitar uma paisagem ou vista bonita.",
      "…eu sentiria prazer em ajudar outras pessoas.",
      "…eu sentiria prazer ao receber elogios de outras pessoas."
    ].map(t => ({ t }))
  },
  {
    id: "cssrs", short: "Risco de suicídio", name: "Avaliação de risco (Escala Columbia, C-SSRS triagem)", validated: true, crisisAtStart: true,
    about: "Perguntas diretas usadas por serviços de saúde no mundo todo. Perguntar sobre suicídio não aumenta o risco.",
    instr: "As próximas perguntas são diretas. Elas são feitas assim de propósito, porque perguntar claramente ajuda a identificar quem precisa de apoio agora. Responda com sinceridade; ninguém além de você vê as respostas.",
    options: SN,
    items: [
      { key: "wish", t: "No último mês, você desejou estar morto(a) ou desejou poder dormir e não acordar mais?" },
      { key: "thoughts", t: "No último mês, você teve de fato algum pensamento de se matar?" },
      { key: "method", t: "Você tem pensado em como poderia fazer isso?", showIf: a => a[1] === 0 },
      { key: "intent", t: "Você teve esses pensamentos com alguma intenção de colocá-los em prática?", showIf: a => a[1] === 0 },
      { key: "plan", t: "Você começou a planejar, ou já planejou, os detalhes de como se matar? Pretende levar esse plano adiante?", showIf: a => a[1] === 0 },
      { key: "behavior", t: "Alguma vez na vida você fez algo, começou a fazer algo ou se preparou para fazer algo para acabar com a sua vida?",
        hint: "Por exemplo: juntou remédios, conseguiu uma arma, deu seus pertences, escreveu uma carta de despedida, segurou comprimidos na mão, foi até um lugar alto, tentou." },
      { key: "recent", t: "Isso aconteceu nos últimos 3 meses?", showIf: a => a[5] === 0 }
    ]
  },
  {
    id: "mdq", short: "MDQ", name: "Bipolaridade: períodos de euforia (MDQ)", validated: true,
    about: "Descarta depressão bipolar, que tem tratamento diferente. Validado em pacientes brasileiros.",
    instr: "Pense na sua vida toda. Já houve algum período em que você não estava como de costume e as situações abaixo aconteceram? Não conte períodos sob efeito de álcool ou drogas.",
    prefix: "Já houve um período em que você não estava como de costume e…",
    options: SN,
    items: [
      { t: "…se sentiu tão bem ou tão “acelerado(a)” que outras pessoas acharam que você não estava normal, ou ficou tão acelerado(a) que se meteu em problemas?" },
      { t: "…ficou tão irritado(a) que gritou com pessoas ou começou brigas ou discussões?" },
      { t: "…se sentiu muito mais autoconfiante do que de costume?" },
      { t: "…dormiu muito menos do que de costume e não sentiu falta do sono?" },
      { t: "…ficou muito mais falante ou falou muito mais rápido do que de costume?" },
      { t: "…os pensamentos corriam pela sua cabeça e você não conseguia desacelerar a mente?" },
      { t: "…se distraía tão facilmente com as coisas à sua volta que tinha dificuldade para se concentrar ou manter o foco?" },
      { t: "…teve muito mais energia do que de costume?" },
      { t: "…ficou muito mais ativo(a) ou fez muito mais coisas do que de costume?" },
      { t: "…ficou muito mais sociável ou extrovertido(a) do que de costume, por exemplo, telefonando para amigos no meio da noite?" },
      { t: "…ficou muito mais interessado(a) em sexo do que de costume?" },
      { t: "…fez coisas incomuns para você, ou que outras pessoas poderiam achar exageradas, imprudentes ou arriscadas?" },
      { t: "…gastou dinheiro de um jeito que trouxe problemas para você ou sua família?" },
      { key: "cluster", noPrefix: true, t: "Várias dessas coisas aconteceram durante o mesmo período?", showIf: a => a.slice(0, 13).filter(v => v === 0).length >= 2 },
      { key: "impact", noPrefix: true, t: "Quanto problema essas coisas causaram a você? Por exemplo: não conseguir trabalhar; problemas familiares, financeiros ou legais; envolver-se em brigas.",
        options: ["Nenhum problema", "Problema leve", "Problema moderado", "Problema sério"], showIf: a => a.slice(0, 13).some(v => v === 0) },
      { key: "family", noPrefix: true, t: "Algum parente de sangue seu (filhos, irmãos, pais, avós, tios) tem transtorno bipolar?", options: ["Sim", "Não", "Não sei"] }
    ]
  },
  {
    id: "funcional", short: "Prejuízo", name: "Prejuízo no dia a dia",
    about: "Quanto os sintomas atrapalham trabalho, vida social e casa. Entra no cálculo da gravidade.",
    instr: "Pense nas últimas 2 semanas. O quanto os sintomas atrapalharam cada área da sua vida?",
    prefix: "O quanto os sintomas atrapalharam…",
    options: IMPAIR,
    items: [
      { t: "…seu trabalho ou estudo?" },
      { t: "…sua vida social e o lazer?" },
      { t: "…a vida em família e as tarefas de casa?" },
      { key: "days", noPrefix: true, t: "Nas últimas 4 semanas, quantos dias você deixou de trabalhar, estudar ou cumprir suas tarefas por causa disso?",
        options: ["Nenhum", "1 a 3 dias", "4 a 9 dias", "10 dias ou mais"] }
    ]
  },
  {
    id: "fisico", short: "Causas físicas", name: "Causas físicas e substâncias",
    about: "Condições médicas e substâncias que causam ou imitam depressão.",
    instr: "O DSM-5-TR exige descartar causas físicas e efeitos de substâncias antes do diagnóstico de depressão.",
    options: YN3D,
    items: [
      { key: "thyroid", t: "Você tem hipotireoidismo, ou sinais como frio excessivo, pele seca, queda de cabelo, intestino preso e ganho de peso sem explicação?" },
      { key: "anemia", t: "Você tem (ou nunca investigou) anemia, falta de vitamina B12 ou de vitamina D?" },
      { key: "meds", t: "Você começou nos últimos meses algum destes remédios: corticoide, isotretinoína (para acne), betabloqueador, anticoncepcional hormonal, remédio para emagrecer, interferon?" },
      { key: "alcohol", t: "Você bebe com frequência ou usa outras drogas (incluindo maconha) regularmente?" },
      { key: "chronic", t: "Você tem dor crônica ou alguma doença crônica (diabetes, problemas cardíacos, doenças autoimunes, câncer)?" },
      { key: "apnea", t: "Você ronca alto, para de respirar enquanto dorme ou acorda cansado(a) mesmo dormindo muitas horas?" }
    ]
  }
];

/* ---------- Pontuação ---------- */
function scorePHQ(a) {
  const core = a.slice(0, 9);
  const total = sum(core);
  const band = total >= 20 ? 4 : total >= 15 ? 3 : total >= 10 ? 2 : total >= 5 ? 1 : 0;
  // Sintoma presente pelo DSM: "mais da metade dos dias" ou mais; o item 9 conta com qualquer frequência
  const present = core.map((v, i) => i === 8 ? v >= 1 : v >= 2);
  const count = present.filter(Boolean).length;
  const coreSym = present[0] || present[1];
  return { total, band, bandName: ["mínima", "leve", "moderada", "moderadamente grave", "grave"][band], present, count, coreSym,
    algorithm: count >= 5 && coreSym, item9: core[8], diff: a[9],
    level: total >= 10 ? "alert" : total >= 5 ? "warn" : "ok" };
}

function keyed(ans, id) {
  const sec = sectionById(id), a = ans[id], o = {};
  sec.items.forEach((it, i) => { if (it.key) o[it.key] = a[i]; });
  return o;
}

function scoreSpec(e, phq) {
  const y = v => v === 0, some = v => v <= 1;
  const reactive = e.react === 0;
  const noReact = e.react === 2;
  // Melancolia: perda de prazer em tudo ou humor sem reação, mais 3 de 6
  const melB = [y(e.quality), y(e.morning), y(e.early), phq ? phq.present[7] : false, y(e.weightloss), y(e.guilt)].filter(Boolean).length;
  const melancholic = (y(e.allpleasure) || noReact) && melB >= 3;
  // Atípica: humor reativo, mais 2 de 4, e sem melancolia
  const atyB = [y(e.gain), y(e.hypersom), y(e.leaden), y(e.reject)].filter(Boolean).length;
  const atypical = reactive && atyB >= 2 && !melancholic;
  // Sofrimento ansioso: 2 de 5; 4 ou 5 = grave
  const anxN = [e.keyed, e.restless, e.worryconc, e.dread, e.control].filter(some).length;
  return { melancholic, melB, atypical, atyB, anxN, anxious: anxN >= 2, psychotic: e.psychotic === 0, psychoticMaybe: e.psychotic === 1 };
}

function scoreSHAPS(a) {
  const total = a.filter(v => v >= 2).length; // discordar pontua
  return { total, positive: total >= 3, level: total >= 3 ? "alert" : total >= 2 ? "warn" : "ok" };
}

function scoreCSSRS(c) {
  const y = v => v === 0;
  let risk = 0, why = [];
  if (y(c.wish) || y(c.thoughts)) { risk = 1; why.push(y(c.thoughts) ? "pensamentos de se matar no último mês" : "desejo de estar morto(a) no último mês"); }
  if (y(c.method)) { risk = Math.max(risk, 2); why.push("pensou em como faria"); }
  if (y(c.behavior) && !y(c.recent)) { risk = Math.max(risk, 2); why.push("comportamento suicida há mais de 3 meses"); }
  if (y(c.intent)) { risk = 3; why.push("intenção de agir"); }
  if (y(c.plan)) { risk = 3; why.push("plano com intenção"); }
  if (y(c.recent)) { risk = 3; why.push("comportamento suicida nos últimos 3 meses"); }
  return { risk, why, name: ["Nenhum risco identificado", "Risco baixo", "Risco moderado", "Risco alto"][risk] };
}

function scoreMDQ(a, sec) {
  const yes = a.slice(0, 13).filter(v => v === 0).length;
  const iC = sec.items.findIndex(it => it.key === "cluster"), iI = sec.items.findIndex(it => it.key === "impact"), iF = sec.items.findIndex(it => it.key === "family");
  const cluster = a[iC] === 0, impact = a[iI] >= 2;
  const positive = yes >= 7 && cluster && impact;
  return { yes, cluster, impact, impactIdx: a[iI], family: a[iF] === 0, positive,
    level: positive ? "alert" : (yes >= 7 || (yes >= 5 && cluster)) ? "warn" : "ok" };
}

function scoreFunc(a) {
  const domains = a.slice(0, 3);
  return { domains, max: Math.max(...domains), total: sum(domains), days: a[3] };
}

/* ---------- Diagnóstico provável e nível ---------- */
function computeDep(ans, done) {
  const R = { ctx: Array.isArray(ans.contexto) ? keyed(ans, "contexto") : {} };
  if (done("phq9")) R.phq = scorePHQ(ans.phq9);
  if (done("curso")) R.course = keyed(ans, "curso");
  if (done("espec")) R.spec = scoreSpec(keyed(ans, "espec"), R.phq);
  if (done("shaps")) R.shaps = scoreSHAPS(ans.shaps);
  if (done("cssrs")) R.cssrs = scoreCSSRS(keyed(ans, "cssrs"));
  if (done("mdq")) R.mdq = scoreMDQ(ans.mdq, sectionById("mdq"));
  if (done("funcional")) R.func = scoreFunc(ans.funcional);
  if (done("fisico")) R.phys = keyed(ans, "fisico");
  R.dx = diagnoseDep(R);
  return R;
}

function diagnoseDep(R) {
  if (!R.phq) return null;
  const P = R.phq, C = R.course || {};
  const durOK = C.dur === undefined ? true : C.dur >= 1;
  const impairment = R.func ? R.func.max : (P.diff >= 2 ? 3 : P.diff === 1 ? 2 : 0);
  const mde = P.algorithm && durOK && (P.diff >= 1 || impairment >= 1);
  const pdd = C.chronic === 0 && C.dur === 3;
  let sev = null;
  if (mde) {
    // Gravidade pelo DSM-5-TR: número de sintomas, intensidade (PHQ-9) e prejuízo
    // grave: quase todos os sintomas, intensos e com prejuízo marcante; leve: só o mínimo de 5, sem intensidade nem prejuízo altos
    if ((R.spec && R.spec.psychotic) || P.count >= 8 || (P.total >= 20 && impairment >= 3)) sev = 3;
    else if (P.count >= 6 || P.total >= 15 || impairment >= 3) sev = 2;
    else sev = 1;
  }
  const subthreshold = !mde && (P.total >= 5 || P.count >= 2);
  const recurrent = C.prev >= 1;
  const bipolarRisk = R.mdq && (R.mdq.positive || R.mdq.level === "warn");
  const peri = R.ctx && (R.ctx.peri === 0 || R.ctx.peri === 1);
  return { mde, sev, pdd, subthreshold, recurrent, durOK, impairment, bipolarRisk, peri,
    seasonal: C.seasonal === 0 && recurrent };
}

const SEV_NAME = { 1: "leve", 2: "moderado", 3: "grave" };
const SEV_TXT = {
  1: "Os sintomas preenchem o critério, mas com poucos sintomas além do mínimo exigido, intensidade administrável e prejuízo leve. Psicoterapia, atividade física e acompanhamento costumam ser a primeira escolha.",
  2: "Número de sintomas, intensidade e prejuízo entre leve e grave. As diretrizes recomendam tratamento ativo: psicoterapia, antidepressivo ou a combinação dos dois.",
  3: "A maioria dos sintomas está presente, com intensidade alta e prejuízo marcante na vida. Procure um psiquiatra o quanto antes. A combinação de psicoterapia e medicação é a mais indicada."
};

function resultsDep(R) {
  const out = [];
  const D = R.dx, P = R.phq;
  const crisis = (P && P.item9 >= 1) || (R.cssrs && R.cssrs.risk >= 1);
  if (R.cssrs && R.cssrs.risk >= 2) {
    out.push(`<div class="verdict alert"><span class="eyebrow">Prioridade</span><span class="big">${R.cssrs.name} de suicídio</span>
      <p>${R.cssrs.risk === 3 ? "Suas respostas indicam risco alto. <strong>Procure ajuda hoje</strong>: ligue para o CVV (188), vá a uma UPA ou pronto-socorro, ou ligue para o SAMU (192). Não fique sozinho(a) e conte a alguém de confiança como você está." : "Suas respostas indicam risco moderado. Converse com um profissional de saúde nos próximos dias e conte a alguém de confiança. Se os pensamentos ficarem mais fortes, procure ajuda imediata."}</p>
      <p class="small">Pesou para isso: ${R.cssrs.why.join("; ")}.</p></div>`);
  }
  if (crisis) out.push(CRISIS);

  if (D) {
    let title, lvl, body;
    if (D.mde) {
      title = `Compatível com episódio depressivo ${SEV_NAME[D.sev]}`;
      lvl = D.sev >= 2 ? "alert" : "warn";
      body = SEV_TXT[D.sev];
    } else if (D.subthreshold) {
      title = "Sintomas depressivos abaixo do critério";
      lvl = "warn";
      body = !D.durOK ? "Os sintomas existem, mas duram menos de 2 semanas, o tempo mínimo exigido. Acompanhe: se continuarem, refaça a avaliação." : "Há sintomas depressivos, mas não no número ou na frequência exigidos para um episódio depressivo maior. Ainda assim, merecem atenção, principalmente se persistirem.";
    } else {
      title = "Sem sinais de episódio depressivo";
      lvl = "ok";
      body = "Suas respostas não indicam depressão neste momento. Se você ainda sente que algo não vai bem, isso é motivo suficiente para conversar com alguém.";
    }
    const tags = [];
    if (D.mde && D.recurrent) tags.push("recorrente (já houve episódios anteriores)");
    if (D.pdd) tags.push("com padrão persistente por mais de 2 anos (distimia)");
    if (R.spec && D.mde) {
      if (R.spec.anxious) tags.push(`com sofrimento ansioso${R.spec.anxN >= 4 ? " grave" : ""}`);
      if (R.spec.melancholic) tags.push("com características melancólicas");
      if (R.spec.atypical) tags.push("com características atípicas");
      if (R.spec.psychotic) tags.push("com possíveis características psicóticas");
    }
    if (D.mde && D.peri) tags.push("com início no período gestacional ou pós-parto");
    if (D.mde && D.seasonal) tags.push("com possível padrão sazonal");
    out.push(`<div class="verdict ${lvl}">
      <span class="eyebrow">Resultado geral${D.mde ? " · nível de gravidade (DSM-5-TR)" : ""}</span>
      <span class="big">${title}</span>
      <p>${body}</p>
      ${tags.length ? `<p class="small"><strong>Características:</strong> ${tags.join("; ")}.</p>` : ""}
      ${D.bipolarRisk ? `<p class="small"><strong>Atenção:</strong> o questionário de bipolaridade mostrou ${R.mdq.positive ? "rastreio positivo" : "alguns sinais"}. Antes de iniciar antidepressivo, conte isso ao médico: na depressão bipolar o tratamento é diferente, e antidepressivo sozinho pode piorar o quadro.</p>` : ""}
    </div>`);
  }

  const warns = [];
  const ctx = R.ctx || {};
  if (ctx.loss === 0) warns.push("Você perdeu alguém próximo recentemente. Tristeza, choro, saudade e dificuldade de sono fazem parte do luto e não são doença. O DSM-5-TR diferencia: no luto, a dor vem em ondas ligadas à pessoa perdida e a autoestima costuma se manter; na depressão, o vazio é constante e vem com sentimento de inutilidade. Os dois podem coexistir.");
  if (ctx.peri === 0 || ctx.peri === 1) warns.push("Gravidez e pós-parto são períodos de risco para depressão. Para esse período, a escala mais usada é a EPDS (Escala de Depressão Pós-Parto de Edimburgo). Converse com seu obstetra ou com a equipe da UBS; existe tratamento seguro para quem amamenta.");
  if (ctx.age === 0) warns.push("Os instrumentos desta página foram validados em adultos. Para menores de 18 anos, procure um profissional que atenda adolescentes.");
  if (ctx.age === 4) warns.push("Em pessoas com 65 anos ou mais, depressão pode aparecer mais como queixas físicas, cansaço e esquecimento do que como tristeza. Vale também investigar causas físicas e cognitivas.");
  if (ctx.treat > 0) warns.push("Você já está em tratamento. Use as pontuações para acompanhar a evolução: uma queda de 50% ou mais no PHQ-9 é considerada resposta ao tratamento, e uma pontuação abaixo de 5 é considerada remissão.");
  if (warns.length) out.push(`<div class="notice">${warns.map(w => `<p class="small">${w}</p>`).join("")}</div>`);

  const cards = [];
  if (P) cards.push(resultCard("PHQ-9: intensidade dos sintomas", `Depressão ${P.bandName}`, P.level, `
    ${meter(P.total, 27, [{ v: 5, l: "5" }, { v: 10, l: "10" }, { v: 15, l: "15" }, { v: 20, l: "20" }], "Pontuação total")}
    <p>${P.count} de 9 sintomas presentes na maior parte dos dias${P.coreSym ? ", incluindo humor deprimido ou perda de interesse" : ", sem humor deprimido ou perda de interesse frequentes (um dos dois é obrigatório)"}. ${P.total >= 10 ? "O ponto de corte internacional é 10; no estudo brasileiro feito em Pelotas, o melhor corte foi 9." : P.total === 9 ? "Sua pontuação está no ponto de corte do estudo brasileiro (9)." : ""}</p>
    <p class="small muted">Faixas: 0–4 mínima · 5–9 leve · 10–14 moderada · 15–19 moderadamente grave · 20–27 grave.</p>`));
  if (R.shaps) cards.push(resultCard("SHAPS: capacidade de sentir prazer", R.shaps.positive ? "Anedonia presente" : "Prazer preservado", R.shaps.level, `
    ${meter(R.shaps.total, 14, [{ v: 3, l: "3" }], "Situações em que não sentiria prazer")}
    <p>${R.shaps.positive ? "Você indicou perda de prazer em 3 ou mais situações do dia a dia, o ponto que separa capacidade de prazer normal de anedonia. A anedonia é um dos dois sintomas centrais da depressão e costuma demorar mais para melhorar; vale contar isso ao profissional." : "A capacidade de sentir prazer está dentro do esperado."}</p>`));
  if (R.func) cards.push(resultCard("Prejuízo no dia a dia", ["Nenhum", "Leve", "Moderado", "Acentuado", "Extremo"][R.func.max], R.func.max >= 3 ? "alert" : R.func.max >= 2 ? "warn" : "ok", `
    <div class="tablewrap"><table><thead><tr><th>Área</th><th>Prejuízo</th></tr></thead><tbody>
      ${["Trabalho ou estudo", "Vida social e lazer", "Família e casa"].map((n, i) => `<tr><td>${n}</td><td>${IMPAIR[R.func.domains[i]]}</td></tr>`).join("")}
      <tr><td>Dias perdidos (4 semanas)</td><td>${["Nenhum", "1 a 3", "4 a 9", "10 ou mais"][R.func.days]}</td></tr>
    </tbody></table></div>`));
  if (cards.length) out.push(`<section class="stack"><h2>Intensidade, prazer e prejuízo</h2>${cards.join("")}</section>`);

  if (R.spec) {
    const S = R.spec;
    out.push(`<section class="stack"><h2>Tipo de depressão</h2>
      <p>O DSM-5-TR usa “especificadores” para descrever o tipo do episódio. Eles ajudam o profissional a escolher o tratamento.</p>
      <div class="crit">
        <div><strong>Melancólica</strong><span class="chip ${S.melancholic ? "alert" : S.melB >= 2 ? "warn" : "ok"}">${S.melancholic ? "Provável" : S.melB >= 2 ? "Alguns sinais" : "Pouco provável"}</span><span class="small muted">Perda de prazer em tudo, piora pela manhã, despertar precoce, perda de apetite, culpa excessiva. ${S.melB} de 6 sinais (o DSM exige 3). Costuma responder bem a medicação.</span></div>
        <div><strong>Atípica</strong><span class="chip ${S.atypical ? "alert" : S.atyB >= 2 ? "warn" : "ok"}">${S.atypical ? "Provável" : S.atyB >= 2 ? "Alguns sinais" : "Pouco provável"}</span><span class="small muted">Humor que melhora com coisas boas, mais fome, mais sono, corpo pesado, sensibilidade à rejeição. ${S.atyB} de 4 sinais (o DSM exige 2). É mais comum em mulheres e na depressão bipolar.</span></div>
        <div><strong>Com sofrimento ansioso</strong><span class="chip ${S.anxious ? "alert" : S.anxN === 1 ? "warn" : "ok"}">${S.anxious ? (S.anxN >= 4 ? "Presente (grave)" : "Presente") : "Ausente"}</span><span class="small muted">${S.anxN} de 5 sinais (o DSM exige 2). A ansiedade junto com depressão aumenta o risco e merece tratamento específico. Para investigar a fundo, use a <a href="https://claude.ai/artifact/6yyjo7bDRPSdnRdKkXDcTy" target="_blank" rel="noopener">Avaliação de Ansiedade</a>.</span></div>
        <div><strong>Características psicóticas</strong><span class="chip ${S.psychotic ? "alert" : S.psychoticMaybe ? "warn" : "ok"}">${S.psychotic ? "Relatadas" : S.psychoticMaybe ? "Em parte" : "Ausentes"}</span><span class="small muted">${S.psychotic || S.psychoticMaybe ? "Ouvir vozes, ver coisas ou ter certezas que os outros dizem não ser reais exige avaliação psiquiátrica com urgência." : "Nenhum sinal relatado."}</span></div>
      </div>
    </section>`);
  }

  if (R.mdq) out.push(`<section class="stack"><h2>Bipolaridade</h2>${resultCard("MDQ: períodos de euforia", R.mdq.positive ? "Rastreio positivo" : R.mdq.level === "warn" ? "Alguns sinais" : "Rastreio negativo", R.mdq.level, `
    ${meter(R.mdq.yes, 13, [{ v: 7, l: "7" }], "Sintomas marcados “Sim”")}
    <p>${R.mdq.positive ? "Rastreio positivo: 7 ou mais sintomas no mesmo período, com problema moderado ou sério. Isso sugere possíveis episódios de mania ou hipomania. Uma depressão em quem tem transtorno bipolar é tratada de forma diferente." : R.mdq.level === "warn" ? "Abaixo do critério completo, mas com vários sintomas. O MDQ deixa passar parte dos casos de bipolar tipo II; se você reconhece esses períodos, conte ao profissional." : "Sem sinais de períodos de mania ou hipomania."}</p>
    ${R.mdq.family ? `<p class="small">Você tem parente de sangue com transtorno bipolar. Isso aumenta o risco e deve ser informado ao médico.</p>` : ""}
    <p class="small muted">Critério: 7 ou mais “Sim”, no mesmo período, com problema moderado ou sério. Na validação brasileira, o melhor corte foi 8.</p>`)}</section>`);

  if (R.cssrs && R.cssrs.risk <= 1) out.push(`<section class="stack"><h2>Risco de suicídio</h2>${resultCard("Escala Columbia (triagem)", R.cssrs.name, R.cssrs.risk === 1 ? "warn" : "ok", `
    <p>${R.cssrs.risk === 1 ? "Você relatou desejo de estar morto(a) ou pensamentos de suicídio no último mês, sem método, intenção ou plano. Isso é considerado risco baixo, mas merece atenção: fale sobre isso na consulta e com alguém de confiança. Se os pensamentos aumentarem, ligue 188." : "Nenhuma resposta indicou risco de suicídio."}</p>`)}</section>`);

  if (R.phys) {
    const names = { thyroid: "Possível hipotireoidismo", anemia: "Anemia ou falta de vitaminas", meds: "Remédios que podem causar sintomas depressivos", alcohol: "Uso frequente de álcool ou outras drogas", chronic: "Dor ou doença crônica", apnea: "Possível apneia do sono" };
    const hits = Object.entries(R.phys).filter(([, v]) => v === 0);
    out.push(`<section class="stack"><h2>Causas físicas a investigar</h2>
      ${hits.length ? `<ul>${hits.map(([k]) => `<li><strong>${names[k]}</strong></li>`).join("")}</ul><p>Leve isso ao médico. Exames como TSH (tireoide), hemograma, vitamina B12 e vitamina D ajudam a descartar causas físicas. Não pare nenhum remédio por conta própria.</p>` : "<p>Você não marcou nenhuma das causas físicas ou substâncias mais comuns.</p>"}
    </section>`);
  }

  out.push(`<section class="block">
    <h2>Próximos passos</h2>
    <ul>
      <li><strong>Pelo SUS:</strong> comece pela Unidade Básica de Saúde. Depressão leve e moderada é tratada ali; casos graves vão para psiquiatria ou CAPS.</li>
      <li><strong>Psicoterapia:</strong> terapia cognitivo-comportamental, terapia interpessoal e ativação comportamental têm forte evidência. Clínicas-escola de psicologia costumam atender a preço baixo ou de graça.</li>
      <li><strong>Medicação:</strong> prescrita por médico. Antidepressivos levam de 2 a 6 semanas para fazer efeito; não interrompa sem orientação.</li>
      <li><strong>No dia a dia:</strong> atividade física regular tem efeito comparável ao de tratamentos para depressão leve a moderada. Manter horários de sono e pequenas atividades agradáveis ajuda, mesmo sem vontade.</li>
      <li><strong>Leve o resumo abaixo</strong> à consulta.</li>
    </ul>
  </section>`);
  return out.join("");
}

function summaryDep(R) {
  const L = ["Avaliação de Depressão: resumo (não é diagnóstico)", ""];
  const D = R.dx;
  if (D) L.push(`Resultado: ${D.mde ? `compatível com episódio depressivo ${SEV_NAME[D.sev]}` : D.subthreshold ? "sintomas abaixo do critério" : "sem sinais de episódio depressivo"}${D.recurrent ? "; episódios anteriores" : ""}${D.pdd ? "; padrão persistente > 2 anos" : ""}`);
  if (R.phq) L.push(`PHQ-9: ${R.phq.total}/27 (${R.phq.bandName}); ${R.phq.count}/9 sintomas presentes; item 9: ${FREQ_PHQ[R.phq.item9].toLowerCase()}`);
  if (R.course) L.push(`Duração: ${["< 2 semanas", "2 semanas a 2 meses", "2 meses a 2 anos", "> 2 anos"][R.course.dur]}`);
  if (R.spec) L.push(`Especificadores: melancolia ${R.spec.melB}/6${R.spec.melancholic ? " (provável)" : ""}; atípica ${R.spec.atyB}/4${R.spec.atypical ? " (provável)" : ""}; sofrimento ansioso ${R.spec.anxN}/5; sintomas psicóticos ${R.spec.psychotic ? "sim" : R.spec.psychoticMaybe ? "em parte" : "não"}`);
  if (R.shaps) L.push(`SHAPS (anedonia): ${R.shaps.total}/14 (corte 3)`);
  if (R.cssrs) L.push(`C-SSRS (triagem): ${R.cssrs.name.toLowerCase()}${R.cssrs.why.length ? ` (${R.cssrs.why.join("; ")})` : ""}`);
  if (R.mdq) L.push(`MDQ: ${R.mdq.yes}/13; mesmo período ${R.mdq.cluster ? "sim" : "não"}; ${R.mdq.positive ? "positivo" : "negativo"}; histórico familiar ${R.mdq.family ? "sim" : "não/não sei"}`);
  if (R.func) L.push(`Prejuízo: trabalho ${IMPAIR[R.func.domains[0]].toLowerCase()}, social ${IMPAIR[R.func.domains[1]].toLowerCase()}, casa ${IMPAIR[R.func.domains[2]].toLowerCase()}`);
  if (R.phys) {
    const names = { thyroid: "tireoide", anemia: "anemia/vitaminas", meds: "medicamentos", alcohol: "álcool/drogas", chronic: "doença/dor crônica", apnea: "apneia" };
    const hits = Object.entries(R.phys).filter(([, v]) => v === 0).map(([k]) => names[k]);
    L.push(`Causas físicas marcadas: ${hits.length ? hits.join(", ") : "nenhuma"}`);
  }
  return L.join("\n");
}

const SOURCES_DEP = `<section class="block sources">
  <h2>Fontes científicas</h2>
  <p class="muted small">Traduções adaptadas para o português do Brasil a partir das versões originais. As etapas de duração, especificadores, prejuízo e causas físicas seguem o DSM-5-TR, mas não são instrumentos validados.</p>
  <ol>
    <li>Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: validity of a brief depression severity measure. <em>J Gen Intern Med</em>. 2001;16(9):606–613.</li>
    <li>Santos IS, Tavares BF, Munhoz TN et al. <a href="https://scielosp.org/pdf/csp/2013.v29n8/1533-1543/pt" target="_blank" rel="noopener">Sensibilidade e especificidade do PHQ-9 entre adultos da população geral</a>. <em>Cad Saúde Pública</em>. 2013;29(8):1533–1543.</li>
    <li>Snaith RP, Hamilton M, Morley S et al. <a href="https://www.cambridge.org/core/services/aop-cambridge-core/content/view/26DC3D7340E222011A9902EDB65E1E31/S0007125000063868a.pdf/scale_for_the_assessment_of_hedonic_tone_the_snaithhamilton_pleasure_scale.pdf" target="_blank" rel="noopener">A scale for the assessment of hedonic tone: the Snaith-Hamilton Pleasure Scale</a>. <em>Br J Psychiatry</em>. 1995;167:99–103.</li>
    <li>Nakonezny PA, Carmody TJ, Morris DW et al. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2957191" target="_blank" rel="noopener">Psychometric evaluation of the SHAPS in adult outpatients with major depressive disorder</a>. <em>Int Clin Psychopharmacol</em>. 2010.</li>
    <li>Posner K, Brown GK, Stanley B et al. The Columbia–Suicide Severity Rating Scale: initial validity and internal consistency findings. <em>Am J Psychiatry</em>. 2011;168(12):1266–1277. <a href="https://cssrs.columbia.edu" target="_blank" rel="noopener">cssrs.columbia.edu</a></li>
    <li>Hirschfeld RMA, Williams JBW, Spitzer RL et al. Development and validation of a screening instrument for bipolar spectrum disorder: the Mood Disorder Questionnaire. <em>Am J Psychiatry</em>. 2000;157(11):1873–1875.</li>
    <li>Castelo MS, Carvalho ER, Gerhard ES et al. <a href="https://www.scielo.br/j/rbp/a/JBbkjB85qbQ9HpwwwT7kfYz/abstract/?lang=en" target="_blank" rel="noopener">Validity of the Mood Disorder Questionnaire in a Brazilian psychiatric population</a>. <em>Rev Bras Psiquiatr</em>. 2010;32(4):424–428.</li>
    <li>American Psychiatric Association. <em>DSM-5-TR: Manual Diagnóstico e Estatístico de Transtornos Mentais</em>, 5ª ed., texto revisado. 2022/2023. (critérios, gravidade e especificadores)</li>
    <li>Sheehan DV. The Anxiety Disease. 1983. (modelo de prejuízo em 3 áreas usado na etapa de prejuízo)</li>
    <li><a href="https://cvv.org.br" target="_blank" rel="noopener">Centro de Valorização da Vida (CVV)</a>, telefone 188.</li>
  </ol>
</section>`;

const PAGE = {
  storeKey: "avaliacao-depressao-v1",
  title: "Avaliação de Depressão",
  eyebrow: "Adultos · 9 etapas · cerca de 20 minutos",
  lede: "Mede a intensidade dos sintomas depressivos, o nível de gravidade pelo DSM-5-TR, o tipo de depressão (melancólica, atípica, com ansiedade), a capacidade de sentir prazer, o risco de suicídio e sinais de bipolaridade que mudam o tratamento.",
  notice: `<p><strong>Isto não é um diagnóstico.</strong> Os questionários usados são validados e usados por profissionais de saúde para rastreio. O diagnóstico depende de uma entrevista clínica com médico ou psicólogo, que também descarta causas físicas.</p>`,
  sections: SECTIONS_DEP,
  compute: computeDep,
  results: resultsDep,
  summary: summaryDep,
  sources: SOURCES_DEP,
  needsCrisis: ans => {
    const i9 = Array.isArray(ans.phq9) ? ans.phq9[8] : 0;
    const c = Array.isArray(ans.cssrs) ? ans.cssrs : [];
    return i9 >= 1 || c[0] === 0 || c[1] === 0 || c[5] === 0;
  }
};
window.__calc = { scorePHQ, scoreSpec, scoreSHAPS, scoreCSSRS, scoreMDQ, diagnoseDep, keyed };
