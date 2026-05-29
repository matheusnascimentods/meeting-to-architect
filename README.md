# Meeting to Architect (M2A)

Bem-vindo ao repositório do **Meeting to Architect (M2A)**! 🚀

Este projeto é uma ferramenta inovadora que utiliza Inteligência Artificial (LLMs) para transformar descrições, ideias e transcrições de reuniões em **diagramas de arquitetura de software** prontos para uso. O M2A automatiza a criação de documentação visual (como fluxogramas e diagramas de arquitetura usando Mermaid.js), integrando-se com serviços modernos em nuvem.

## 🎯 Finalidade do Projeto

O principal objetivo do M2A é reduzir o tempo que engenheiros de software e arquitetos de soluções gastam desenhando diagramas. A partir de prompts textuais detalhados, o backend processa as informações através de um agente LLM (via Google ADK) e gera uma representação em código (Mermaid), que é então renderizada e apresentada visualmente na interface web. Todos os diagramas e sessões são persistidos de forma segura no Supabase.

### Principais Funcionalidades:
- 🤖 **Geração de diagramas com IA**: Conversão de texto livre em diagramas precisos.
- 🎨 **Visualização Interativa**: Renderização instantânea utilizando o ecossistema Mermaid na web.
- 🔐 **Autenticação**: Fluxo seguro de usuários gerenciado via Supabase.
- 💾 **Histórico e Persistência**: Salvamento de diagramas, permitindo o gerenciamento e recuperação de arquiteturas geradas anteriormente.

---

## 🏗 Estrutura do Repositório

Este repositório está organizado no formato de **Monorepo**, facilitando o compartilhamento de configurações, dependências e código (via workspaces do Bun/npm).

```text
/
├── apps/                 # Aplicações principais do sistema
│   ├── api/m2a-api/      # Backend da aplicação (NestJS)
│   └── web/              # Frontend da aplicação (React + Vite)
├── package.json          # Gerenciamento de dependências root (Workspaces)
├── bun.lock              # Lockfile do gerenciador de pacotes Bun
└── README.md             # Esta documentação
```

---

## 📁 Organização dos Arquivos e Tecnologias

### 1. Frontend (`apps/web/`)
A interface do usuário é construída visando performance, design moderno e usabilidade.

- **Tecnologias**: React, Vite, TypeScript, Tailwind CSS, Radix UI, TanStack Router, TanStack Query, Mermaid, Recharts.
- **Estrutura interna (`apps/web/src/`)**:
  - `components/`: Componentes visuais reutilizáveis da interface (ex: modais, botões, painéis).
  - `routes/`: Definições das páginas da aplicação utilizando o TanStack Router.
  - `services/`: Lógica de comunicação com a API backend (m2a-api).
  - `hooks/`: Hooks customizados do React para encapsulamento de lógicas complexas.
  - `lib/`: Utilitários e configurações gerais (ex: clientes HTTP, configurações de estilo).
  - `types/`: Definições de tipos do TypeScript compartilhados no frontend.

### 2. Backend (`apps/api/m2a-api/`)
A API é responsável por orquestrar a lógica de negócios, integração com LLMs e banco de dados.

- **Tecnologias**: NestJS, TypeScript, Supabase (Banco de dados e Auth), Google ADK, Zod.
- **Estrutura interna (`apps/api/m2a-api/src/`)**:
  - `modules/`: Funcionalidades do sistema divididas em módulos isolados (ex: `agents`, `auth`, `diagrams`).
    - Ex: O módulo `agents` contém os serviços que se comunicam com a IA para processar os prompts e extrair o código JSON/Mermaid de arquitetura.
  - `main.ts`: Ponto de entrada (entry point) da aplicação NestJS.
  - `app.module.ts`: Módulo raiz que importa e gerencia todas as dependências da API.

---

## 🚀 Como Executar Localmente

Certifique-se de ter o **Bun** e o **Node.js** instalados em sua máquina.

1. **Instale as dependências:**
   No diretório raiz, execute:
   ```bash
   bun install
   ```

2. **Configure as Variáveis de Ambiente:**
   Crie arquivos `.env` dentro de `apps/web/` e `apps/api/m2a-api/` (você pode se basear em `.env.example` se disponível) com as chaves do Supabase, porta da API e chaves da API de IA (Google ADK).

3. **Inicie o Backend (API):**
   ```bash
   bun run dev:api
   ```
   *O backend subirá em modo de desenvolvimento (watch).*

4. **Inicie o Frontend (Web):**
   Abra um novo terminal e execute:
   ```bash
   bun run dev:web
   ```
   *A interface estará acessível via `localhost` na porta informada pelo Vite.*

---

## 📄 Licença

Este projeto é desenvolvido para fins específicos descritos no contexto do repositório. Consulte o arquivo `LICENSE` (se aplicável) para mais detalhes sobre os direitos de uso e distribuição.
