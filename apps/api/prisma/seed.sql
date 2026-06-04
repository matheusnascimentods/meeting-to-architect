-- =============================================================
-- M2A — Seed Script
-- PSG UCL Final 2025-26 Starting XI
-- password: psg@2026 (bcrypt hash)
-- =============================================================

BEGIN;

-- =============================================================
-- 1. USERS (PSG Starting XI — UCL Final 2025-26)
-- password hash: psg@2026
-- =============================================================

INSERT INTO "Users" (id, name, email, password_hash, is_active, created_at, updated_at) VALUES
('a1000000-0000-0000-0000-000000000001', 'Gianluigi Donnarumma', 'donnarumma@gmail.com',    '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '90 days', NOW()),
('a1000000-0000-0000-0000-000000000002', 'Achraf Hakimi',        'hakimi@gmail.com',         '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '85 days', NOW()),
('a1000000-0000-0000-0000-000000000003', 'Marquinhos',           'marquinhos@gmail.com',     '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '80 days', NOW()),
('a1000000-0000-0000-0000-000000000004', 'Willian Pacho',        'pacho@gmail.com',          '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '75 days', NOW()),
('a1000000-0000-0000-0000-000000000005', 'Nuno Mendes',          'nuno.mendes@gmail.com',    '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '70 days', NOW()),
('a1000000-0000-0000-0000-000000000006', 'Vitinha',              'vitinha@gmail.com',        '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '65 days', NOW()),
('a1000000-0000-0000-0000-000000000007', 'João Neves',           'joao.neves@gmail.com',     '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '60 days', NOW()),
('a1000000-0000-0000-0000-000000000008', 'Fabian Ruiz',          'fabian.ruiz@gmail.com',    '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '55 days', NOW()),
('a1000000-0000-0000-0000-000000000009', 'Ousmane Dembélé',      'dembele@gmail.com',        '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '50 days', NOW()),
('a1000000-0000-0000-0000-000000000010', 'Bradley Barcola',      'barcola@gmail.com',        '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '45 days', NOW()),
('a1000000-0000-0000-0000-000000000011', 'Gonçalo Ramos',        'goncalo.ramos@gmail.com',  '$2b$10$1IUWHpsLeVIxgC1qS18a2uYpN6yR9gUn8sGOzNOd6JVFtcjoeFdJa', true, NOW() - INTERVAL '40 days', NOW());

-- =============================================================
-- 2. TEAMS
-- =============================================================

INSERT INTO "Teams" (id, name, created_at, updated_at) VALUES
('b1000000-0000-0000-0000-000000000001', 'Core Platform',      NOW() - INTERVAL '80 days', NOW()),
('b1000000-0000-0000-0000-000000000002', 'Mobile Experience',  NOW() - INTERVAL '70 days', NOW()),
('b1000000-0000-0000-0000-000000000003', 'Cloud Infrastructure', NOW() - INTERVAL '60 days', NOW());

-- =============================================================
-- 3. TEAM MEMBERS
-- =============================================================

-- Core Platform: Marquinhos (ADMIN), Vitinha (ADMIN), Hakimi, João Neves, Fabian, Dembélé
INSERT INTO "Team_Members" (id, team_id, user_id, role, joined_at) VALUES
('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'ADMIN',  NOW() - INTERVAL '79 days'),
('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000006', 'ADMIN',  NOW() - INTERVAL '79 days'),
('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'MEMBER', NOW() - INTERVAL '75 days'),
('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'MEMBER', NOW() - INTERVAL '70 days'),
('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'MEMBER', NOW() - INTERVAL '65 days'),
('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000009', 'MEMBER', NOW() - INTERVAL '60 days'),

-- Mobile Experience: Donnarumma (ADMIN), Barcola (MAINTAINER), Nuno Mendes, Pacho, Ramos
('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'ADMIN',      NOW() - INTERVAL '69 days'),
('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000010', 'MAINTAINER', NOW() - INTERVAL '68 days'),
('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000005', 'MEMBER',     NOW() - INTERVAL '65 days'),
('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 'MEMBER',     NOW() - INTERVAL '60 days'),
('c1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000011', 'MEMBER',     NOW() - INTERVAL '55 days'),

-- Cloud Infrastructure: Vitinha (ADMIN), Fabian (MAINTAINER), Hakimi, Dembélé, Barcola, Ramos
('c1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000006', 'ADMIN',      NOW() - INTERVAL '59 days'),
('c1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000008', 'MAINTAINER', NOW() - INTERVAL '58 days'),
('c1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'MEMBER',     NOW() - INTERVAL '55 days'),
('c1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000009', 'MEMBER',     NOW() - INTERVAL '50 days'),
('c1000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000010', 'MEMBER',     NOW() - INTERVAL '45 days'),
('c1000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000011', 'MEMBER',     NOW() - INTERVAL '40 days');

-- =============================================================
-- 4. TEAM INVITES
-- =============================================================

INSERT INTO "Team_Invites" (id, team_id, invited_by, invited_user_id, status, created_at) VALUES
-- Pending invites
('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'PENDING',  NOW() - INTERVAL '10 days'),
('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005', 'PENDING',  NOW() - INTERVAL '8 days'),
('d1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'PENDING',  NOW() - INTERVAL '6 days'),
('d1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'PENDING',  NOW() - INTERVAL '4 days'),
('d1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000004', 'PENDING',  NOW() - INTERVAL '2 days'),
-- Accepted invites
('d1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000009', 'ACCEPTED', NOW() - INTERVAL '60 days'),
('d1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000010', 'ACCEPTED', NOW() - INTERVAL '67 days'),
-- Rejected invite
('d1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000007', 'REJECTED', NOW() - INTERVAL '30 days');

-- =============================================================
-- 5. DIAGRAMS — 17 types (13 UML + 4 C4), distributed across users and teams
-- =============================================================

INSERT INTO "Diagrams" (id, title, description, type, mermaid_code, created_by, team_id, is_deleted, created_at, updated_at) VALUES

-- CLASS — Hakimi
('e1000000-0000-0000-0000-000000000001',
 'Arquitetura de pagamentos de alta disponibilidade',
 'Esta arquitetura aplica os princípios de Ports and Adapters para garantir um sistema de pagamentos desacoplado e resiliente, utilizando o **PaymentService** como orquestrador central que interage apenas com abstrações. Ao delegar a implementação de gateways e repositórios a interfaces e ao padrão Factory, o design assegura a escalabilidade necessária para integrar múltiplos provedores de pagamento e tecnologias de persistência sem comprometer a integridade das regras de negócio.',
 'CLASS',
 'classDiagram
    class PaymentController {
        +createPayment(dto: CreatePaymentDto)
        +getPaymentStatus(id: UUID)
        +refundPayment(id: UUID)
    }
    class PaymentService {
        -paymentRepository: IPaymentRepository
        -gatewayService: IPaymentGateway
        +process(data: PaymentRequest)
        +updateStatus(id: UUID, status: Status)
    }
    class IPaymentRepository {
        <<interface>>
        +save(payment: Payment)
        +findById(id: UUID)
    }
    class IPaymentGateway {
        <<interface>>
        +authorize(amount: Money)
        +capture(transactionId: string)
    }
    class Payment {
        +id: UUID
        +amount: number
        +currency: string
        +status: PaymentStatus
        +createdAt: Date
    }
    class PaymentGatewayFactory {
        +create(provider: string) IPaymentGateway
    }
    PaymentController --> PaymentService
    PaymentService --> IPaymentRepository
    PaymentService --> IPaymentGateway
    PaymentService ..> Payment
    PaymentGatewayFactory ..> IPaymentGateway : creates',
 'a1000000-0000-0000-0000-000000000002',
 'b1000000-0000-0000-0000-000000000001',
 false, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),

-- CLASS — Marquinhos
('e1000000-0000-0000-0000-000000000002',
 'Arquitetura de Notificação via E-mail',
 'Esta arquitetura segue o padrão de Ports and Adapters para criar um sistema de disparo de e-mails agnóstico, onde o EmailService coordena a lógica de envio utilizando interfaces para abstrair provedores (como SendGrid, AWS SES ou Mailgun) e mecanismos de log. A utilização de uma EmailProviderFactory permite alternar ou combinar serviços de e-mail dinamicamente, enquanto o uso de repositórios garante que o histórico de disparos e status sejam persistidos de forma desacoplada, assegurando alta rastreabilidade e facilidade na manutenção da infraestrutura de comunicação.',
 'CLASS',
 'classDiagram
    class EmailController {
        +sendEmail(dto: SendEmailDto)
    }
    class EmailService {
        -emailProvider: IEmailProvider
        -emailRepository: IEmailLogRepository
        +send(templateId: string, recipient: string, data: any)
    }
    class IEmailProvider {
        <<interface>>
        +send(options: EmailOptions)
    }
    class IEmailLogRepository {
        <<interface>>
        +logStatus(emailId: UUID, status: string)
    }
    class EmailLog {
        +id: UUID
        +recipient: string
        +status: string
        +sentAt: Date
    }
    class EmailProviderFactory {
        +create(provider: string) IEmailProvider
    }
    EmailController --> EmailService
    EmailService --> IEmailProvider
    EmailService --> IEmailLogRepository
    EmailProviderFactory ..> IEmailProvider : creates',
 'a1000000-0000-0000-0000-000000000003',
 'b1000000-0000-0000-0000-000000000001',
 false, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days'),

-- CLASS — Vitinha
('e1000000-0000-0000-0000-000000000003',
 'Arquitetura de Resolução de Questões com Google AI SDK',
 'Visão macro da plataforma M2A mostrando todos os atores externos, sistemas de terceiros integrados e os limites do sistema principal.',
 'CLASS',
 'classDiagram
    class QuizController {
        +solveQuiz(dto: QuizRequestDto)
    }

    class QuizService {
        -aiProvider: IAIModelProvider
        -quizRepository: IQuizRepository
        +solve(questionData: QuizData)
    }

    class IAIModelProvider {
        <<interface>>
        +generateContent(prompt: string) Promise~string~
    }

    class IQuizRepository {
        <<interface>>
        +save(solution: QuizSolution)
    }

    class QuizSolution {
        +id: UUID
        +question: string
        +answer: string
        +timestamp: Date
    }

    class AIProviderFactory {
        +create(modelType: string) IAIModelProvider
    }

    QuizController --> QuizService
    QuizService --> IAIModelProvider
    QuizService --> IQuizRepository
    AIProviderFactory ..> IAIModelProvider : creates',
 'a1000000-0000-0000-0000-000000000006',
 'b1000000-0000-0000-0000-000000000001',
 false, NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),

-- C4_CONTAINER — João Neves
('e1000000-0000-0000-0000-000000000004',
 'M2A Container Architecture',
 'Detalhamento dos containers internos da plataforma M2A: frontend React, backend NestJS, banco PostgreSQL e a camada de agentes ADK.',
 'C4_CONTAINER',
 'C4Container
    title Container Diagram — M2A Platform
    Person(user, "Engineer", "Uses the platform via browser")
    System_Boundary(m2a, "M2A Platform") {
        Container(web, "Web Application", "React + Primer", "SPA served via Nginx. Handles auth flow, diagram listing and Mermaid rendering.")
        Container(api, "API Server", "NestJS + TypeScript", "REST API. Handles business logic, JWT auth and ADK orchestration.")
        Container(agents, "ADK Agents", "Google ADK + Gemini", "Two-agent pipeline: transcript analyzer and diagram generator.")
        ContainerDb(db, "Database", "PostgreSQL", "Stores users, teams, diagrams and approval requests.")
    }
    System_Ext(gemini, "Gemini API", "External LLM")
    Rel(user, web, "Accesses", "HTTPS")
    Rel(web, api, "API calls", "REST / JSON")
    Rel(api, agents, "Triggers generation")
    Rel(agents, gemini, "Sends prompts", "HTTPS")
    Rel(api, db, "Reads and writes", "Prisma ORM")',
 'a1000000-0000-0000-0000-000000000007',
 'b1000000-0000-0000-0000-000000000001',
 false, NOW() - INTERVAL '48 days', NOW() - INTERVAL '48 days'),

-- ACTIVITY — Fabian Ruiz
('e1000000-0000-0000-0000-000000000005',
 'CI/CD Pipeline — Core Platform',
 'Fluxo completo do pipeline de integração e entrega contínua do Core Platform, desde o push até o deploy em produção com rollback automático.',
 'ACTIVITY',
 'graph TD
    A[Developer Push] --> B{Branch?}
    B -- feature --> C[Run Unit Tests]
    B -- main --> D[Run Full Test Suite]
    C --> E{Tests Pass?}
    D --> E
    E -- No --> F[Notify Developer]
    E -- Yes --> G[Build Docker Image]
    G --> H[Push to Registry]
    H --> I[Deploy to Staging]
    I --> J[Run Smoke Tests]
    J --> K{Smoke OK?}
    K -- No --> L[Rollback Staging]
    K -- Yes --> M{Is Main Branch?}
    M -- No --> N[Done]
    M -- Yes --> O[Deploy to Production]
    O --> P[Health Check]
    P --> Q{Healthy?}
    Q -- No --> R[Auto Rollback Production]
    Q -- Yes --> S[Release Complete]',
 'a1000000-0000-0000-0000-000000000008',
 'b1000000-0000-0000-0000-000000000003',
 false, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),

-- STATE — Donnarumma
('e1000000-0000-0000-0000-000000000006',
 'Diagram Lifecycle State Machine',
 'Máquina de estados descrevendo o ciclo de vida completo de um diagrama na plataforma M2A, incluindo geração, aprovação por time e exclusão com recuperação.',
 'STATE',
 'stateDiagram-v2
    [*] --> Generating : User uploads transcript
    Generating --> Generated : AI completes processing
    Generating --> Failed : AI returns error
    Failed --> [*]
    Generated --> Active : Saved to database
    Active --> PendingApproval : Member requests team add
    PendingApproval --> TeamDiagram : Admin approves
    PendingApproval --> Active : Admin rejects
    TeamDiagram --> Active : Removed from team
    Active --> Deleted : Soft delete
    Deleted --> Active : Restored from trash
    Deleted --> [*] : Permanent delete',
 'a1000000-0000-0000-0000-000000000001',
 'b1000000-0000-0000-0000-000000000002',
 false, NOW() - INTERVAL '42 days', NOW() - INTERVAL '42 days'),

-- CLASS — Barcola
('e1000000-0000-0000-0000-000000000007',
 'M2A Database Domain Model',
 'Modelo de domínio completo do banco de dados da plataforma M2A, mapeando todas as entidades e suas relações de associação.',
 'CLASS',
 'classDiagram
    class Users {
        +uuid id
        +string name
        +string email
        +string password_hash
        +bool is_active
        +timestamptz created_at
    }
    class Teams {
        +uuid id
        +string name
        +timestamptz created_at
    }
    class Team_Members {
        +uuid id
        +uuid team_id
        +uuid user_id
        +role role
        +timestamptz joined_at
    }
    class Diagrams {
        +uuid id
        +string title
        +string description
        +DiagramType type
        +text mermaid_code
        +uuid created_by
        +uuid team_id
        +bool is_deleted
    }
    class Diagram_Approval_Requests {
        +uuid id
        +uuid diagram_id
        +uuid team_id
        +uuid requested_by
        +uuid reviewed_by
        +ApprovalStatus status
    }
    class Team_Invites {
        +uuid id
        +uuid team_id
        +uuid invited_by
        +uuid invited_user_id
        +InviteStatus status
    }
    Users "1" -- "0..*" Team_Members : belongs to
    Teams "1" -- "0..*" Team_Members : has
    Users "1" -- "0..*" Diagrams : creates
    Teams "1" -- "0..*" Diagrams : owns
    Diagrams "1" -- "0..*" Diagram_Approval_Requests : subject of
    Teams "1" -- "0..*" Team_Invites : sends',
 'a1000000-0000-0000-0000-000000000010',
 'b1000000-0000-0000-0000-000000000002',
 false, NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days'),

-- USE_CASE — Nuno Mendes
('e1000000-0000-0000-0000-000000000008',
 'M2A Core Platform Use Cases',
 'Diagrama de casos de uso detalhando as principais interações dos engenheiros e arquitetos com as funcionalidades centrais da plataforma M2A.',
 'USE_CASE',
 'flowchart LR
    subgraph Actors
        Engineer((Software Engineer))
        Architect((Solution Architect))
    end
    subgraph M2A_Platform
        UC1([Upload Transcript])
        UC2([Generate Diagram])
        UC3([Review Diagram])
        UC4([Manage Teams])
    end
    Engineer --> UC1
    Engineer --> UC2
    Engineer --> UC4
    Architect --> UC3
    Architect --> UC4',
 'a1000000-0000-0000-0000-000000000005',
 'b1000000-0000-0000-0000-000000000003',
 false, NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days'),

-- COMPONENT — Pacho
('e1000000-0000-0000-0000-000000000009',
 'M2A System Component Architecture',
 'Diagrama de componentes UML detalhando os principais módulos internos da plataforma M2A e suas dependências técnicas.',
 'COMPONENT',
 'flowchart TD
    subgraph Frontend
        WebUI[Web Application Component]
    end
    subgraph Backend
        API[API Server Component]
        Auth[Auth Module]
        Agent[Agent Orchestrator]
    end
    subgraph Persistence
        DB[(Database Component)]
    end
    WebUI -- HTTP --> API
    API --> Auth
    API --> Agent
    API --> DB',
 'a1000000-0000-0000-0000-000000000004',
 'b1000000-0000-0000-0000-000000000002',
 false, NOW() - INTERVAL '32 days', NOW() - INTERVAL '32 days'),

-- ACTIVITY — Gonçalo Ramos
('e1000000-0000-0000-0000-000000000010',
 'Engineer Onboarding Activity Flow',
 'Fluxo de atividades detalhando os passos que um novo engenheiro segue ao entrar na plataforma, do cadastro à primeira colaboração.',
 'ACTIVITY',
 'flowchart TD
    Start([Start Onboarding]) --> Register[Fill Registration Form]
    Register --> Confirm{Confirm Email?}
    Confirm -- No --> Register
    Confirm -- Yes --> CreateDiagram[Generate First Diagram]
    CreateDiagram --> Share{Share with Team?}
    Share -- Yes --> RequestApproval[Request Admin Approval]
    Share -- No --> End([End Onboarding])
    RequestApproval --> End',
 'a1000000-0000-0000-0000-000000000011',
 'b1000000-0000-0000-0000-000000000002',
 false, NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),

-- DEPLOYMENT — Dembélé
('e1000000-0000-0000-0000-000000000011',
 'M2A Staging Environment Infrastructure',
 'Diagrama de implantação UML detalhando a topologia do ambiente de homologação (staging), incluindo servidores e conexões de rede.',
 'DEPLOYMENT',
 'flowchart LR
    subgraph Public_Cloud
        subgraph Web_Server
            App[Web Application Asset]
        end
    end
    subgraph Private_Network
        subgraph API_Node
            Server[NestJS API Server]
        end
        subgraph DB_Node
            Database[(PostgreSQL Instance)]
        end
    end
    App -- HTTPS --> Server
    Server -- TCP/IP --> Database',
 'a1000000-0000-0000-0000-000000000009',
 'b1000000-0000-0000-0000-000000000003',
 false, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),

-- SEQUENCE — Hakimi (personal, no team)
('e1000000-0000-0000-0000-000000000012',
 'Invite Member Interaction Flow',
 'Diagrama de sequência detalhando a interação entre o remetente, o sistema e o destinatário durante o processo de convite para time.',
 'SEQUENCE',
 'sequenceDiagram
    participant S as Sender
    participant SYS as M2A System
    participant R as Recipient
    S->>SYS: Sends Invitation
    SYS->>SYS: Validates Member
    SYS->>R: Notify via Email
    R->>SYS: Accepts Invitation
    SYS->>SYS: Updates Team Role
    SYS-->>S: Invitation Accepted',
 'a1000000-0000-0000-0000-000000000002',
 NULL,
 false, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),

-- STATE — Marquinhos
('e1000000-0000-0000-0000-000000000013',
 'Team Invite Lifecycle State Machine',
 'Diagrama de estados descrevendo os possíveis status de um convite de time, desde a criação até a aceitação ou expiração.',
 'STATE',
 'stateDiagram-v2
    [*] --> PENDING : Admin sends invite
    PENDING --> ACCEPTED : User accepts
    PENDING --> REJECTED : User declines
    PENDING --> EXPIRED : 48 hours pass
    ACCEPTED --> [*]
    REJECTED --> [*]
    EXPIRED --> [*]',
 'a1000000-0000-0000-0000-000000000003',
 'b1000000-0000-0000-0000-000000000001',
 false, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),

-- COMPONENT — Vitinha
('e1000000-0000-0000-0000-000000000014',
 'M2A Security Components',
 'Diagrama de componentes focando na segurança do sistema, detalhando os módulos de criptografia, autorização e gerenciamento de segredos.',
 'COMPONENT',
 'flowchart TD
    subgraph Security_Module
        BCrypt[BCrypt Hashing Engine]
        JWT[JWT Manager]
        ACL[Access Control List]
    end
    subgraph Data_Source
        DB[(PostgreSQL)]
    end
    JWT -- sign --> BCrypt
    ACL -- verify --> JWT
    BCrypt -- stores --> DB',
 'a1000000-0000-0000-0000-000000000006',
 'b1000000-0000-0000-0000-000000000001',
 false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

-- USE_CASE — Donnarumma (personal)
('e1000000-0000-0000-0000-000000000015',
 'Team Management Use Cases',
 'Diagrama de casos de uso focado na gestão de times, incluindo convites, papéis de usuários e fluxos de aprovação de diagramas.',
 'USE_CASE',
 'flowchart LR
    subgraph Users
        Admin((Admin))
        Member((Member))
    end
    subgraph Team_Management
        UC1([Invite Member])
        UC2([Approve Diagram])
        UC3([Request Addition])
    end
    Admin --> UC1
    Admin --> UC2
    Member --> UC3',
 'a1000000-0000-0000-0000-000000000001',
 NULL,
 false, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

-- DEPLOYMENT — João Neves
('e1000000-0000-0000-0000-000000000016',
 'M2A Production Network Topology',
 'Diagrama de implantação UML mostrando a topologia de rede de produção, com foco no balanceamento de carga e isolamento de banco de dados.',
 'DEPLOYMENT',
 'flowchart TD
    subgraph Internet
        LB[Load Balancer]
    end
    subgraph VPC_Private
        subgraph Cluster_API
            Node1[API Instance 1]
            Node2[API Instance 2]
        end
        subgraph Cluster_DB
            DB_Master[(DB Master)]
            DB_Replica[(DB Replica)]
        end
    end
    LB -- Round Robin --> Node1
    LB -- Round Robin --> Node2
    Node1 -- write --> DB_Master
    Node2 -- read --> DB_Replica',
 'a1000000-0000-0000-0000-000000000007',
 'b1000000-0000-0000-0000-000000000003',
 false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- C4_COMPONENT — Fabian (personal)
('e1000000-0000-0000-0000-000000000017',
 'API Server Component Diagram',
 'Diagrama de componentes C4 detalhando a estrutura interna do servidor NestJS, mostrando os módulos, guards, repositories e suas dependências.',
 'C4_COMPONENT',
 'C4Component
    title Component Diagram — NestJS API Server
    Container_Boundary(api, "API Server") {
        Component(authMod, "Auth Module", "NestJS Module", "Handles login, registration and JWT issuance")
        Component(jwtGuard, "JWT Guard", "NestJS Guard", "Validates Bearer token on every protected route")
        Component(diagramMod, "Diagrams Module", "NestJS Module", "CRUD for diagrams with soft delete and approval flow")
        Component(teamMod, "Teams Module", "NestJS Module", "Team management, member roles and invites")
        Component(agentMod, "Agents Module", "NestJS + ADK", "Orchestrates transcript analyzer and diagram generator agents")
        Component(prismaService, "Prisma Service", "NestJS Service", "Global database client injected across all repositories")
    }
    ContainerDb(db, "PostgreSQL", "Database")
    System_Ext(gemini, "Gemini API")
    Rel(jwtGuard, authMod, "Validates token")
    Rel(diagramMod, prismaService, "Queries via repository")
    Rel(teamMod, prismaService, "Queries via repository")
    Rel(agentMod, gemini, "Sends prompts", "HTTPS")
    Rel(prismaService, db, "Reads and writes")',
 'a1000000-0000-0000-0000-000000000008',
 NULL,
 false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- C4_CODE — Barcola
('e1000000-0000-0000-0000-000000000018',
 'Diagrams Module Code Structure',
 'Diagrama C4 Code detalhando as classes internas do módulo de diagramas: service, repository, controller e suas dependências.',
 'C4_CODE',
 'C4Component
    title Code Diagram — Diagrams Module
    Container_Boundary(api, "API Server") {
        Component(diagramCtrl, "DiagramsController", "NestJS Controller", "HTTP endpoints for CRUD and team operations")
        Component(diagramSvc, "DiagramsService", "NestJS Service", "Business logic for diagram lifecycle")
        Component(diagramRepo, "DiagramsRepository", "NestJS Repository", "Prisma queries for Diagrams table")
        Component(prisma, "PrismaService", "NestJS Service", "Database client")
    }
    Rel(diagramCtrl, diagramSvc, "Calls")
    Rel(diagramSvc, diagramRepo, "Uses")
    Rel(diagramRepo, prisma, "Queries")',
 'a1000000-0000-0000-0000-000000000010',
 'b1000000-0000-0000-0000-000000000002',
 false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- PACKAGE — Nuno Mendes
('e1000000-0000-0000-0000-000000000019',
 'M2A Backend Package Structure',
 'Diagrama de pacotes UML organizando os módulos NestJS da API M2A e suas dependências entre camadas.',
 'PACKAGE',
 'flowchart TD
    subgraph modules["modules"]
        auth[auth]
        users[users]
        teams[teams]
        diagrams[diagrams]
        agents[agents]
    end
    subgraph shared["shared"]
        prisma[prisma]
        guards[guards]
    end
    agents --> diagrams
    diagrams --> prisma
    teams --> prisma
    users --> prisma
    auth --> users
    auth --> guards',
 'a1000000-0000-0000-0000-000000000005',
 'b1000000-0000-0000-0000-000000000003',
 false, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),

-- OBJECT — Pacho
('e1000000-0000-0000-0000-000000000021',
 'Order Processing Object Snapshot',
 'Diagrama de objetos UML mostrando instâncias concretas de Order, Payment e Customer em runtime.',
 'OBJECT',
 'flowchart LR
    cust1["customer: Customer\nname=Marquinhos"]
    ord1["order: Order\nid=ORD-001\nstatus=PAID"]
    pay1["payment: Payment\namount=150.00\nmethod=PIX"]
    cust1 --> ord1
    ord1 --> pay1',
 'a1000000-0000-0000-0000-000000000004',
 'b1000000-0000-0000-0000-000000000002',
 false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

-- COMPOSITE_STRUCTURE — Dembélé
('e1000000-0000-0000-0000-000000000022',
 'Auth Module Composite Structure',
 'Diagrama de estrutura composta UML do módulo de autenticação, mostrando partes internas e conectores.',
 'COMPOSITE_STRUCTURE',
 'flowchart TD
    subgraph AuthModule["AuthModule : Module"]
        subgraph GuardPart["JWTGuard : Guard"]
            validator[TokenValidator]
        end
        subgraph ServicePart["AuthService : Service"]
            login[LoginHandler]
            hash[PasswordHasher]
        end
        GuardPart --> ServicePart
    end',
 'a1000000-0000-0000-0000-000000000009',
 'b1000000-0000-0000-0000-000000000001',
 false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- COMMUNICATION — Hakimi
('e1000000-0000-0000-0000-000000000023',
 'Team Invite Communication Flow',
 'Diagrama de comunicação UML mostrando objetos e mensagens numeradas no fluxo de convite para time.',
 'COMMUNICATION',
 'flowchart LR
    Admin[":Admin"] -- "1: invite()" --> System[":M2ASystem"]
    System -- "2: notify()" --> Recipient[":User"]
    Recipient -- "3: accept()" --> System
    System -- "4: confirm()" --> Admin',
 'a1000000-0000-0000-0000-000000000002',
 'b1000000-0000-0000-0000-000000000001',
 false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- INTERACTION_OVERVIEW — Vitinha
('e1000000-0000-0000-0000-000000000024',
 'Diagram Generation Interaction Overview',
 'Visão geral de interação UML combinando fluxo de atividades com referências a diagramas de sequência.',
 'INTERACTION_OVERVIEW',
 'flowchart TD
    A[Upload Transcript] --> B[Select Diagram Type]
    B --> C{Type Valid?}
    C -- No --> D[Show Error]
    C -- Yes --> E[ref: Analyze Transcript]
    E --> F[ref: Generate Diagram]
    F --> G[Save to Database]
    G --> H[Render Preview]',
 'a1000000-0000-0000-0000-000000000006',
 'b1000000-0000-0000-0000-000000000003',
 false, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),

-- TIMING — Fabian
('e1000000-0000-0000-0000-000000000025',
 'JWT Token Lifecycle Timing',
 'Diagrama de tempo UML mostrando estados do token JWT ao longo do tempo e pontos de expiração.',
 'TIMING',
 'flowchart LR
    subgraph Token["access_token"]
        T0["t=0: issued"]
        T1["t=6d: warning"]
        T2["t=7d: expired"]
    end
    T0 --> T1 --> T2',
 'a1000000-0000-0000-0000-000000000008',
 NULL,
 false, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),

-- Soft-deleted diagram — Gonçalo Ramos
('e1000000-0000-0000-0000-000000000020',
 'Old Auth Flow — Deprecated',
 'Fluxo de autenticação antigo baseado em sessões, substituído pelo modelo JWT. Mantido na lixeira para referência histórica.',
 'SEQUENCE',
 'sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as Database
    C->>S: POST /login
    S->>DB: Validate credentials
    DB-->>S: User found
    S->>S: Create session
    S-->>C: Set-Cookie: session_id',
 'a1000000-0000-0000-0000-000000000011',
 NULL,
 true, NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days');

-- =============================================================
-- 6. APPROVAL REQUESTS
-- =============================================================

INSERT INTO "Diagram_Approval_Requests" (id, diagram_id, team_id, requested_by, reviewed_by, status, requested_at, reviewed_at) VALUES

-- PENDING requests
('f1000000-0000-0000-0000-000000000001',
 'e1000000-0000-0000-0000-000000000012',
 'b1000000-0000-0000-0000-000000000001',
 'a1000000-0000-0000-0000-000000000002',
 NULL,
 'PENDING',
 NOW() - INTERVAL '3 days',
 NULL),

('f1000000-0000-0000-0000-000000000002',
 'e1000000-0000-0000-0000-000000000015',
 'b1000000-0000-0000-0000-000000000002',
 'a1000000-0000-0000-0000-000000000001',
 NULL,
 'PENDING',
 NOW() - INTERVAL '2 days',
 NULL),

('f1000000-0000-0000-0000-000000000003',
 'e1000000-0000-0000-0000-000000000017',
 'b1000000-0000-0000-0000-000000000003',
 'a1000000-0000-0000-0000-000000000008',
 NULL,
 'PENDING',
 NOW() - INTERVAL '1 days',
 NULL),

-- ACCEPTED requests
('f1000000-0000-0000-0000-000000000004',
 'e1000000-0000-0000-0000-000000000001',
 'b1000000-0000-0000-0000-000000000001',
 'a1000000-0000-0000-0000-000000000002',
 'a1000000-0000-0000-0000-000000000003',
 'ACCEPTED',
 NOW() - INTERVAL '58 days',
 NOW() - INTERVAL '57 days'),

('f1000000-0000-0000-0000-000000000005',
 'e1000000-0000-0000-0000-000000000005',
 'b1000000-0000-0000-0000-000000000003',
 'a1000000-0000-0000-0000-000000000008',
 'a1000000-0000-0000-0000-000000000006',
 'ACCEPTED',
 NOW() - INTERVAL '43 days',
 NOW() - INTERVAL '42 days'),

('f1000000-0000-0000-0000-000000000006',
 'e1000000-0000-0000-0000-000000000008',
 'b1000000-0000-0000-0000-000000000003',
 'a1000000-0000-0000-0000-000000000005',
 'a1000000-0000-0000-0000-000000000006',
 'ACCEPTED',
 NOW() - INTERVAL '33 days',
 NOW() - INTERVAL '32 days'),

-- REJECTED request
('f1000000-0000-0000-0000-000000000007',
 'e1000000-0000-0000-0000-000000000020',
 'b1000000-0000-0000-0000-000000000001',
 'a1000000-0000-0000-0000-000000000011',
 'a1000000-0000-0000-0000-000000000003',
 'REJECTED',
 NOW() - INTERVAL '28 days',
 NOW() - INTERVAL '27 days');

COMMIT;