"use strict";
/* Avaliação de Ansiedade: GAD-7, critérios do TAG, PHQ-PD (pânico), Mini-SPIN, agorafobia,
   PC-PTSD-5, sinais de TOC e fobia, OASIS (gravidade e prejuízo) e causas físicas. */

const FREQ_GAD = ["Nenhuma vez", "Vários dias", "Mais da metade dos dias", "Quase todos os dias"];
const SIMNAO = ["Sim", "Não"];
const SIM3 = ["Não", "Sim, às vezes", "Sim, na maioria dos dias"];
const SPIN = ["Nada", "Um pouco", "Moderadamente", "Muito", "Extremamente"];
const AGORA = ["Não sinto medo nem evito", "Sinto medo ou desconforto, mas vou", "Evito, ou só vou acompanhado(a)"];
const YN3 = ["Sim", "Não", "Não sei"];

const SECTIONS_ANX = [
  {
    id: "contexto", short: "Sobre você", name: "Sobre você",
    about: "Contexto que muda a interpretação do resultado.",
    instr: "Perguntas rápidas de contexto. Não entram na pontuação.",
    items: [
      { key: "age", t: "Qual a sua idade?", options: ["Menos de 18 anos", "18 a 29 anos", "30 a 49 anos", "50 a 64 anos", "65 anos ou mais"] },
      { key: "gender", t: "Qual o seu gênero?", options: ["Mulher", "Homem", "Não binário / outro", "Prefiro não informar"] },
      { key: "since", t: "Há quanto tempo a ansiedade incomoda você?", options: ["Menos de 1 mês", "Entre 1 e 6 meses", "Mais de 6 meses", "Desde que me lembro (infância ou adolescência)"] },
      { key: "treat", t: "Você faz algum tratamento para ansiedade hoje?", options: ["Nenhum", "Psicoterapia", "Medicação", "Psicoterapia e medicação"] }
    ]
  },
  {
    id: "gad7", short: "GAD-7", name: "Escala de Ansiedade Generalizada (GAD-7)", validated: true,
    about: "Instrumento padrão para medir a intensidade da ansiedade nas últimas 2 semanas. Validado em português.",
    instr: "Nas últimas 2 semanas, com que frequência você foi incomodado(a) pelos problemas abaixo?",
    prefix: "Nas últimas 2 semanas…",
    options: FREQ_GAD,
    items: [
      { t: "Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)" },
      { t: "Não conseguir impedir ou controlar as preocupações" },
      { t: "Preocupar-se demais com coisas diferentes" },
      { t: "Dificuldade para relaxar" },
      { t: "Ficar tão inquieto(a) que se torna difícil permanecer sentado(a)" },
      { t: "Ficar facilmente aborrecido(a) ou irritado(a)" },
      { t: "Sentir medo, como se algo horrível fosse acontecer" },
      { key: "diff", noPrefix: true, t: "Se você teve algum desses problemas, quanta dificuldade eles causaram para trabalhar, cuidar das coisas de casa ou se relacionar com as pessoas?",
        options: ["Nenhuma dificuldade", "Alguma dificuldade", "Muita dificuldade", "Extrema dificuldade"] }
    ]
  },
  {
    id: "tag", short: "Critérios do TAG", name: "Ansiedade generalizada: critérios do DSM-5-TR",
    about: "Completa o GAD-7 com a duração e os sintomas físicos exigidos para o Transtorno de Ansiedade Generalizada.",
    instr: "O Transtorno de Ansiedade Generalizada exige preocupação excessiva por pelo menos 6 meses e sintomas físicos ou mentais associados. Pense nos últimos 6 meses.",
    options: SIM3,
    items: [
      { key: "worry6m", t: "Nos últimos 6 meses, você se preocupou de forma excessiva (mais do que a situação pede) com várias coisas: trabalho, saúde, dinheiro, família?",
        options: ["Não", "Em alguns períodos", "Sim, na maioria dos dias"] },
      { key: "fatigue", t: "Cansar-se com facilidade, mesmo sem esforço físico" },
      { key: "blank", t: "Dificuldade para se concentrar ou sensação de “mente em branco”" },
      { key: "tension", t: "Tensão muscular (pescoço, ombros, costas, mandíbula travada, ranger os dentes)" },
      { key: "sleep", t: "Problemas de sono: demorar a dormir, acordar no meio da noite ou sono que não descansa" }
    ].map(it => ({ ...it, tag: it.key === "worry6m" ? "Critério A" : "Critério C · sintomas associados" }))
  },
  {
    id: "panico", short: "Pânico (PHQ-PD)", name: "Crises de pânico (módulo de pânico do PHQ)", validated: true,
    about: "Identifica crises de pânico e o padrão do Transtorno de Pânico.",
    instr: "Uma crise de pânico é uma onda súbita de medo ou desconforto intenso que chega ao auge em poucos minutos. Responda pensando nas últimas 4 semanas.",
    options: SIMNAO,
    items: [
      { key: "attack", t: "Nas últimas 4 semanas, você teve uma crise de ansiedade, sentindo medo ou pânico de repente?" },
      { key: "before", t: "Isso já tinha acontecido antes?" },
      { key: "blue", t: "Algumas dessas crises vêm de repente, “do nada”, em situações em que você não esperava ficar nervoso(a) ou desconfortável?" },
      { key: "worry", t: "Essas crises incomodam muito você, ou você fica preocupado(a) com a possibilidade de ter outra crise?" },
      { sym: true, t: "Na sua última crise forte, você sentiu falta de ar?" },
      { sym: true, t: "Seu coração disparou, bateu forte ou falhou?" },
      { sym: true, t: "Você sentiu dor ou aperto no peito?" },
      { sym: true, t: "Você suou?" },
      { sym: true, t: "Você sentiu como se estivesse sufocando?" },
      { sym: true, t: "Você teve ondas de calor ou calafrios?" },
      { sym: true, t: "Você teve náusea, mal-estar no estômago ou sensação de que ia ter diarreia?" },
      { sym: true, t: "Você se sentiu tonto(a), sem equilíbrio ou como se fosse desmaiar?" },
      { sym: true, t: "Você sentiu formigamento ou dormência em partes do corpo?" },
      { sym: true, t: "Você tremeu ou se sacudiu?" },
      { sym: true, t: "Você teve medo de estar morrendo?" }
    ].map((it, i) => i === 0 ? it : { ...it, showIf: a => a[0] === 0 })
  },
  {
    id: "social", short: "Mini-SPIN", name: "Ansiedade social (Mini-SPIN)", validated: true,
    about: "3 perguntas com 89% de sensibilidade e 90% de especificidade para ansiedade social.",
    instr: "Marque o quanto cada frase descreve você na última semana.",
    options: SPIN,
    items: [
      { t: "O medo de passar vergonha faz com que eu evite fazer coisas ou falar com pessoas." },
      { t: "Evito atividades em que sou o centro das atenções." },
      { t: "Passar vergonha ou parecer bobo(a) está entre os meus piores medos." }
    ]
  },
  {
    id: "agora", short: "Agorafobia e fobias", name: "Agorafobia, fobias e sinais de TOC",
    about: "As 5 situações de agorafobia do DSM-5-TR, fobia específica e sinais de TOC.",
    instr: "Na agorafobia, a pessoa tem medo de situações em que seria difícil sair ou conseguir ajuda caso passe mal ou tenha uma crise. Responda pensando nos últimos 6 meses.",
    prefix: "Por medo de passar mal e não conseguir sair ou ter ajuda, como você lida com…",
    options: AGORA,
    items: [
      { tag: "Agorafobia", t: "…transporte público (ônibus, metrô, avião, carro como passageiro)?" },
      { tag: "Agorafobia", t: "…espaços abertos (estacionamentos, praças, pontes, feiras)?" },
      { tag: "Agorafobia", t: "…lugares fechados (lojas, cinemas, elevadores, túneis)?" },
      { tag: "Agorafobia", t: "…filas ou multidões?" },
      { tag: "Agorafobia", t: "…sair de casa sozinho(a)?" },
      { key: "phobia", tag: "Fobia específica", noPrefix: true, t: "Você tem um medo intenso e desproporcional de algo específico (altura, animais, sangue, agulhas, avião, vomitar) e evita isso sempre que pode?",
        options: ["Não", "Sim, mas não atrapalha minha vida", "Sim, e atrapalha minha vida"] },
      { key: "obs", tag: "Sinais de TOC", noPrefix: true, t: "Você tem pensamentos, imagens ou impulsos que invadem a mente contra a sua vontade, causam muita angústia, e que você tenta afastar (por exemplo, medo de contaminação, de causar mal a alguém, de algo não estar “certo”)?",
        options: ["Não", "Às vezes", "Sim, com frequência"] },
      { key: "comp", tag: "Sinais de TOC", noPrefix: true, t: "Você sente que precisa repetir ações ou rituais (lavar, verificar, contar, organizar, repetir frases mentalmente) para aliviar a angústia, ocupando mais de 1 hora por dia?",
        options: ["Não", "Sim, mas menos de 1 hora por dia", "Sim, mais de 1 hora por dia"] }
    ]
  },
  {
    id: "ptsd", short: "PC-PTSD-5", name: "Estresse pós-traumático (PC-PTSD-5)", validated: true,
    about: "Rastreio do Departamento de Assuntos de Veteranos dos EUA, com uma pergunta de exposição e 5 sintomas.",
    instr: "Às vezes acontecem coisas incomuns ou especialmente assustadoras, horríveis ou traumáticas, como um acidente grave ou incêndio, agressão física ou sexual, ver alguém ser morto ou gravemente ferido, ou a morte de alguém próximo por homicídio ou suicídio.",
    options: SIMNAO,
    items: [
      { key: "exposed", t: "Alguma vez você passou por algum evento desse tipo?" },
      { t: "No último mês, você teve pesadelos com o evento ou pensou nele sem querer?" },
      { t: "No último mês, você se esforçou para não pensar no evento ou fez de tudo para evitar situações que o lembrassem dele?" },
      { t: "No último mês, você ficou constantemente em alerta, vigilante ou se assustou com facilidade?" },
      { t: "No último mês, você se sentiu entorpecido(a) ou distante das pessoas, das atividades ou do ambiente à sua volta?" },
      { t: "No último mês, você se sentiu culpado(a) ou não conseguiu parar de culpar a si mesmo(a) ou a outras pessoas pelo evento ou pelos problemas que ele causou?" }
    ].map((it, i) => i === 0 ? it : { ...it, showIf: a => a[0] === 0 })
  },
  {
    id: "oasis", short: "OASIS", name: "Gravidade e prejuízo da ansiedade (OASIS)", validated: true,
    about: "5 perguntas que medem o quanto a ansiedade, de qualquer tipo, afeta a sua vida. Ponto de corte 8.",
    instr: "Estas perguntas valem para qualquer tipo de ansiedade (preocupação, pânico, medo social, fobias, traumas). Pense na última semana.",
    items: [
      { t: "Na última semana, com que frequência você se sentiu ansioso(a)?",
        options: ["Nenhuma vez", "De vez em quando", "Metade do tempo", "A maior parte do tempo", "Todo o tempo"] },
      { t: "Quando se sentiu ansioso(a), qual foi a intensidade da ansiedade?",
        options: ["Pouca ou nenhuma", "Leve", "Moderada", "Forte", "Extrema"] },
      { t: "Com que frequência você evitou situações, lugares, objetos ou atividades por causa da ansiedade ou do medo?",
        options: ["Nenhuma vez", "Às vezes", "Com frequência", "Na maior parte do tempo", "Todo o tempo"] },
      { t: "Quanto a ansiedade atrapalhou o seu trabalho, estudo ou as tarefas de casa?",
        options: ["Nada", "Um pouco", "Moderadamente", "Muito", "Extremamente"] },
      { t: "Quanto a ansiedade atrapalhou sua vida social e seus relacionamentos?",
        options: ["Nada", "Um pouco", "Moderadamente", "Muito", "Extremamente"] }
    ]
  },
  {
    id: "fisico", short: "Causas físicas", name: "Causas físicas e substâncias",
    about: "Situações médicas e substâncias que causam ou pioram sintomas de ansiedade.",
    instr: "Muitos sintomas de ansiedade podem ter causa física. O DSM-5-TR exige que essas causas sejam descartadas antes do diagnóstico.",
    options: YN3,
    items: [
      { key: "caffeine", t: "Você consome muita cafeína (mais de 4 xícaras de café por dia, energéticos, pré-treino ou chimarrão em grande quantidade)?" },
      { key: "stim", t: "Você usa estimulantes, descongestionantes, remédios para emagrecer, corticoides, broncodilatadores (“bombinha”) ou hormônio de tireoide?" },
      { key: "alcohol", t: "Você bebe com frequência, usa outras drogas, ou parou ou diminuiu recentemente álcool, calmantes ou remédios para dormir?" },
      { key: "thyroid", t: "Você tem (ou nunca investigou) sinais como emagrecimento sem motivo, intolerância ao calor, tremor nas mãos ou coração acelerado mesmo em repouso?" },
      { key: "medical", t: "Você tem algum problema de saúde diagnosticado que causa falta de ar, palpitação ou tontura (arritmia, asma, anemia, hipoglicemia, labirintite)?" }
    ]
  }
];

