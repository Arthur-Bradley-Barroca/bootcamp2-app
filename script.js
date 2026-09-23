// ==========================================================================
// Arquivo Sombrio — script.js
// Consome a API pública da TVmaze (https://www.tvmaze.com/api), sem chave
// de autenticação, para montar um catálogo de séries e filmes de terror,
// suspense e slasher.
// ==========================================================================

const API_BASE = "https://api.tvmaze.com";

// Gêneros que a TVmaze usa e que consideramos "tema sombrio", para destacar
// os resultados que já nascem dentro do universo terror/suspense.
const GENEROS_SOMBRIOS = ["Horror", "Thriller", "Mystery", "Crime", "Supernatural"];

const formulario = document.getElementById("formulario-busca");
const campoBusca = document.getElementById("campo-busca");
const areaResultado = document.getElementById("resultado");
const listaSugestoes = document.getElementById("lista-sugestoes");
const listaFavoritos = document.getElementById("favoritos-lista");

let numeroDoProcesso = 0;

// ---------------------------------------------------------------------------
// Favoritos — persistidos em localStorage
// ---------------------------------------------------------------------------

const FAVORITOS_KEY = "arquivo-sombrio-favoritos";

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

function ehFavorito(showId) {
  return carregarFavoritos().some((f) => f.id === showId);
}

function toggleFavorito(show) {
  const favoritos = carregarFavoritos();
  const idx = favoritos.findIndex((f) => f.id === show.id);

  if (idx === -1) {
    favoritos.push(show);
  } else {
    favoritos.splice(idx, 1);
  }

  salvarFavoritos(favoritos);
  return favoritos;
}

// ---------------------------------------------------------------------------
// Tradução e formatação
// ---------------------------------------------------------------------------

const TRADUCOES_STATUS = {
  "Running": "Em exibição",
  "Ended": "Encerrada",
  "To Be Determined": "A definir",
  "In Development": "Em desenvolvimento",
};

function limparHtml(textoComHtml) {
  if (!textoComHtml) return "Nenhum resumo consta no arquivo.";
  const div = document.createElement("div");
  div.innerHTML = textoComHtml;
  return div.textContent || div.innerText || "";
}

function formatarAvaliacao(rating) {
  if (!rating || rating.average === null || rating.average === undefined) {
    return "N/D";
  }
  return rating.average.toFixed(1);
}

function traduzirStatus(status) {
  return TRADUCOES_STATUS[status] || status || "N/D";
}

function ehTemaSombrio(generos) {
  return generos.some((genero) => GENEROS_SOMBRIOS.includes(genero));
}

// ---------------------------------------------------------------------------
// Renderização de cartões
// ---------------------------------------------------------------------------

function criarCartaoDeProcesso(show) {
  numeroDoProcesso += 1;
  const numero = String(numeroDoProcesso).padStart(3, "0");

  const generos = show.genres && show.genres.length ? show.genres : [];
  const sombrio = ehTemaSombrio(generos);
  const imagem = show.image && (show.image.medium || show.image.original);
  const salvo = ehFavorito(show.id);

  const tagsGeneros = generos.length
    ? generos.map((genero) => `<span class="tag-genero">${genero}</span>`).join("")
    : `<span class="tag-genero tag-genero--vazia">Não catalogado</span>`;

  const capaHtml = imagem
    ? `<img class="capa" src="${imagem}" alt="Capa de ${show.name}" loading="lazy">`
    : `<div class="capa capa--vazia">Sem registro fotográfico</div>`;

  const botaoAcao = salvo
    ? `<button type="button" class="botao-remover" data-id="${show.id}" data-name="${show.name.replace(/"/g, '&quot;')}">Remover do arquivo</button>`
    : `<button type="button" class="botao-guardar" data-id="${show.id}" data-name="${show.name.replace(/"/g, '&quot;')}">Guardar no arquivo</button>`;

  return `
    <article class="processo">
      <p class="numero-processo">Processo nº ${numero}</p>
      ${sombrio ? '<span class="selo-confirmado">Caso confirmado</span>' : ""}
      ${capaHtml}
      <div class="corpo-processo">
        <h2 class="nome-titulo">${show.name}</h2>
        <div class="generos">${tagsGeneros}</div>
        <div class="ficha">
          <div class="campo-ficha">
            <span class="rotulo-ficha">Estreia</span>
            <span class="valor-ficha">${show.premiered ? show.premiered.slice(0, 4) : "N/D"}</span>
          </div>
          <div class="campo-ficha">
            <span class="rotulo-ficha">Status</span>
            <span class="valor-ficha">${traduzirStatus(show.status)}</span>
          </div>
          <div class="campo-ficha">
            <span class="rotulo-ficha">Avaliação</span>
            <span class="valor-ficha">${formatarAvaliacao(show.rating)}</span>
          </div>
        </div>
        <p class="rotulo-sinopse">Resumo do caso</p>
        <p class="sinopse">${limparHtml(show.summary)}</p>
        <div class="favorito-acoes">${botaoAcao}</div>
      </div>
    </article>
  `;
}

