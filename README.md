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

## Como rodar localmente

### Pré-requisitos
- Node.js (v20+)
- Bun (recomendado) ou npm

### Instalação

1. Instale as dependências na raiz:
   ```bash
   bun install
   ```

2. Configure as variáveis de ambiente (veja abaixo).

3. Inicie os projetos:
   - Backend: `cd apps/api/m2a-api && bun run start:dev`
   - Frontend: `cd apps/web && bun run dev`

### Variáveis de ambiente

**`apps/api/m2a-api/.env`**
- `SUPABASE_URL`: URL do seu projeto Supabase.
- `SUPABASE_SERVICE_KEY`: Service Role Key do Supabase.
- `GEMINI_API_KEY`: Chave de API do Google Gemini.
- `GEMINI_MODEL`: Modelo do Gemini (ex: `gemini-1.5-flash`).
- `JWT_SECRET`: Segredo para assinatura de tokens JWT.

**`apps/web/.env`**
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