function contextAnx(ans) {
  return { age: pick(ans, "contexto", "age"), gender: pick(ans, "contexto", "gender"), since: pick(ans, "contexto", "since"), treat: pick(ans, "contexto", "treat") };
}

function scoreGAD(a) {
  const core = a.slice(0, 7);
  const total = sum(core);
  const band = total >= 15 ? 3 : total >= 10 ? 2 : total >= 5 ? 1 : 0;
  return { total, band, bandName: ["mínima", "leve", "moderada", "grave"][band], diff: a[7], core,
    level: total >= 10 ? "alert" : total >= 5 ? "warn" : "ok" };
}

function scoreTAG(a, gad) {
  const sec = sectionById("tag");
  const v = k => a[sec.items.findIndex(it => it.key === k)];
  // Os 6 sintomas do critério C: inquietação e irritabilidade vêm do GAD-7 (itens 5 e 6); os outros 4 desta etapa
  const c = [
    gad ? gad.core[4] >= 2 : false,
    v("fatigue") === 2, v("blank") === 2,
    gad ? gad.core[5] >= 2 : false,
    v("tension") === 2, v("sleep") === 2
  ];
  const cCount = c.filter(Boolean).length;
  const worry = v("worry6m") === 2;
  const uncontrolled = gad ? gad.core[1] >= 2 : false;
  const impaired = gad ? gad.diff >= 1 : false;
  const met = worry && uncontrolled && cCount >= 3 && impaired;
  const partial = !met && (worry || (gad && gad.total >= 10)) && cCount >= 2;
  return { cCount, worry, uncontrolled, impaired, met, partial };
}

