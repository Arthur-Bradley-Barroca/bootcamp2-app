// ==========================================================================
// Atlas das Frutas Faladas — script.js
// Expressões idiomáticas do Brasil com frutas e alimentos como protagonistas.
// ==========================================================================

// ---------------------------------------------------------------------------
// Banco de expressões — baseado no conceito do Atlas de Idiomáticas do
// Português do Brasil, com foco em expressões que envolvem frutas.
// ---------------------------------------------------------------------------

const EXPRESSOES = [
  {
    id: 1,
    fruta: "Abacate",
    expressao: "Bata-me um abacate",
    explicacao: "Manda um abacate ou manda um barraco — expressão usada para pedir algo semanal em contexto de lanche ou para indicar que alguém quer algo com urgência. Surge em contextos informais, principalmente entre jovens.",
    exemplo: "\"E aí, bata-me um abacate, que eu tô com fome.\"",
    regioes: ["sudeste"],
    emoji: "🥑"
  },
  {
    id: 2,
    fruta: "Caju",
    expressao: "De caju em caju",
    explicacao: "Dessa forma, de maneira successiva, um após o outro — expressão de origem popular que indica ritmo, sucessão, ou uma sequência ininterrupta de eventos.",
    exemplo: "\"Eles chegaram de caju em caju, sem parar.\"",
    regioes: ["nordeste", "norte"],
    emoji: "🥜"
  },
  {
    id: 3,
    fruta: "Banana",
    expressao: "Banana de dois pedaços",
    explicacao: "Expressão para descrever alguém que é de dois caminhos — indeciso, que muda de opinião facilmente, que não tem caráter definido.",
    exemplo: "\"Não confie nele, é uma banana de dois pedaços.\"",
    regioes: ["nordeste", "sudeste", "norte"],
    emoji: "🍌"
  },
  {
    id: 4,
    fruta: "Banana",
    expressao: "Pra banana verde",
    explicacao: "Diz-se de algo que ainda está verde, imaturo, que não está pronto ou que não deu certo. Também usado para indicar que algo foi interrompido cedo demais.",
    exemplo: "\"O projeto ficou pra banana verde, acabou antes de começar.\"",
    regioes: ["sudeste", "centro-oeste"],
    emoji: "🍌"
  },
  {
    id: 5,
    fruta: "Limão",
    expressao: "Ajudante de limão",
    explicacao: "Pessoa que aparece apenas quando há vantagem ou lucro — que ajuda apenas quando pode beneficiar. Variação de \"ajudante de cadáver\", mas com sabor cítrico.",
    exemplo: "\"Regra de ajudante de limão: aparece na festa, sume no trabalho.\"",
    regioes: ["sudeste"],
    emoji: "🍋"
  },
  {
    id: 6,
    fruta: "Limão",
    expressao: "Levar limão na vida",
    explicacao: "Ter azar, ser infeliz, ter sorte ruim — comparação com o sabor amargo do limão, associado a acontecimentos desagradáveis.",
    exemplo: "\"Sempre levo limão na vida, tudo dá errado pra mim.\"",
    regioes: ["nordeste", "sudeste"],
    emoji: "🍋"
  },
  {
    id: 7,
    fruta: "Manga",
    expressao: "Capa de manga",
    explicacao: "Referencia à manga de uma roupa — origem em rodas de samba, onde os participantes dançavam com as mangas levantadas. Também usada para descrever alguém que se exibe de forma extravagante.",
    exemplo: "\"Ela dançou com capa de manga no bloco.\"",
    regioes: ["nordeste", "sudeste"],
    emoji: "🥭"
  },
  {
    id: 8,
    fruta: "Manga",
    expressao: "Ser manga",
    explicacao: "Expressão usada em contextos de admiração — alguém que é \"manga\" é encantador, fascinante. Surge em gírias urbanas contemporâneas.",
    exemplo: "\"Esse menino é manga, e ganhou na loteria e na vida.\"",
    regioes: ["sudeste"],
    emoji: "🥭"
  },
  {
    id: 9,
    fruta: "Laranja",
    expressao: "Laranja de antes",
    explicacao: "Algo que era melhor antes — comparação com a laranja que, quandoPassada, perde a doçura. Usada para nostalgia ou para criticar algo que piorou.",
    exemplo: "\"Esse bairro era laranja de antes, agora mudou tudo.\"",
    regioes: ["sudeste", "sul"],
    emoji: "🍊"
  },
  {
    id: 10,
    fruta: "Laranja",
    expressao: "Sentir o gosto de laranja",
    explicacao: "Expressão para descrever a experiência de sentir algo novo, diferente, que traz uma sensação de frescor inesperado. Usada em contextos poéticos e de descoberta.",
    exemplo: "\"Quando ouvi aquela música, senti o gosto de laranja.\"",
    regioes: ["sul"],
    emoji: "🍊"
  },
  {
    id: 11,
    fruta: "Melancia",
    expressao: "Cortar a melancia",
    explicacao: "Iniciar algo grande, importante — como cortar a fatia de melancia em uma celebração. Surge em contextos de festas e reunioes familiares.",
    exemplo: "\"Finalmente vamos cortar a melancia nesse projeto.\"",
    regioes: ["centro-oeste", "nordeste"],
    emoji: "🍉"
  },
  {
    id: 12,
    fruta: "Melancia",
    expressao: "Melancia de verão",
    explicacao: "Algo que é sazonal, que aparece apenas em determinada época — usado para descrever oportunidades ou acontecimentos temporários.",
    exemplo: "\"Essa promoção é melancia de verão, durma agora.\"",
    regioes: ["sudeste", "norte"],
    emoji: "🍉"
  },
  {
    id: 13,
    fruta: "Goiaba",
    expressao: "Comer goiaba com o ano novo",
    explicacao: "Expressão para descrever quem come algo fora de época, que faz algo sem timing certo — originate em contextos rurais de agricultura familiar.",
    exemplo: "\"Ele comeu goiaba com o ano novo, sem saber a hora.\"",
    regioes: ["sudeste", "nordeste"],
    emoji: "🍈"
  },
  {
    id: 14,
    fruta: "Goiaba",
    expressao: "Ser goiabada",
    explicacao: "Expressão carioca para descrever algo que é doce, agradável, positivo — origem no doce de goiaba, sehr popular no Rio de Janeiro.",
    exemplo: "\"A vida é goiabada, parabéns!\"",
    regioes: ["sudeste"],
    emoji: "🍈"
  },
  {
    id: 15,
    fruta: "Abacate",
    expressao: "Abacate de avião",
    explicacao: "Expressão de origem em indústria de sedes e moda — um abacate que veio de longe, que é importado, sofisticado. Usada em contextos de luxo e exageros.",
    exemplo: "\"Comprou abacate de avião, que nem era bom.\"",
    regioes: ["sul", "sudeste"],
    emoji: "🥑"
  },
  {
    id: 16,
    fruta: "Caju",
    expressao: "Vitaminas de caju",
    explicacao: "Expressão para descrever coisas que parecem boas, saudáveis, nutritivas, mas que na verdade são apenas aparência — um caju que promete saúde.",
    exemplo: "\"Esse produto é vitaminas de caju, não tem nada real.\"",
    regioes: ["centro-oeste", "sul"],
    emoji: "🥜"
  },
  {
    id: 17,
    fruta: "Banana",
    expressao: "Banana Split",
    explicacao: "Expressão de origem norte-americana que chegou ao Brasil — divide a banana ao meio, como dividir algo entre duas pessoas. Usada em contextos de divisão de bens.",
    exemplo: "\"Eles fizeram um banana split com o dinheiro da venda.\"",
    regioes: ["sudeste"],
    emoji: "🍌"
  },
  {
    id: 18,
    fruta: "Limão",
    expressao: "Limão siciliano",
    explicacao: "Expressão para descrever algo refinado, sofisticado — o limão siciliano é mais delicado que o limão comum, usado em cozinha gourmet.",
    exemplo: "\"Esse vinho é limão siciliano, sofisticado.\"",
    regioes: ["sul", "sudeste"],
    emoji: "🍋"
  },
  {
    id: 19,
    fruta: "Manga",
    expressao: "Manga com açúcar",
    explicacao: "Expressão para descrever algo que é doce, agradável, que tem um toque especial — origem em sobremesas e doces de família.",
    exemplo: "\"A conversa ficou manga com açúcar, muito gostosa.\"",
    regioes: ["nordeste", "sudeste"],
    emoji: "🥭"
  },
  {
    id: 20,
    fruta: "Laranja",
    expressao: "Suco de laranja com gelo",
    explicacao: "Expressão de origem em bares e lanchonetes — algo que é servido frio, agradável, com conforto. Usada para descrever momentos de relaxamento.",
    exemplo: "\"O fim de semana foi suco de laranja com gelo.\"",
    regioes: ["sudeste", "nordeste", "sul"],
    emoji: "🍊"
  }
];

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------

