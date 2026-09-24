# 🚀 DevShowcase API - Etapa Final (Produção)

Backend RESTful robusto da plataforma **DevShowcase**, desenvolvido com **Node.js**, **Express**, **TypeScript**, **Prisma ORM** e banco de dados relacional **PostgreSQL** provisionado em nuvem. A aplicação implementa arquitetura em camadas de serviço (**Service Layer**), regras de negócio avançadas, tratamento global de exceções, documentação interativa Swagger/OpenAPI e deploy contínuo em nuvem (**Render PaaS**).

---

## 📌 Requisitos Técnicos Entregues

1. **Endpoints REST com Regras de Negócio na Camada de Serviço:**
   - `PUT /api/projects/:id/upvote`: Incrementa atomicamente o número de curtidas/estrelas do projeto.
   - `POST /api/projects/:id/feedbacks`: Cadastra nota de 1 a 5 e comentário, recalculando dinamicamente a nota média (`averageRating`) do projeto no banco de dados.
   - `GET /api/projects`: Busca paginada de projetos com controle de páginas (`page`, `limit`) e filtragem flexível por tecnologia (`?technology=Node.js`).

2. **Tratamento Global de Exceções e Respostas Amigáveis:**
   - Middleware global de erros interceptando exceções da aplicação (`AppError`), validações do Zod (**400 Bad Request**), erros de integridade do Prisma (**409 Conflict** e **404 Not Found**) e rotas não mapeadas.

3. **Documentação Interativa Swagger / OpenAPI:**
   - Interface completa e interativa acessível via rota `/docs` e `/api-docs`, permitindo testes online em tempo real.

4. **Deploy em Produção (PaaS Render + PostgreSQL em Nuvem):**
   - Banco de dados relacional **PostgreSQL** configurado na nuvem (**Supabase / Render PostgreSQL**).
   - Deploy contínuo configurado a partir do GitHub em serviço PaaS (**Render**).
   - Gerenciamento seguro de credenciais via variáveis de ambiente de produção (`DATABASE_URL`, `NODE_ENV`).

---

## 🏛️ Diagrama de Relacionamentos (ERD)

```mermaid
erDiagram
    Profile ||--o{ Project : "1 : N (possui)"
    Project }o--o{ Technology : "N : N (utiliza)"
    Project ||--o{ Feedback : "1 : N (recebe)"

    Profile {
        string id PK "UUID"
        string name "Nome obrigatório"
        string email UK "E-mail único"
        string bio "Biografia opcional"
        string githubUrl "URL válida do GitHub"
        datetime createdAt
        datetime updatedAt
    }

    Project {
        string id PK "UUID"
        string title "Título obrigatório não vazio"
        string description "Descrição detalhada"
        string repositoryUrl "URL válida do repositório"
        string liveUrl "URL válida em produção"
        int upvotes "Curtidas/Estrelas (default 0)"
        float averageRating "Nota média recalculada (default 0)"
        string profileId FK "ID do Desenvolvedor"
        datetime createdAt
        datetime updatedAt
    }

    Technology {
        string id PK "UUID"
        string name UK "Nome único"
        string category "Categoria (ex: Backend, Frontend, Database)"
        datetime createdAt
        datetime updatedAt
    }

    Feedback {
        string id PK "UUID"
        string author "Nome do autor"
        string content "Conteúdo do feedback"
        int rating "Nota inteira de 1 a 5"
        string projectId FK "ID do Projeto avaliado"
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🏗️ Arquitetura em Camadas (Service Layer)

```text
Requisição HTTP (Client / Postman / Swagger)
                    │
                    ▼
          [ Middlewares Globais ]
      (Logger, CORS, JSON, Zod Validate)
                    │
                    ▼
            [ Controllers ]
     (Recebe DTOs e orquestra respostas)
                    │
                    ▼
          [ Camada de Serviço ] ⬅️ (Regras de negócio, cálculos de média, upvotes)
     (ProjectService, FeedbackService, etc.)
                    │
                    ▼
          [ Camada de Repositório ]
     (ProjectRepository, FeedbackRepository)
                    │
                    ▼
         [ Prisma ORM & PostgreSQL ]