function scorePanic(a) {
  const sec = sectionById("panico");
  const yes = i => a[i] === 0;
  const attack = yes(0);
  const symptoms = sec.items.map((it, i) => it.sym && yes(i)).filter(Boolean).length;
  const gate = [0, 1, 2, 3].every(yes);
  const disorder = gate && symptoms >= 4;            // algoritmo original do PHQ
  const score = [0, 1, 2, 3].filter(yes).length + symptoms; // pontuação somada, corte 5 (estudo espanhol de 2016)
  const attacksOnly = attack && !disorder && symptoms >= 4;
  return { attack, symptoms, gate, disorder, score, attacksOnly,
    level: disorder ? "alert" : attack ? "warn" : "ok" };
}

function scoreSPIN(a) {
  const total = sum(a);
  return { total, positive: total >= 6, level: total >= 6 ? "alert" : total >= 4 ? "warn" : "ok" };
}

function scoreAgora(a) {
  const sec = sectionById("agora");
  const situ = a.slice(0, 5);
  const fear = situ.filter(v => v >= 1).length;
  const avoid = situ.filter(v => v === 2).length;
  const v = k => a[sec.items.findIndex(it => it.key === k)];
  const phobia = v("phobia"), obs = v("obs"), comp = v("comp");
  return { fear, avoid, agora: fear >= 2 && avoid >= 1, phobia, ocd: obs === 2 || comp === 2, ocdSome: obs >= 1 || comp >= 1 };
}