const FAVORITOS_KEY = "atlas-frutas-faladas-favoritos";

function carregarFavoritos() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITOS_KEY) || "[]");
  } catch {
    return [];
  }
}

function salvarFavoritos(lista) {
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(lista));
}

function ehFavorito(expressaoId) {
  return carregarFavoritos().some((f) => f.id === expressaoId);
}

function toggleFavorito(expressao) {
  const favoritos = carregarFavoritos();
  const idx = favoritos.findIndex((f) => f.id === expressao.id);

  if (idx === -1) {
    favoritos.push(expressao);
  } else {
    favoritos.splice(idx, 1);
  }

  salvarFavoritos(favoritos);
  return favoritos;
}

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------

const formulario = document.getElementById("formulario-busca");
const campoBusca = document.getElementById("campo-busca");
const areaResultado = document.getElementById("resultado");
const listaSugestoes = document.getElementById("lista-sugestoes");
const listaFavoritos = document.getElementById("favoritos-lista");
const estadosLista = document.querySelectorAll(".estado");

// ---------------------------------------------------------------------------
// Busca
// ---------------------------------------------------------------------------

function expressoesPara(termo) {
  const t = termo.toLowerCase().trim();
  if (!t) return [];

  return EXPRESSOES.filter((e) => {
    const matchFruta = e.fruta.toLowerCase().includes(t);
    const matchExpressao = e.expressao.toLowerCase().includes(t);
    const matchExplicacao = e.explicacao.toLowerCase().includes(t);
    return matchFruta || matchExpressao || matchExplicacao;
  });
}