function criarCartaoFavorito(show) {
  const imagem = show.image && (show.image.medium || show.image.original);
  const capaHtml = imagem
    ? `<img class="capa" src="${imagem}" alt="Capa de ${show.name}" loading="lazy">`
    : `<div class="capa capa--vazia">Sem registro fotográfico</div>`;

  const meta = [show.status, show.premiered ? show.premiered.slice(0, 4) : "N/D"]
    .filter(Boolean)
    .join(" · ");

  return `
    <div class="favorito-card">
      ${capaHtml}
      <h3 class="favorito-nome">${show.name}</h3>
      <p class="favorito-meta">${meta || "Sem dados"}</p>
      <div class="favorito-acoes">
        <button type="button" class="botao-remover" data-id="${show.id}" data-name="${show.name.replace(/"/g, '&quot;')}">Remover do arquivo</button>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Estados da área de resultados
// ---------------------------------------------------------------------------

function mostrarCarregando() {
  areaResultado.innerHTML = `
    <div class="estado-carregando">
      <span class="barra-redacao"></span>
      <span class="barra-redacao"></span>
      <span class="barra-redacao"></span>
      <p>Vasculhando os arquivos...</p>
    </div>
  `;
}

function mostrarErro(mensagem) {
  areaResultado.innerHTML = `<p class="estado-erro">${mensagem}</p>`;
}

function mostrarVazio(termo) {
  areaResultado.innerHTML = `
    <p class="estado-vazio">
      Nenhum processo encontrado para "<strong>${termo}</strong>".
      Tente outro título ou escolha um dos casos sugeridos acima.
    </p>
  `;
}

// ---------------------------------------------------------------------------
// Renderização da lista de favoritos
// ---------------------------------------------------------------------------

function renderizarFavoritos() {
  const favoritos = carregarFavoritos();

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = `
      <p class="estado-vazio">
        Nenhum caso guardado ainda. Clique em "Guardar no arquivo" em
        qualquer processo para salvá-lo aqui.
      </p>
    `;
    return;
  }

  listaFavoritos.innerHTML = favoritos.map(criarCartaoFavorito).join("");
}

// ---------------------------------------------------------------------------
// Eventos — busca
// ---------------------------------------------------------------------------

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  buscarNoArquivo(campoBusca.value);
});

listaSugestoes.addEventListener("click", (evento) => {
  const chip = evento.target.closest(".chip");
  if (!chip) return;
  const titulo = chip.dataset.titulo;
  campoBusca.value = titulo;
  buscarNoArquivo(titulo);
});

// ---------------------------------------------------------------------------
// Eventos — favoritos (delegação, pois os cartões são injetados dinamicamente)
// ---------------------------------------------------------------------------

areaResultado.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".botao-guardar, .botao-remover");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const name = botao.dataset.name;

  // Busca o show completo entre os resultados visuais para manter metadados.
  const cartao = botao.closest(".processo");
  const show = buscarShowPorIdNoDom(id, cartao);

  if (!show) {
    // Fallback: reconstrói um objeto mínimo a partir do que temos.
    show = { id, name };
  }

  const favoritos = toggleFavorito(show);
  renderizarFavoritos();

  // Atualiza a interface dos resultados sem rebuscá-los.
  numeroDoProcesso = 0;
  const termo = campoBusca.value.trim() || " ";
  areaResultado.innerHTML = "";

  // Re-renderiza apenas os cartões visíveis com o novo estado.
  const resultadosVisiveis = [...areaResultado.querySelectorAll(".processo")];
  // (não há mais resultados visiveis aqui — o innerHTML foi limpo)
  // Melhor: re-executar a busca se houver termo.
  if (campoBusca.value.trim()) {
    buscarNoArquivo(campoBusca.value);
  } else {
    renderizarFavoritos();
  }
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
// Busca principal
// ---------------------------------------------------------------------------

// Mantém uma referência dos shows retornados pela última busca para permitir
// a remoção imediata sem re-buscar.
let ultimosShows = [];

async function buscarNoArquivo(termoOriginal) {
  const termo = termoOriginal.trim();

  if (!termo) {
    mostrarErro("Digite o nome de um filme ou série para abrir um processo.");
    return;
  }

  mostrarCarregando();
  numeroDoProcesso = 0;
  ultimosShows = [];

  try {
    const resposta = await fetch(
      `${API_BASE}/search/shows?q=${encodeURIComponent(termo)}`
    );

    if (!resposta.ok) {
      throw new Error(`Falha na consulta (status ${resposta.status})`);
    }

    const resultados = await resposta.json();

    if (!resultados || resultados.length === 0) {
      mostrarVazio(termo);
      return;
    }

    ultimosShows = resultados.map((item) => item.show);
    const cartoes = ultimosShows.map((show) => criarCartaoDeProcesso(show)).join("");
    areaResultado.innerHTML = cartoes;
  } catch (erro) {
    console.error("Erro ao consultar a TVmaze:", erro);
    mostrarErro(
      "Não foi possível acessar os arquivos centrais agora. Verifique sua conexão e tente novamente em instantes."
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buscarShowPorIdNoDom(id, container) {
  const scope = container || areaResultado;
  const showElement = scope.querySelector(`.botao-guardar[data-id="${id}"], .botao-remover[data-id="${id}"]`);
  if (!showElement) return null;

  const cartao = showElement.closest(".processo, .favorito-card");
  if (!cartao) return null;

  const nomeEl = cartao.querySelector(".nome-titulo, .favorito-nome");
  if (!nomeEl) return null;

  // Tenta achar um show na lista recente; se não achar, monta um mínimo.
  const recente = ultimosShows.find((s) => s.id === id);
  if (recente) return recente;

  return { id, name: nomeEl.textContent };
}

// ---------------------------------------------------------------------------
// Inicialização
// ---------------------------------------------------------------------------

renderizarFavoritos();
