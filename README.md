# M2A — Meeting to Architecture

> Transforme transcrições de reuniões em diagramas de arquitetura UML e C4 automaticamente com IA.

## Sobre o projeto

O M2A (Meeting to Architecture) é uma plataforma desenvolvida para simplificar a criação de documentação técnica. Ele utiliza Inteligência Artificial para analisar transcrições de reuniões ou documentos de requisitos e gerar automaticamente diagramas de arquitetura nos formatos Mermaid (UML e C4), permitindo que times de desenvolvimento documentem sistemas com agilidade e precisão.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React, Vite, TypeScript, TanStack Router, Primer React, TailwindCSS, Mermaid.js, Styled Components |
| Backend | NestJS, TypeScript, @google/adk (Agents SDK), JWT, Multer |
| Banco de dados | Supabase (PostgreSQL) |
| IA | Google Gemini (via Gemini SDK e ADK) |

## Estrutura do monorepo

```text
.
├── apps
│   ├── api (m2a-api)      # Backend NestJS
│   │   └── src
│   │       └── modules    # Módulos da API (Auth, Users, Teams, Diagrams, Agents)
│   └── web                # Frontend React + Vite
│       └── src
│           ├── features   # Funcionalidades principais (Auth, Teams, Diagrams)
│           └── shared     # Componentes e hooks compartilhados
├── package.json           # Configurações do monorepo
└── README.md              # Este arquivo
```

## Como rodar com Docker

Cada camada sobe de forma independente via **profiles** do Docker Compose. O banco executa migrations e seed automaticamente na primeira subida (se já existirem tabelas/dados, nada é recriado).

### Pré-requisitos

- Docker e Docker Compose v2+

### 1. Configurar variáveis de ambiente

Copie o exemplo e ajuste as chaves:

```bash
cp apps/api/.env.example apps/api/.env
```

No `.env` da API, mantenha `DATABASE_URL` apontando para o container do Postgres:

```env
DATABASE_URL="postgresql://postgres:password@postgres:5432/diagrams_db?schema=public"
```

Para o frontend em Docker, defina a URL da API (opcional — padrão `http://localhost:3000`):

```bash
export VITE_API_URL=http://localhost:3000
```

### 2. Subir o banco de dados

Cria o Postgres, aplica as migrations (tabelas) e insere os dados do `seed.sql` **somente se o banco estiver vazio**.

```bash
docker compose --profile db up -d --build
```

| Serviço   | URL / Porta                          |
|-----------|--------------------------------------|
| Postgres  | `localhost:5433` (user: `postgres`, senha: `password`, db: `diagrams_db`) |
| pgAdmin   | http://localhost:8080 (email: `admin@admin.com`, senha: `password`) |

Acompanhe o init:

```bash
docker compose logs db-init
```

### 3. Subir a API

Com o banco já em execução:

```bash
docker compose --profile api up -d --build
```

API disponível em http://localhost:3000

### 4. Subir o frontend

```bash
docker compose --profile web up -d --build
```

Frontend disponível em http://localhost

### Subir tudo de uma vez

```bash
docker compose --profile db --profile api --profile web up -d --build
```

### Parar serviços

```bash
# Parar apenas o banco
docker compose --profile db down

# Parar apenas a API
docker compose --profile api down

# Parar apenas o frontend
docker compose --profile web down

# Parar tudo (mantém volume de dados)
docker compose --profile db --profile api --profile web down

# Parar tudo e apagar dados do banco
docker compose --profile db --profile api --profile web down -v
```

### Credenciais de teste (seed)

Usuários do seed usam a senha **`psg@2026`**. Exemplo:

- Email: `marquinhos@gmail.com`
- Senha: `psg@2026`

---

## Como rodar localmente (sem Docker)

### Pré-requisitos

- Node.js (v20+)
- Bun (recomendado) ou npm
- Postgres local ou container do passo 2 acima