function filtrarPorRegiao(regiao) {
  if (!regiao) return EXPRESSOES;
  return EXPRESSOES.filter((e) => e.regioes.includes(regiao));
}

// ---------------------------------------------------------------------------
// Renderização — cartão de expressão
// ---------------------------------------------------------------------------

function classesDaFruta(fruta) {
  const map = {
    "Abacate": "fruta-icon-abacate",
    "Caju": "fruta-icon-caju",
    "Banana": "fruta-icon-banana",
    "Limão": "fruta-icon-limon",
    "Manga": "fruta-icon-manga",
    "Laranja": "fruta-icon-laranja",
    "Melancia": "fruta-icon-melancia",
    "Goiaba": "fruta-icon-goiaba",
  };
  return map[fruta] || "";
}

function renderizarExpressao(expressao) {
  const salvo = ehFavorito(expressao.id);

  const regioesHtml = [
    "norte", "nordeste", "sudeste", "sul", "centro-oeste"
  ].map((reg) => {
    const ativo = expressao.regioes.includes(reg);
    return `<span class="tag-regiao ${ativo ? "" : "inativo"}">${reg}</span>`;
  }).join("");

  return `
    <article class="expressao">
      <div class="expressao-info-top">
        <div class="fruta-icon ${classesDaFruta(expressao.fruta)}">${expressao.emoji}</div>
        <div class="acoes-expressao">
          <button type="button"
                  class="botao-guardar ${salvo ? "salvo" : ""}"
                  data-id="${expressao.id}"
                  data-name="${expressao.expressao.replace(/"/g, '&quot;')}">
            ${salvo ? "Guardado" : "Guardar"}
          </button>
        </div>
      </div>
      <div>
        <h3 class="nome-expressao">${expressao.expressao}</h3>
        <p class="colchetes">${expressao.fruta}</p>
      </div>
      <p class="explicacao">${expressao.explicacao}</p>
      <p class="exemplo">${expressao.exemplo}</p>
      <div class="regioes">${regioesHtml}</div>
    </article>
  `;
}