function scorePTSD(a) {
  const exposed = a[0] === 0;
  const total = exposed ? a.slice(1).filter(v => v === 0).length : 0;
  return { exposed, total, level: total >= 3 ? "alert" : total >= 2 ? "warn" : "ok" };
}

function scoreOASIS(a) {
  const total = sum(a);
  return { total, positive: total >= 8, avoid: a[2], level: total >= 8 ? "alert" : total >= 5 ? "warn" : "ok" };
}

function computeAnx(ans, done) {
  const R = { ctx: contextAnx(ans) };
  if (done("gad7")) R.gad = scoreGAD(ans.gad7);
  if (done("tag")) R.tag = scoreTAG(ans.tag, R.gad);
  if (done("panico")) R.panic = scorePanic(ans.panico);
  if (done("social")) R.spin = scoreSPIN(ans.social);
  if (done("agora")) R.agora = scoreAgora(ans.agora);
  if (done("ptsd")) R.ptsd = scorePTSD(ans.ptsd);
  if (done("oasis")) R.oasis = scoreOASIS(ans.oasis);
  if (done("fisico")) {
    const sec = sectionById("fisico");
    R.phys = Object.fromEntries(sec.items.map((it, i) => [it.key, ans.fisico[i]]));
  }
  R.profiles = profilesAnx(R);
  R.severity = severityAnx(R);
  return R;
}