```

---

## 📂 Estrutura de Diretórios

```text
├── prisma/
│   └── schema.prisma         # Modelagem relacional para PostgreSQL
├── postman/
│   └── DevShowcase_API.postman_collection.json # Coleção Postman atualizada com novos endpoints
├── src/
│   ├── controllers/          # Controladores HTTP
│   │   ├── profile.controller.ts
│   │   ├── technology.controller.ts
│   │   ├── project.controller.ts
│   │   └── feedback.controller.ts
│   ├── services/             # Camada de Serviço (Regras de Negócio)
│   │   ├── project.service.ts
│   │   ├── feedback.service.ts
│   │   ├── profile.service.ts
│   │   └── technology.service.ts
│   ├── errors/               # Classes de erro customizadas (AppError, NotFoundError, etc.)
│   │   └── app-error.ts
│   ├── docs/                 # Documentação Swagger UI
│   │   ├── schema-prisma.svg.ts
│   │   ├── swagger-ui.custom.ts
│   │   └── swagger.spec.ts
│   ├── dtos/                 # Schemas Zod de validação
│   │   ├── profile.dto.ts
│   │   ├── technology.dto.ts
│   │   ├── project.dto.ts
│   │   └── feedback.dto.ts
│   ├── lib/                  # Singleton do PrismaClient
│   │   └── prisma.ts
│   ├── middlewares/          # Logger, validador Zod e tratamento global de erros
│   │   ├── validate.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── error.middleware.ts
│   ├── repositories/         # Padrão Repository (Acesso a dados)
│   │   ├── profile.repository.ts
│   │   ├── technology.repository.ts
│   │   ├── project.repository.ts
│   │   └── feedback.repository.ts
│   ├── routes/               # Roteamento REST da aplicação
│   │   ├── database.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── technology.routes.ts
│   │   ├── project.routes.ts
│   │   ├── feedback.routes.ts
│   │   └── index.ts
│   ├── utils/                # Utilitários do banco
│   │   └── database.util.ts
│   ├── app.ts                # Inicialização do Express
│   └── server.ts             # Ponto de entrada do servidor HTTP
├── render.yaml               # Infraestrutura como código para deploy no Render
├── tsconfig.json             # Configurações TypeScript
├── package.json              # Dependências e scripts
└── README.md                 # Documentação principal
```

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **PostgreSQL** (ou banco na nuvem Supabase / Render PostgreSQL)

### 1. Clonar e Instalar Dependências
```bash
git clone https://github.com/User-TADS/DevShowcaseAPI-1.git
cd DevShowcaseAPI-1
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie ou edite o arquivo `.env` inserindo sua string de conexão com o PostgreSQL:
```env
PORT=3000
DATABASE_URL="postgresql://usuario:senha@host:5432/devshowcase?schema=public"
NODE_ENV=development
```

### 3. Aplicar o Esquema no Banco de Dados
```bash
npx prisma generate
npx prisma db push
```

### 4. Iniciar o Servidor
```bash
npm run dev
```

Acesse no navegador:
- **Swagger UI:** `http://localhost:3000/docs`
- **Status da API:** `http://localhost:3000/api`

---

## ☁️ Deploy em Produção (Render + Supabase)

Passo a passo resumido para deploy:
1. Criar o banco PostgreSQL no **Supabase** ou **Render PostgreSQL**.
2. Conectar o repositório GitHub ao **Render Web Service**.
3. Definir o Build Command: `npm install && npm run build && npx prisma db push`.
4. Definir o Start Command: `npm start`.
5. Inserir a variável `DATABASE_URL` no painel do Render.

---

## 📬 Coleção do Postman

1. Importe o arquivo `postman/DevShowcase_API.postman_collection.json` no **Postman**.
2. A pasta `2. Novos Endpoints da Etapa Final` cobre:
   - `PUT /api/projects/:id/upvote` (incremento de curtidas)
   - `POST /api/projects/:id/feedbacks` (cálculo de nota média)
   - `GET /api/projects` (filtro por tecnologia e paginação)
3. A pasta `3. Demonstração do Tratamento Global de Erros` simula:
   - Erro `400 Bad Request` com detalhamento amigável.
   - Erro `404 Not Found` para IDs e rotas inexistentes.