### Instalação

1. Instale as dependências na raiz:

   ```bash
   bun install
   ```

2. Configure as variáveis de ambiente (veja abaixo).

3. Aplique migrations e seed (se necessário):

   ```bash
   cd apps/api
   npx prisma migrate deploy
   psql "postgresql://postgres:password@localhost:5433/diagrams_db" -f prisma/seed.sql
   ```

4. Inicie os projetos:

   - Backend: `cd apps/api && bun run start:dev`
   - Frontend: `cd apps/web && bun run dev`

### Variáveis de ambiente

**`apps/api/.env`**

- `SUPABASE_URL`: URL do seu projeto Supabase.
- `SUPABASE_SERVICE_KEY`: Service Role Key do Supabase.
- `GEMINI_API_KEY`: Chave de API do Google Gemini.
- `GEMINI_MODEL`: Modelo do Gemini (ex: `gemini-2.5-flash`).
- `JWT_SECRET`: Segredo para assinatura de tokens JWT.
- `DATABASE_URL`: URL de conexão PostgreSQL (local: porta `5433`; Docker: host `postgres`).

**`apps/web/.env`** (opcional em dev)

- `VITE_API_URL`: URL base da API (ex: `http://localhost:3000`).

## Módulos da API

### Auth
- `POST /auth/login`: Realiza o login do usuário.

### Users
- `POST /user`: Registra um novo usuário.
- `GET /user/me`: Retorna os dados do usuário autenticado.
- `GET /user/:id`: Busca um usuário por ID.
- `GET /user/get-by-email/:email`: Busca um usuário por e-mail.
- `PATCH /user/:id`: Atualiza dados do usuário.
- `PATCH /user/:id/password`: Altera a senha do usuário.
- `DELETE /user/:id`: Desativa um usuário.

### Teams
- `GET /teams`: Lista os times do usuário.
- `POST /teams`: Cria um novo time.
- `GET /teams/:id`: Detalhes de um time.
- `PATCH /teams/:id`: Atualiza dados do time.
- `DELETE /teams/:id`: Remove um time.
- `GET /teams/invites/me`: Lista convites pendentes para o usuário.
- `POST /teams/:id/invite`: Convida um membro para o time.
- `PATCH /teams/invites/:inviteId/respond`: Aceita ou recusa um convite.

### Diagrams
- `GET /diagrams`: Lista diagramas criados pelo usuário.
- `GET /diagrams/trash`: Lista diagramas na lixeira.
- `PATCH /diagrams/:id`: Atualiza um diagrama.
- `PATCH /diagrams/:id/restore`: Restaura um diagrama da lixeira.
- `DELETE /diagrams/:id`: Move um diagrama para a lixeira.
- `DELETE /diagrams/:id/permanent`: Exclui permanentemente um diagrama.
- `GET /diagrams/team/:teamId`: Lista diagramas de um time.
- `POST /diagrams/:id/add-to-team`: Associa ou solicita adição de diagrama a um time.
- `GET /diagrams/team/:teamId/requests`: Lista solicitações de aprovação de diagramas.
- `PATCH /diagrams/requests/:requestId/respond`: Responde a uma solicitação de aprovação.

### Agents
- `POST /agents/generate`: Processa um arquivo (PDF/MD) e gera um diagrama via IA.

## Arquitetura de agentes

O M2A utiliza uma arquitetura de multi-agentes baseada no `@google/adk`:

- **Software Architect (Orchestrator)**: O agente principal que coordena o fluxo de trabalho.
- **Transcript Analyzer**: Especialista em extrair contexto técnico e lógico de documentos brutos.
- **UML Architect**: Especialista em gerar código Mermaid para diagramas UML (Classe, Sequência, Estado, etc.).
- **C4 Architect**: Especialista em gerar código Mermaid para o modelo C4 (Contexto, Containers, Componentes).

## Licença

MIT