// Perfis prováveis, cada um com grau: 2 = provável, 1 = possível, 0 = pouco provável
function profilesAnx(R) {
  const P = [];
  if (R.gad) {
    const g = R.tag ? (R.tag.met ? 2 : (R.tag.partial || R.gad.total >= 10) ? 1 : 0) : (R.gad.total >= 10 ? 1 : 0);
    P.push({ id: "tag", name: "Transtorno de Ansiedade Generalizada (TAG)", g,
      why: R.tag ? `GAD-7 em ${R.gad.total}; preocupação excessiva nos últimos 6 meses: ${R.tag.worry ? "sim" : "não"}; ${R.tag.cCount} de 6 sintomas associados na maioria dos dias (o DSM exige 3).` : `GAD-7 em ${R.gad.total}.` });
  }
  if (R.panic) P.push({ id: "panico", name: "Transtorno de Pânico", g: R.panic.disorder ? 2 : (R.panic.attack && R.panic.score >= 5) ? 1 : 0,
    why: R.panic.attack ? `Crises nas últimas 4 semanas, com ${R.panic.symptoms} de 11 sintomas físicos (o DSM exige 4). ${R.panic.gate ? "Crises inesperadas, repetidas e com medo de novas crises." : "Nem todas as condições do padrão de pânico foram marcadas (crises inesperadas, repetidas e preocupação com novas crises)."}` : "Sem crises de pânico nas últimas 4 semanas." });
  if (R.spin) P.push({ id: "social", name: "Transtorno de Ansiedade Social", g: R.spin.total >= 6 ? 2 : R.spin.total >= 4 ? 1 : 0,
    why: `Mini-SPIN em ${R.spin.total} de 12 (corte 6).` });
  if (R.agora) P.push({ id: "agora", name: "Agorafobia", g: R.agora.agora ? (R.agora.fear >= 3 ? 2 : 1) : 0,
    why: `Medo em ${R.agora.fear} das 5 situações do DSM-5-TR (exige 2 ou mais), com evitação em ${R.agora.avoid}.` });
  if (R.ptsd) P.push({ id: "ptsd", name: "Transtorno de Estresse Pós-Traumático (TEPT)", g: R.ptsd.total >= 4 ? 2 : R.ptsd.total >= 3 ? 1 : 0,
    why: R.ptsd.exposed ? `PC-PTSD-5 em ${R.ptsd.total} de 5 (corte 3 para maior sensibilidade, 4 para maior precisão).` : "Sem exposição a evento traumático relatada." });
  if (R.agora) {
    P.push({ id: "toc", name: "Transtorno Obsessivo-Compulsivo (TOC)", g: R.agora.ocd ? 1 : 0,
      why: R.agora.ocd ? "Pensamentos intrusivos frequentes ou rituais por mais de 1 hora por dia. Estas perguntas não são um instrumento validado; vale uma avaliação específica." : "Sem sinais importantes nas duas perguntas de triagem." });
    P.push({ id: "fobia", name: "Fobia específica", g: R.agora.phobia === 2 ? 2 : R.agora.phobia === 1 ? 1 : 0,
      why: R.agora.phobia === 2 ? "Medo intenso e evitação que atrapalham a vida." : R.agora.phobia === 1 ? "Medo intenso, mas sem prejuízo relatado." : "Nenhum medo específico intenso relatado." });
  }
  return P;
}

// Nível geral: gravidade dos sintomas (GAD-7) combinada com o prejuízo (OASIS)
function severityAnx(R) {
  if (!R.gad && !R.oasis) return null;
  const g = R.gad ? R.gad.band : 0;
  const o = R.oasis ? (R.oasis.total >= 14 ? 3 : R.oasis.total >= 8 ? 2 : R.oasis.total >= 5 ? 1 : 0) : g;
  let lvl = Math.round((g + o) / 2);
  if (R.panic && R.panic.disorder) lvl = Math.max(lvl, 2);
  return { lvl, name: ["Mínima", "Leve", "Moderada", "Grave"][lvl], g, o };
}

const LEVEL_TXT = [
  "Sintomas mínimos, sem prejuízo importante. Não indica um transtorno de ansiedade.",
  "Sintomas leves. Costumam responder bem a mudanças de hábito, psicoeducação e técnicas de manejo da ansiedade. Se persistirem, procure avaliação.",
  "Sintomas moderados, com prejuízo real na vida. É o nível em que o tratamento é recomendado, geralmente psicoterapia (a terapia cognitivo-comportamental é a mais estudada) e, conforme o caso, medicação.",
  "Sintomas graves, com prejuízo importante. Procure avaliação de psiquiatra e psicólogo o quanto antes."
];
const G_LABEL = [["Pouco provável", "ok"], ["Possível", "warn"], ["Provável", "alert"]];

