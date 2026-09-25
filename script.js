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

// ==========================================================================
// CONFIGURAÇÃO SUPABASE (ETAPA 02 - Persistência)
// Substituir com os dados do projeto Supabase
// ==========================================================================
const SUPABASE_URL = "https://bknlxebssjawzxwbvglt.supabase.co";
const SUPABASE_KEY = "sb_publishable_mfYUr0Q4yPgKufFm0foBiQ_q0Sy8GAb";

let supabaseCliente = null;

async function initSupabase() {
  if (!SUPABASE_URL) {
    console.warn("Supabase não configurado. Configure SUPABASE_URL e SUPABASE_KEY no script.js");
    return null;
  }
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    supabaseCliente = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase conectado com sucesso");
    return supabaseCliente;
  } catch (erro) {
    console.error("Erro ao inicializar Supabase:", erro);
    return null;
  }
}

async function listarFavoritos() {
  if (!supabaseCliente) return [];
  try {
    const { data, error } = await supabaseCliente
      .from("favoritos")
      .select("*")
      .order("criado_em", { ascending: false });
    if (error) { console.error("Erro ao listar favoritos:", error); return []; }
    return data || [];
  } catch (erro) { console.error("Erro na consulta:", erro); return []; }
}

async function salvarFavorito(show) {
  if (!supabaseCliente) { console.error("Supabase não inicializado"); return null; }
  try {
    // Gerar ID único client-side pois a sequence do Supabase não funciona com chave anon
    const idUnico = Date.now() + Math.floor(Math.random() * 100000);
    const { data, error } = await supabaseCliente.from("favoritos").insert({
      id: idUnico,
      nome_show: show.name,
      generos: show.genres && show.genres.length ? show.genres.join(", ") : null,
      imagem_url: show.image && (show.image.medium || show.image.original) || null,
      avaliacao: show.rating && show.rating.average ? parseFloat(show.rating.average) : null,
      status: show.status,
      regiaodeestreia: show.premiered ? show.premiered.slice(0, 4) : null,
    }).select().single();
    if (error) { console.error("Erro ao salvar:", error); return null; }
    return data;
  } catch (erro) { console.error("Erro na operação:", erro); return null; }
}

async function removerFavorito(id) {
  if (!supabaseCliente) return;
  try {
    const { error } = await supabaseCliente.from("favoritos").delete().eq("id", id);
    if (error) console.error("Erro ao remover:", error);
  } catch (erro) { console.error("Erro na operação:", erro); }
}

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
function criarCartaoDeProcesso(show, favoritoId = null) {
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

  const jaSalvo = !!favoritoId;
  const botaoAcao = jaSalvo
    ? `<div class="favorito-acoes"><button type="button" class="botao-remover" data-db-id="${favoritoId}">Remover do arquivo</button></div>`
    : `<div class="favorito-acoes"><button type="button" class="botao-guardar" data-id="${show.id}" data-nome="${show.name.replace(/"/g, '&quot;')}" data-generos="${generos.join(",")}" data-imagem="${imagem || ""}" data-avaliacao="${formatarAvaliacao(show.rating)}" data-status="${show.status}" data-estreia="${show.premiered ? show.premiered.slice(0,4) : ""}">Guardar no arquivo</button></div>`;

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
    ${botaoAcao}
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

// ==========================================================================
// Renderizar lista de favoritos (ETAPA 02)
// ==========================================================================

function criarCartaoFavorito(favorito) {
  const capaHtml = favorito.imagem_url
    ? `<img class="capa" src="${favorito.imagem_url}" alt="Capa de ${favorito.nome_show}" loading="lazy">`
    : `<div class="capa capa--vazia">Sem registro fotográfico</div>`;

  const meta = [favorito.status, favorito.regiaodeestreia]
    .filter(Boolean)
    .join(" · ");

  const generosHtml = favorito.generos
    ? `<div class="generos">${favorito.generos.split(", ").map(g => `<span class="tag-genero">${g}</span>`).join("")}</div>`
    : "";

  return `
    <div class="favorito-card">
      ${capaHtml}
      ${generosHtml}
      <h3 class="favorito-nome">${favorito.nome_show}</h3>
      <p class="favorito-meta">${meta || "Sem dados"}</p>
      <div class="favorito-acoes">
        <button type="button" class="botao-remover" data-db-id="${favorito.id}">Remover do arquivo</button>
      </div>
    </div>
  `;
}

function renderizarFavoritos(favoritos) {
  const lista = document.getElementById("favoritos-lista");
  if (!lista) return;

  if (!favoritos || favoritos.length === 0) {
    lista.innerHTML = `
      <p class="sem-favoritos">Nenhum arquivo guardado. Faça buscas e clique em "Guardar no arquivo" para salvar seus casos.</p>
    `;
    return;
  }

  lista.innerHTML = favoritos.map(criarCartaoFavorito).join("");
}

async function carregarFavoritos() {
  const favoritos = await listarFavoritos();
  renderizarFavoritos(favoritos);
}

// ==========================================================================
// Supabase — botões de guardar/remover favoritos
// ==========================================================================

areaResultado.addEventListener("click", async (evento) => {
  const botao = evento.target.closest("button");
  if (!botao) return;

  // Botão GUARDAR
  if (botao.classList.contains("botao-guardar")) {
    const id = Number(botao.dataset.id);
    const nome = botao.dataset.nome;
    const generos = botao.dataset.generos;
    const imagem = botao.dataset.imagem;
    const avaliacao = botao.dataset.avaliacao;
    const status = botao.dataset.status;
    const estreia = botao.dataset.estreia;

    botao.disabled = true;
    botao.textContent = "Salvando...";

    // Inicializa Supabase se necessário
    if (!supabaseCliente) {
      await initSupabase();
    }

    if (supabaseCliente) {
      const resultado = await salvarFavorito({ id, name: nome, genres: generos.split(","), image: { medium: imagem }, rating: { average: avaliacao }, status, premiered: estreia ? `${estreia}-01-01` : null });
      if (resultado) {
        botao.textContent = "Já guardado";
        botao.classList.remove("botao-guardar");
        botao.classList.add("botao-jaguardado");
      } else {
        botao.textContent = "Falha ao guardar";
        botao.disabled = false;
      }
    } else {
      botao.textContent = "Configure o Supabase no script.js";
      botao.disabled = false;
    }
  }

  // Botão REMOVER
  if (botao.classList.contains("botao-remover")) {
    const dbId = Number(botao.dataset.dbId);

    botao.disabled = true;
    botao.textContent = "Removendo...";

    if (!supabaseCliente) {
      await initSupabase();
    }

    if (supabaseCliente) {
      await removerFavorito(dbId);
    }

    botao.closest(".favorito-card, .processo").remove();
    botao.disabled = false;
  }
});

// Botão limpar busca
document.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("botao-limpar")) {
    areaResultado.innerHTML = "";
    campoBusca.value = "";
    campoBusca.focus();
  }
});

// Carregar favoritos ao abrir a página (ETAPA 02)
document.addEventListener("DOMContentLoaded", () => {
  carregarFavoritos();
});
