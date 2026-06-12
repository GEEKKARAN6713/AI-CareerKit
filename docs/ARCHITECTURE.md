# Architecture

## System overview

```mermaid
flowchart TB
    subgraph Client["Browser"]
        UI["React 19 UI\n(Tailwind + shadcn/ui)"]
    end

    subgraph NextJS["Next.js 15 (App Router)"]
        MW["Middleware\n(Auth.js edge session check)"]
        RSC["Server Components\n(data fetching)"]
        SA["Server Actions\n(CRUD + Zod validation)"]
        API_AI["/api/ai/generate\n(Route Handler)"]
        API_PDF["/api/resumes/:id/pdf\n(Route Handler)"]
        AUTH["/api/auth/*\n(NextAuth handlers)"]
    end

    subgraph Data["Data layer"]
        PRISMA["Prisma ORM"]
        PG[("PostgreSQL")]
    end

    CLAUDE["Anthropic Claude API"]
    PDF["@react-pdf/renderer"]

    UI -->|HTTP| MW
    MW --> RSC
    UI -->|mutations| SA
    UI -->|fetch| API_AI
    UI -->|download| API_PDF
    UI --> AUTH
    RSC --> PRISMA
    SA --> PRISMA
    API_AI --> PRISMA
    API_AI -->|server-side only| CLAUDE
    API_PDF --> PRISMA
    API_PDF --> PDF
    AUTH --> PRISMA
    PRISMA --> PG
```

Key decisions:

- **Server Actions** handle all CRUD mutations with Zod validation and ownership checks (`userId` scoping on every query).
- **Route Handlers** are used where a non-RSC response is needed: AI generation (JSON) and PDF export (binary stream).
- **Auth.js (NextAuth v5)** uses JWT sessions. The middleware consumes an edge-safe config (no Prisma import); the Credentials provider with bcrypt lives only in the Node.js runtime.
- **The Anthropic API key never reaches the client.** All Claude calls happen in `/api/ai/generate`, and every call is logged as an `AiGeneration` row with token usage.
- **Public portfolio pages** (`/p/[slug]`) are server-rendered and unauthenticated, gated only by the `published` flag.

## Entity-relationship diagram

```mermaid
erDiagram
    User ||--o{ Resume : "has many"
    User ||--o| Portfolio : "has one"
    User ||--o{ AiGeneration : "has many"
    Resume ||--o{ WorkExperience : "has many"
    Resume ||--o{ Education : "has many"
    Resume ||--o{ Skill : "has many"
    Resume ||--o{ Project : "has many"
    Portfolio ||--o{ Project : "has many"

    User {
        string id PK
        string name
        string email UK
        string password
        string headline
    }
    Resume {
        string id PK
        string title
        string fullName
        string summary
        string userId FK
    }
    WorkExperience {
        string id PK
        string role
        string company
        string startDate
        string endDate
        boolean current
        string-array bullets
        string resumeId FK
    }
    Education {
        string id PK
        string school
        string degree
        string field
        string resumeId FK
    }
    Skill {
        string id PK
        string name
        string resumeId FK
    }
    Project {
        string id PK
        string name
        string description
        string url
        string-array tech
        string resumeId FK "nullable"
        string portfolioId FK "nullable"
    }
    Portfolio {
        string id PK
        string slug UK
        string displayName
        string theme
        boolean published
        string userId FK
    }
    AiGeneration {
        string id PK
        string type
        string input
        string output
        int inputTokens
        int outputTokens
        string userId FK
    }
```