function resultsAnx(R) {
  const out = [];
  const ctx = R.ctx;
  const S = R.severity;
  const likely = R.profiles.filter(p => p.g === 2), possible = R.profiles.filter(p => p.g === 1);
  if (S) {
    out.push(`<div class="verdict ${S.lvl >= 2 ? "alert" : S.lvl === 1 ? "warn" : "ok"}">
      <span class="eyebrow">Resultado geral · nível de gravidade</span>
      <span class="big">Ansiedade ${S.name.toLowerCase()}</span>
      <p>${LEVEL_TXT[S.lvl]}</p>
      ${likely.length ? `<p class="small"><strong>Padrões prováveis:</strong> ${likely.map(p => p.name).join("; ")}.</p>` : ""}
      ${possible.length ? `<p class="small"><strong>Padrões possíveis:</strong> ${possible.map(p => p.name).join("; ")}.</p>` : ""}
      ${!likely.length && !possible.length ? `<p class="small">Nenhum padrão específico de transtorno de ansiedade apareceu nas respostas.</p>` : ""}
    </div>`);
  }
  const warns = [];
  if (ctx.since === 0) warns.push("Seus sintomas começaram há menos de 1 mês. Ansiedade recente costuma estar ligada a um acontecimento e pode diminuir sozinha. Se começou depois de um trauma, o quadro pode ser de estresse agudo; refaça a avaliação em algumas semanas.");
  if (ctx.age === 0) warns.push("Os instrumentos desta página foram validados em adultos. Para menores de 18 anos, procure um profissional que atenda crianças e adolescentes.");
  if (ctx.treat > 0) warns.push("Você já está em tratamento. As pontuações mostram como você está agora e podem ajudar a acompanhar a evolução com seu profissional.");
  if (R.phys && Object.values(R.phys).some(v => v === 0)) warns.push("Você marcou pelo menos uma possível causa física ou substância (veja abaixo). O DSM-5-TR só diagnostica um transtorno de ansiedade depois de descartar essas causas.");
  if (warns.length) out.push(`<div class="notice">${warns.map(w => `<p class="small">${w}</p>`).join("")}</div>`);

  if (R.gad || R.oasis) {
    const cards = [];
    if (R.gad) cards.push(resultCard("GAD-7: intensidade dos sintomas", `Ansiedade ${R.gad.bandName}`, R.gad.level, `
      ${meter(R.gad.total, 21, [{ v: 5, l: "5" }, { v: 10, l: "10" }, { v: 15, l: "15" }], "Pontuação total")}
      <p>${R.gad.total >= 10 ? "10 pontos ou mais é o ponto de corte para provável transtorno de ansiedade. Nesse corte, o estudo original encontrou 89% de sensibilidade e 82% de especificidade para TAG." : "Abaixo do ponto de corte de 10 para provável transtorno de ansiedade."}</p>
      <p class="small muted">Faixas: 0–4 mínima · 5–9 leve · 10–14 moderada · 15–21 grave. Dificuldade relatada no dia a dia: ${["nenhuma", "alguma", "muita", "extrema"][R.gad.diff]}.</p>`));
    if (R.oasis) cards.push(resultCard("OASIS: prejuízo na vida", R.oasis.positive ? "Acima do corte 8" : "Abaixo do corte", R.oasis.level, `
      ${meter(R.oasis.total, 20, [{ v: 8, l: "8" }], "Pontuação total")}
      <p>${R.oasis.positive ? "A ansiedade está trazendo prejuízo clinicamente importante. No estudo de validação, o corte 8 identificou 89% das pessoas com transtorno de ansiedade." : "A ansiedade não está trazendo prejuízo importante pelo critério da escala."}</p>
      ${R.oasis.avoid >= 2 ? `<p class="small">Você relatou evitar situações com frequência. A evitação alivia no curto prazo, mas mantém a ansiedade no longo prazo; é um dos alvos principais da terapia.</p>` : ""}`));
    out.push(`<section class="stack"><h2>Gravidade e prejuízo</h2>${cards.join("")}</section>`);
  }

  if (R.profiles.length) {
    out.push(`<section class="stack"><h2>Tipos de ansiedade</h2>
      <p>Cada transtorno de ansiedade tem critérios próprios no DSM-5-TR. Abaixo, o quanto suas respostas se aproximam de cada um.</p>
      <div class="crit">
        ${R.profiles.map(p => `<div><strong>${p.name}</strong><span class="chip ${G_LABEL[p.g][1]}">${G_LABEL[p.g][0]}</span><span class="small muted">${p.why}</span></div>`).join("")}
      </div>
    </section>`);
  }

  const details = [];
  if (R.panic && R.panic.attack) details.push(resultCard("Crises de pânico", R.panic.disorder ? "Padrão de pânico" : "Crises presentes", R.panic.level, `
    ${meter(R.panic.symptoms, 11, [{ v: 4, l: "4 sintomas" }], "Sintomas na última crise")}
    <p>${R.panic.disorder ? "Suas respostas preenchem o algoritmo original do PHQ para Transtorno de Pânico: crises repetidas, inesperadas, com preocupação sobre novas crises e 4 ou mais sintomas físicos." : "Crises de pânico isoladas são comuns e não significam, sozinhas, Transtorno de Pânico. Elas também acontecem dentro de outros quadros (ansiedade social, fobias, TEPT, depressão)."}</p>
    <p class="small muted">Sintomas como dor no peito e falta de ar precisam ser avaliados por um médico pelo menos uma vez, para descartar causas cardíacas e respiratórias.</p>`));
  if (R.spin) details.push(resultCard("Mini-SPIN: ansiedade social", R.spin.positive ? "Acima do corte 6" : "Abaixo do corte", R.spin.level, `
    ${meter(R.spin.total, 12, [{ v: 6, l: "6" }], "Pontuação total")}
    <p>${R.spin.positive ? "Pontuação compatível com ansiedade social. O Mini-SPIN tem 89% de sensibilidade e 90% de especificidade nesse corte, mas cerca de metade dos positivos não confirma o diagnóstico na entrevista, então a avaliação é necessária." : "Abaixo do ponto de corte para ansiedade social."}</p>`));
  if (R.ptsd && R.ptsd.exposed) details.push(resultCard("PC-PTSD-5: estresse pós-traumático", R.ptsd.total >= 3 ? "Rastreio positivo" : "Rastreio negativo", R.ptsd.level, `
    ${meter(R.ptsd.total, 5, [{ v: 3, l: "3" }, { v: 4, l: "4" }], "Sintomas no último mês")}
    <p>${R.ptsd.total >= 3 ? "Seus sintomas no último mês são compatíveis com provável TEPT. A confirmação é feita com entrevista clínica (como a CAPS-5) ou com a escala PCL-5." : "Você passou por um evento traumático, mas os sintomas atuais ficaram abaixo do ponto de corte."}${ctx.gender === 0 && R.ptsd.total === 3 ? " Em mulheres, estudos indicam que o corte 3 funciona melhor que o 4." : ""}</p>
    <p class="small muted">Terapias focadas no trauma (como TCC focada no trauma, EMDR e exposição prolongada) são os tratamentos com mais evidência para TEPT.</p>`));
  if (details.length) out.push(`<section class="stack"><h2>Detalhes por instrumento</h2>${details.join("")}</section>`);

  if (R.phys) {
    const names = { caffeine: "Cafeína em excesso", stim: "Estimulantes, corticoides, broncodilatadores ou hormônio de tireoide", alcohol: "Álcool, drogas ou retirada recente de calmantes", thyroid: "Possíveis sinais de hipertireoidismo", medical: "Problema de saúde que causa sintomas parecidos" };
    const hits = Object.entries(R.phys).filter(([, v]) => v === 0);
    const unsure = Object.entries(R.phys).filter(([, v]) => v === 2);
    out.push(`<section class="stack"><h2>Causas físicas a descartar</h2>
      ${hits.length ? `<ul>${hits.map(([k]) => `<li><strong>${names[k]}</strong></li>`).join("")}</ul><p>Leve isso ao médico. Exames simples, como TSH (tireoide), hemograma, glicemia e eletrocardiograma, ajudam a descartar causas físicas.</p>` : "<p>Você não marcou nenhuma das causas físicas ou substâncias mais comuns.</p>"}
      ${unsure.length ? `<p class="small muted">Você respondeu “não sei” em: ${unsure.map(([k]) => names[k].toLowerCase()).join("; ")}.</p>` : ""}
    </section>`);
  }

  out.push(`<section class="block">
    <h2>Próximos passos</h2>
    <ul>
      <li><strong>Pelo SUS:</strong> comece pela Unidade Básica de Saúde. Casos leves e moderados costumam ser tratados ali; casos graves são encaminhados para psiquiatria ou CAPS.</li>
      <li><strong>Psicoterapia:</strong> a terapia cognitivo-comportamental (TCC) é o tratamento psicológico com mais evidência para todos os transtornos de ansiedade. Clínicas-escola de psicologia das universidades costumam atender a preço baixo ou de graça.</li>
      <li><strong>Medicação:</strong> quando indicada, é prescrita por médico (psiquiatra ou clínico). Calmantes do tipo benzodiazepínico aliviam rápido, mas causam dependência; não use sem orientação.</li>
      <li><strong>Enquanto isso:</strong> sono regular, menos cafeína e álcool, atividade física e respiração lenta (expirar mais devagar do que inspira) têm efeito comprovado sobre a ansiedade.</li>
    </ul>
  </section>`);
  return out.join("");
}

