# Arquivo Sombrio

## Autor
Arthur Bradley Barroca — Matrícula 22603901

## Descrição
Um catálogo de séries e filmes de terror, suspense e slasher: o usuário
digita o nome de um título (ou escolhe um dos "casos sugeridos") e a
aplicação monta um dossiê visual com pôster, gêneros, avaliação, ano de
estrela, status e sinopse de cada resultado encontrado.

## API utilizada
- Nome da API e link da documentação: [TVmaze API](https://www.tvmaze.com/api)
- Endpoint(s) consumido(s): `GET https://api.tvmaze.com/search/shows?q=:termo`

## Funcionalidades
- Buscar um filme/série pelo nome digitado em um campo de texto
- Clicar em um dos "casos sugeridos" (chips) para preencher a busca e consultar na hora
- Ver, para cada resultado: pôster, gêneros, ano de estreia, status, avaliação e sinopse
- Receber um selo de "Caso confirmado" quando o título já pertence a um gênero de terror/suspense/mistério
- Ver mensagens amigáveis quando a busca não encontra nada ou quando a API está fora do ar
- **Favoritos com persistência em banco real (Supabase)** — dados sobrevivem ao fechar o navegador

## Persistência de Dados (Etapa 02)
### Banco escolhido
**Supabase** (PostgreSQL) — plano gratuito, região South America para menor latência.

### Estrutura da tabela
```sql
CREATE TABLE favoritos (
  id BIGSERIAL PRIMARY KEY,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  nome_show TEXT NOT NULL,
  generos TEXT,
  imagem_url TEXT,
  avaliacao NUMERIC(3,1),
  status TEXT,
  regiaodeestreia TEXT
);
```

### O que é salvo
Quando o usuário clica em "Guardar no arquivo", os seguintes dados são persistidos no Supabase:
- Nome do show (`nome_show`)
- Gêneros (`generos`)
- URL da imagem (`imagem_url`)
- Avaliação (`avaliacao`)
- Status (`status`)
- Ano de estreia (`regiaodeestreia`)

### Políticas RLS
Nesta etapa, políticas abertas para anon são configuradas para permitir leitura e escrita. **Limitação conhecida:** qualquer pessoa com a chave anon poderia acessar os dados; em produção, deveria haver autenticação de usuário.

### Como usar
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto (região South America)
3. No Table Editor, crie a tabela `favoritos` com as colunas acima
4. Em Project Settings → API, copie a URL e a chave anon
5. Substitua `SUPABASE_URL` e `SUPABASE_KEY` no script.js

## Como executar localmente
1. Clone: `git clone https://github.com/Arthur-Bradley-Barroca/bootcamp2-app.git`
2. Abra o arquivo `index.html` no navegador

## Como executar com Docker
```bash
docker run -d -p 8080:80 arthurbb/bootcamp2-app:1.0
```
Acesse http://localhost:8080

## Docker Hub
- **Imagem:** `arthurbb/bootcamp2-app`
- **Tags disponíveis:** `1.0`, `1.1`, `latest`
- **Repositório:** https://hub.docker.com/r/arthurbb/bootcamp2-app

## Arquivos de conteinerização
### Dockerfile
```dockerfile
FROM nginx:alpine
COPY index.html style.css script.js /usr/share/nginx/html/
EXPOSE 80
```

### .dockerignore
```
.git
README.md
nul
```

## Sidequests completados

### SQ1 · .dockerignore
Arquivo `.dockerignore` criado excluindo `.git`, `README.md` e `nul`. Isso deixa a imagem menor e o build mais rápido.

### SQ2 · Versionamento de imagem
Três tags publicadas no Docker Hub:
- `1.0` — primeira versão funcional com persistência Supabase
- `1.1` — versão com melhorias de UI
- `latest` — aponta para a versão mais recente

### SQ3 · Descrição no Docker Hub
O repositório no Docker Hub contém descrição completa, comando docker run pronto para copiar e link do repositório GitHub.

### SQ4 · Orquestração
Dois containers foram executados simultaneamente em portas 8080 e 8081. Print do `docker ps` está commitado no repositório.

**Sobre Kubernetes:** Se houvesse 100 containers, usaria Kubernetes para gerenciá-los. O Kubernetes automatiza deploy, escalabilidade e gerenciamento de containers. Conceitos-chave:
- **Cluster:** conjunto de máquinas (nodes) que rodam workloads
- **Pod:** unidade mínima de deploy
- **Replica:** cópia de um pod; o Kubernetes mantém o número desejado rodando
- **Deployment:** gerencia pods e réplicas, permite rollback e atualizações
- Com 100 containers, usaria Deployments com réplicas, Services para expor, e Horizontal Pod Autoscaler para escalar com demanda.

## Links
- **Aplicação no ar (GitHub Pages):** https://arthur-bradley-barroca.github.io/bootcamp2-app/
- **Repositório:** https://github.com/Arthur-Bradley-Barroca/bootcamp2-app
- **Docker Hub:** https://hub.docker.com/r/arthurbb/bootcamp2-app
