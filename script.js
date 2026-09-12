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

let numeroDoProcesso = 0;

// Traduz os status que a API devolve em inglês.
const TRADUCOES_STATUS = {
  "Running": "Em exibição",
  "Ended": "Encerrada",
  "To Be Determined": "A definir",
  "In Development": "Em desenvolvimento",
};

// Remove as tags HTML que a TVmaze envia dentro do campo "summary".
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

// Monta o HTML de um cartão de resultado a partir de um objeto "show" da TVmaze.
function criarCartaoDeProcesso(show) {
  numeroDoProcesso += 1;
  const numero = String(numeroDoProcesso).padStart(3, "0");

  const generos = show.genres && show.genres.length ? show.genres : [];
  const sombrio = ehTemaSombrio(generos);
  const imagem = show.image && (show.image.medium || show.image.original);

  const tagsGeneros = generos.length
    ? generos.map((genero) => `<span class="tag-genero">${genero}</span>`).join("")
    : `<span class="tag-genero tag-genero--vazia">Não catalogado</span>`;

  const capaHtml = imagem
    ? `<img class="capa" src="${imagem}" alt="Capa de ${show.name}" loading="lazy">`
    : `<div class="capa capa--vazia">Sem registro fotográfico</div>`;

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
      </div>
    </article>
  `;
}

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

// Função principal: busca um título na TVmaze e renderiza os resultados.
async function buscarNoArquivo(termoOriginal) {
  const termo = termoOriginal.trim();

  if (!termo) {
    mostrarErro("Digite o nome de um filme ou série para abrir um processo.");
    return;
  }

  mostrarCarregando();
  numeroDoProcesso = 0;

  try {
    const resposta = await fetch(`${API_BASE}/search/shows?q=${encodeURIComponent(termo)}`);

    if (!resposta.ok) {
      throw new Error(`Falha na consulta (status ${resposta.status})`);
    }

    const resultados = await resposta.json();

    if (!resultados || resultados.length === 0) {
      mostrarVazio(termo);
      return;
    }

    const cartoes = resultados.map((item) => criarCartaoDeProcesso(item.show)).join("");
    areaResultado.innerHTML = cartoes;
  } catch (erro) {
    console.error("Erro ao consultar a TVmaze:", erro);
    mostrarErro(
      "Não foi possível acessar os arquivos centrais agora. Verifique sua conexão e tente novamente em instantes."
    );
  }
}

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
