# Frontend Project Structure

This file contains the full directory and file structure of the frontend application (located in `apps/web`), excluding `node_modules` and `dist` directories.

```text
apps/web
├── src
│   ├── app
│   │   └── router
│   │       ├── routes
│   │       │   ├── index.tsx
│   │       │   └── __root.tsx
│   │       ├── index.tsx
│   │       └── routeTree.gen.ts
│   ├── features
│   │   ├── auth
│   │   │   ├── components
│   │   │   │   └── Auth
│   │   │   │       ├── EmailStep.tsx
│   │   │   │       ├── index.tsx
│   │   │   │       ├── LoginStep.tsx
│   │   │   │       └── SignupStep.tsx
│   │   │   ├── hooks
│   │   │   │   └── use-auth.tsx
│   │   │   ├── services
│   │   │   │   └── auth.service.ts
│   │   │   └── types
│   │   │       └── index.ts
│   │   ├── diagrams
│   │   │   ├── components
│   │   │   │   ├── DiagramCard
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── styles.css
│   │   │   │   ├── DiagramDetail
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── styles.css
│   │   │   │   ├── DiagramsScreen
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── EditDiagramDialog
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── MermaidPreview
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── styles.css
│   │   │   │   ├── NewDiagramDialog
│   │   │   │   │   ├── diagram-types.ts
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── styles.css
│   │   │   │   ├── PendingRequests
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── RequestsDrawer
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── TeamDetailScreen
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── InviteMember.tsx
│   │   │   │   │   └── RequestsDialog.tsx
│   │   │   │   └── TrashScreen
│   │   │   │       ├── index.tsx
│   │   │   │       └── TrashItem.tsx
│   │   │   ├── hooks
│   │   │   │   ├── useDiagrams.ts
│   │   │   │   ├── useTeamDetail.ts
│   │   │   │   └── useTrash.ts
│   │   │   ├── services
│   │   │   │   ├── approval.service.ts
│   │   │   │   ├── diagram.service.ts
│   │   │   │   ├── team-diagram.service.ts
│   │   │   │   └── trash.service.ts
│   │   │   ├── types
│   │   │   │   └── index.ts
│   │   │   └── utils
│   │   │       └── normalize-diagram.ts
│   │   ├── landing
│   │   │   └── components
│   │   │       └── Landing
│   │   │           ├── CtaSection.tsx
│   │   │           ├── DiagramTypesSection.tsx
│   │   │           ├── HeroSection.tsx
│   │   │           ├── HowItWorksSection.tsx
│   │   │           ├── index.tsx
│   │   │           ├── LandingFooter.tsx
│   │   │           ├── LandingNavbar.tsx
│   │   │           ├── ProblemSolutionSection.tsx
│   │   │           ├── SecuritySection.tsx
│   │   │           └── TrustBar.tsx
│   │   └── teams
│   │       ├── components
│   │       │   ├── NewTeamDialog
│   │       │   │   └── index.tsx
│   │       │   └── TeamsScreen
│   │       │       ├── EditTeamDialog.tsx
│   │       │       ├── index.tsx
│   │       │       ├── InvitationsDialog.tsx
│   │       │       ├── InviteItem.tsx
│   │       │       ├── MembersDialog.tsx
│   │       │       └── TeamItem.tsx
│   │       ├── hooks
│   │       │   └── useTeams.ts
│   │       ├── services
│   │       │   ├── invite.service.ts
│   │       │   ├── member.service.ts
│   │       │   └── team.service.ts
│   │       └── types
│   │           └── index.ts
│   ├── shared
│   │   ├── components
│   │   │   ├── AppLayout
│   │   │  │   └── index.tsx
│   │   │   ├── ComingSoon
│   │   │   │   └── index.tsx
│   │   │   ├── DeleteDiagramDialog
│   │   │   │   └── index.tsx
│   │   │   ├── DeleteTeamDialog
│   │   │   │   └── index.tsx
│   │   │   ├── EmptyState
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.css
│   │   │   ├── ErrorState
│   │   │   │   └── index.tsx
│   │   │   ├── LoadingState
│   │   │   │   └── index.tsx
│   │   │   ├── Navbar
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.css
│   │   │   ├── PanelBox
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.css
│   │   │   ├── PanelHeader
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.css
│   │   │   └── Sidebar
│   │   │       └── index.tsx
│   │   ├── constants
│   │   │   └── copy.ts
│   │   ├── hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.tsx
│   │   ├── lib
│   │   │   ├── api.ts
│   │   │   ├── date-utils.ts
│   │   │   ├── error-capture.ts
│   │   │   ├── error-page.ts
│   │   │   └── utils.ts
│   │   └── styles
│   │       ├── index.css
│   │       └── tokens.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── Dockerfile
├── .env
├── index.html
├── nginx.conf
├── package.json
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vite.config.ts
```