function renderizarFavorito(expressao) {
  const capaHtml = `
    <div class="fruta-icon ${classesDaFruta(expressao.fruta)}">${expressao.emoji}</div>
  `;

  return `
    <div class="favorito-card">
      ${capaHtml}
      <h3 class="favorito-nome">${expressao.expressao}</h3>
      <p class="favorito-meta">${expressao.fruta} · ${expressao.regioes.join(", ")}</p>
      <div class="favorito-acoes">
        <button type="button"
                class="botao-remover"
                data-id="${expressao.id}"
                data-name="${expressao.expressao.replace(/"/g, '&quot;')}">
          Remover
        </button>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Estados
// ---------------------------------------------------------------------------

function mostrarCarregando() {
  areaResultado.innerHTML = `
    <div class="estado-carregamento">
      <span class="barra-carregamento"></span>
      <span class="barra-carregamento"></span>
      <span class="barra-carregamento"></span>
      <p>Explorando expressões...</p>
    </div>
  `;
}

function mostrarVazio(termo) {
  areaResultado.innerHTML = `
    <p class="estado-vazio">
      Nenhuma expressão encontrada para "${termo}".
      Tente outro nome de fruta ou expressão — ou escolha um dos sugeridos.
    </p>
  `;
}

function mostrarErro(mensagem) {
  areaResultado.innerHTML = `<p class="estado-erro">${mensagem}</p>`;
}

function renderizarFavoritos() {
  const favoritos = carregarFavoritos();

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = `
      <p class="estado-vazio">
        Nenhuma expressão guardada ainda. Clique em "Guardar" em qualquer
        expressão para salvá-la aqui.
      </p>
    `;
    return;
  }

  listaFavoritos.innerHTML = favoritos.map(renderizarFavorito).join("");
}

// ---------------------------------------------------------------------------
// Mapa
// ---------------------------------------------------------------------------

let regiaoAtiva = null;

function atualizarMapa() {
  estadosLista.forEach((estado) => {
    const regiao = estado.dataset.regioes;

    estado.classList.remove("ativo");

    if (regiao === regiaoAtiva) {
      estado.classList.add("ativo");
    }

    const expressoesNaRegiao = EXPRESSOES.filter((e) => e.regioes.includes(regiao));
    const temExpressoes = expressoesNaRegiao.length > 0;

    estado.title = temExpressoes
      ? `${regiao}: ${expressoesNaRegiao.length} expressões encontradas`
      : `${regiao}: sem expressões identificadas`;
  });
}

estadosLista.forEach((estado) => {
  estado.addEventListener("click", () => {
    const regiao = estado.dataset.regioes;
    regiaoAtiva = regiao === regiaoAtiva ? null : regiao;
    atualizarMapa();

    // Se houver um termo de busca ativo, aplica o filtro de região
    if (campoBusca.value.trim()) {
      aplicarFiltro(campoBusca.value, regiaoAtiva);
    } else {
      // Sem busca ativa: mostra mensagem ou filtra todas
      const expressoesFiltradas = regiaoAtiva
        ? filtrarPorRegiao(regiaoAtiva)
        : EXPRESSOES;

      if (expressoesFiltradas.length === 0) {
        mostrarVazio("");
      } else {
        areaResultado.innerHTML = expressoesFiltradas.map(renderizarExpressao).join("");
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Eventos — busca
// ---------------------------------------------------------------------------

function aplicarFiltro(termo, regiao = null) {
  mostrarCarregando();

  const operacoes = [];

  if (termo.trim()) {
    const resultados = expressoesPara(termo);
    const filtrados = regiao
      ? resultados.filter((e) => e.regioes.includes(regiao))
      : resultados;
    operacoes.push(filtrados);
  } else if (regiao) {
    operacoes.push(filtrarPorRegiao(regiao));
  } else {
    operacoes.push(EXPRESSOES);
  }

  const resultados = operacoes[0] || [];

  if (!termo.trim() && !regiao) {
    // Sem filtro = show all
    areaResultado.innerHTML = resultados.map(renderizarExpressao).join("");
    return;
  }

  setTimeout(() => {
    if (resultados.length === 0) {
      mostrarVazio(termo || "essa região");
    } else {
      areaResultado.innerHTML = resultados.map(renderizarExpressao).join("");
    }
  }, 300);
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  aplicarFiltro(campoBusca.value);
});

listaSugestoes.addEventListener("click", (evento) => {
  const chip = evento.target.closest(".chip");
  if (!chip) return;

  const titulo = chip.dataset.titulo;
  campoBusca.value = titulo;
  regiaoAtiva = null;
  atualizarMapa();
  aplicarFiltro(titulo);
});

// ---------------------------------------------------------------------------
// Eventos — favoritos
// ---------------------------------------------------------------------------

areaResultado.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".botao-guardar, .botao-remover");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const expressao = EXPRESSOES.find((e) => e.id === id);
  if (!expressao) return;

  toggleFavorito(expressao);
  renderizarFavoritos();

  // Atualiza o botão no cartão sem re-renderizar tudo
  const botoes = areaResultado.querySelectorAll(
    `.botao-guardar[data-id="${id}"], .botao-remover[data-id="${id}"]`
  );
  botoes.forEach((btn) => {
    btn.textContent = ehFavorito(id) ? "Guardado" : "Guardar";
    btn.classList.toggle("salvo", ehFavorito(id));
  });
});

listaFavoritos.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".botao-remover");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const favoritos = carregarFavoritos();
  const idx = favoritos.findIndex((f) => f.id === id);
  if (idx === -1) return;

  favoritos.splice(idx, 1);
  salvarFavoritos(favoritos);
  renderizarFavoritos();
});

// ---------------------------------------------------------------------------
// Inicialização
// ---------------------------------------------------------------------------

renderizarFavoritos();
atualizarMapa();