function summaryAnx(R) {
  const L = ["Avaliação de Ansiedade: resumo (não é diagnóstico)", ""];
  if (R.severity) L.push(`Nível geral: ansiedade ${R.severity.name.toLowerCase()}`);
  if (R.gad) L.push(`GAD-7: ${R.gad.total}/21 (${R.gad.bandName}); dificuldade no dia a dia: ${["nenhuma", "alguma", "muita", "extrema"][R.gad.diff]}`);
  if (R.oasis) L.push(`OASIS: ${R.oasis.total}/20 (corte 8)`);
  if (R.tag) L.push(`Critérios do TAG: preocupação excessiva 6 meses ${R.tag.worry ? "sim" : "não"}; ${R.tag.cCount}/6 sintomas associados`);
  if (R.panic) L.push(`Pânico (PHQ-PD): ${R.panic.attack ? `crises sim; ${R.panic.symptoms}/11 sintomas; padrão de transtorno ${R.panic.disorder ? "sim" : "não"}` : "sem crises nas últimas 4 semanas"}`);
  if (R.spin) L.push(`Mini-SPIN: ${R.spin.total}/12 (corte 6)`);
  if (R.agora) L.push(`Agorafobia: medo em ${R.agora.fear}/5 situações, evitação em ${R.agora.avoid}; fobia específica: ${["não", "sim, sem prejuízo", "sim, com prejuízo"][R.agora.phobia]}; sinais de TOC: ${R.agora.ocd ? "sim" : R.agora.ocdSome ? "leves" : "não"}`);
  if (R.ptsd) L.push(`PC-PTSD-5: ${R.ptsd.exposed ? `${R.ptsd.total}/5 (corte 3)` : "sem exposição a trauma"}`);
  L.push("", "Padrões: " + R.profiles.map(p => `${p.name} ${G_LABEL[p.g][0].toLowerCase()}`).join("; "));
  if (R.phys) {
    const names = { caffeine: "cafeína", stim: "estimulantes/medicamentos", alcohol: "álcool/drogas/retirada", thyroid: "sinais de tireoide", medical: "condição médica" };
    const hits = Object.entries(R.phys).filter(([, v]) => v === 0).map(([k]) => names[k]);
    L.push(`Causas físicas marcadas: ${hits.length ? hits.join(", ") : "nenhuma"}`);
  }
  return L.join("\n");
}

const SOURCES_ANX = `<section class="block sources">
  <h2>Fontes científicas</h2>
  <p class="muted small">Traduções adaptadas para o português do Brasil a partir das versões originais. As perguntas de critérios do TAG, agorafobia, TOC, fobia e causas físicas seguem o DSM-5-TR, mas não são instrumentos validados.</p>
  <ol>
    <li>Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. <em>Arch Intern Med</em>. 2006;166(10):1092–1097.</li>
    <li>Sousa TV, Viveiros V, Chai MV et al. <a href="https://hqlo.biomedcentral.com/track/pdf/10.1186/s12955-015-0244-2" target="_blank" rel="noopener">Reliability and validity of the Portuguese version of the GAD-7</a>. <em>Health Qual Life Outcomes</em>. 2015;13:50.</li>
    <li>Spitzer RL, Kroenke K, Williams JBW. Validation and utility of a self-report version of PRIME-MD: the PHQ primary care study. <em>JAMA</em>. 1999;282(18):1737–1744. (módulo de pânico)</li>
    <li>Muñoz-Navarro R, Cano-Vindel A, Wood CM et al. <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4985125/" target="_blank" rel="noopener">The PHQ-PD as a screening tool for panic disorder in the primary care setting in Spain</a>. <em>PLoS ONE</em>. 2016. (corte 5)</li>
    <li>Connor KM, Kobak KA, Churchill LE, Katzelnick D, Davidson JRT. Mini-SPIN: a brief screening assessment for generalized social anxiety disorder. <em>Depress Anxiety</em>. 2001;14(2):137–140.</li>
    <li>Weeks JW, Spokas ME, Heimberg RG. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2781035" target="_blank" rel="noopener">Psychometric evaluation of the Mini-Social Phobia Inventory (Mini-SPIN)</a>. 2007.</li>
    <li>Prins A, Bovin MJ, Smolenski DJ et al. The Primary Care PTSD Screen for DSM-5 (PC-PTSD-5): development and evaluation within a veteran primary care sample. <em>J Gen Intern Med</em>. 2016;31(10):1206–1211. <a href="https://istss.org/clinical-resources/adult-trauma-assessments/primary-care-ptsd-screen-for-dsm-5/" target="_blank" rel="noopener">Resumo da ISTSS</a>.</li>
    <li>Norman SB, Cissell SH, Means-Christensen AJ, Stein MB. Development and validation of an Overall Anxiety Severity and Impairment Scale (OASIS). <em>Depress Anxiety</em>. 2006;23(4):245–249.</li>
    <li>Campbell-Sills L, Norman SB, Craske MG et al. Validation of a brief measure of anxiety-related severity and impairment: the OASIS. <em>J Affect Disord</em>. 2009;112(1–3):92–101. (corte 8)</li>
    <li>American Psychiatric Association. <em>DSM-5-TR: Manual Diagnóstico e Estatístico de Transtornos Mentais</em>, 5ª ed., texto revisado. 2022/2023.</li>
    <li><a href="https://cvv.org.br" target="_blank" rel="noopener">Centro de Valorização da Vida (CVV)</a>, telefone 188.</li>
  </ol>
</section>`;

const PAGE = {
  storeKey: "avaliacao-ansiedade-v1",
  title: "Avaliação de Ansiedade",
  eyebrow: "Adultos · 9 etapas · cerca de 20 minutos",
  lede: "Mede a intensidade da ansiedade, o prejuízo que ela causa e qual tipo de transtorno de ansiedade mais se aproxima das suas respostas: generalizada, pânico, social, agorafobia, estresse pós-traumático, fobia ou TOC.",
  notice: `<p><strong>Isto não é um diagnóstico.</strong> Os questionários usados são validados e usados por profissionais de saúde para rastreio. O diagnóstico depende de uma entrevista clínica com psiquiatra ou psicólogo, que também descarta causas físicas.</p>`,
  sections: SECTIONS_ANX,
  compute: computeAnx,
  results: resultsAnx,
  summary: summaryAnx,
  sources: SOURCES_ANX,
  needsCrisis: () => false
};
window.__calc = { scoreGAD, scoreTAG, scorePanic, scoreSPIN, scoreAgora, scorePTSD, scoreOASIS, profilesAnx, severityAnx };
