export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'DevShowcase API - Documentação Interativa Swagger',
    version: '2.0.0',
    description: `
**API RESTful robusta desenvolvida com Node.js, Express, TypeScript, Prisma ORM e persistência relacional PostgreSQL.**

Sistema completo para gerenciamento de perfis de desenvolvedores, catálogo de projetos com upvotes, filtragem por tecnologia, paginação dos resultados e feedbacks com cálculo dinâmico da nota média.

### 🏛️ Arquitetura e Regras de Negócio:
- **Camada de Serviço (Service Layer)**: Regras de negócio encapsuladas em \`src/services/\` (validação de integridade, cálculo dinâmico de nota média, controle de upvotes e paginação).
- **Tratamento Global de Exceções**: Respostas amigáveis e padronizadas em erros **400 Bad Request** (Zod, validações numéricas e sintaxe JSON), **404 Not Found** (recursos ou rotas inexistentes), **409 Conflict** (registros duplicados) e **500 Internal Server Error**.
- **Persistência Relacional PostgreSQL**: Provisionado em nuvem (Supabase ou Render) e compatível com Deploy Contínuo.

### 🔗 Cardinalidades e Relacionamentos:
- **Perfis (Profiles)**: 1 : N com Projetos
- **Projetos (Projects)**: N : 1 com Perfis | N : N com Tecnologias | 1 : N com Feedbacks
- **Tecnologias (Technologies)**: N : N com Projetos
- **Feedbacks (Opiniões)**: N : 1 com Projetos

<div style="margin-top: 14px; margin-bottom: 14px;">
  <a href="/docs/schema-prisma.svg" target="_blank" title="Clique para abrir o diagrama em tamanho real">
    <img src="/docs/schema-prisma.svg" alt="Diagrama do Schema Prisma" style="width: 100%; max-width: 880px; border-radius: 10px; border: 1px solid #cbd5e1; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12); display: block; margin: 10px 0;" />
  </a>
  <small style="color: #64748b; font-size: 12px; display: block; margin-top: 4px;">🔍 <em>Dica: Clique na imagem para abrir em resolução máxima.</em></small>
</div>
    `,
    contact: {
      name: 'Guilherme Barbosa',
      url: 'https://github.com/GuilhermeBarbosa556',
    },
  },
  servers: [
    {
      url: '/',
      description: 'Servidor Atual (Produção / Local)',
    },
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local de Desenvolvimento',
    },
  ],
  tags: [
    {
      name: 'Projetos (Projects)',
      description: 'Gerenciamento de projetos, upvotes, feedbacks aninhados e busca paginada com filtros',
    },
    {
      name: 'Feedbacks (Opiniões)',
      description: 'Avaliações associadas a projetos com notas de 1 a 5 e comentários',
    },
    {
      name: 'Perfis (Profiles)',
      description: 'Gerenciamento de perfis de desenvolvedores',
    },
    {
      name: 'Tecnologias (Technologies)',
      description: 'Cadastro e listagem de tecnologias',
    },
    {
      name: '🔧 Manutenção do Banco (Zerar Tabelas)',
      description: 'Endpoint utilitário para limpar e zerar todas as tabelas do banco de dados',
    },
  ],
  paths: {
    '/api/projects': {
      get: {
        tags: ['Projetos (Projects)'],
        summary: 'Buscar projetos com filtro por tecnologia e paginação',
        description: 'Retorna a lista paginada de projetos, permitindo filtrar por nome ou ID de tecnologia (`technology`) e/ou por perfil de autor (`profileId`). Retorna metadados de paginação (total, páginas, hasNextPage, hasPrevPage).',
        parameters: [
          {
            name: 'technology',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Nome (ex: Node.js, React) ou ID da tecnologia utilizada no projeto',
          },
          {
            name: 'profileId',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'UUID do desenvolvedor para listar apenas seus projetos',
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 1, minimum: 1 },
            description: 'Número da página (padrão: 1)',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
            description: 'Quantidade de projetos por página (padrão: 10)',
          },
        ],
        responses: {
          200: {
            description: 'Lista de projetos paginada com sucesso',
            content: {
              'application/json': {
                example: {
                  status: 'success',
                  statusCode: 200,
                  count: 1,
                  pagination: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false,
                  },
                  data: [
                    {
                      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                      title: 'DevShowcase Platform',
                      description: 'Plataforma para compartilhamento e avaliação de portfólios',
                      repositoryUrl: 'https://github.com/usuario/devshowcase',
                      liveUrl: 'https://devshowcase.app',
                      upvotes: 5,
                      averageRating: 4.8,
                      profileId: '98765432-abcd-ef01-2345-67890abcdef0',
                      profile: {
                        id: '98765432-abcd-ef01-2345-67890abcdef0',
                        name: 'Guilherme Barbosa',
                        email: 'guilherme@example.com',
                      },
                      technologies: [
                        { id: 'tech-uuid-1', name: 'Node.js', category: 'Backend' },
                        { id: 'tech-uuid-2', name: 'TypeScript', category: 'Language' },
                      ],
                      feedbacks: [],
                      createdAt: '2026-09-24T18:00:00.000Z',
                      updatedAt: '2026-09-24T18:30:00.000Z',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Projetos (Projects)'],
        summary: 'Cadastrar novo projeto com relacionamentos',
        description: 'Cadastra um projeto vinculado ao perfil do desenvolvedor (1:N) e às tecnologias utilizadas (N:N). Inicia com 0 upvotes e nota média 0.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'profileId'],
                properties: {
                  title: { type: 'string', example: 'DevShowcase Platform' },
                  description: { type: 'string', example: 'Plataforma para compartilhamento e avaliação de portfólios' },
                  repositoryUrl: { type: 'string', example: 'https://github.com/usuario/projeto' },
                  liveUrl: { type: 'string', example: 'https://meuprojeto.com' },
                  profileId: { type: 'string', description: 'UUID de um perfil de desenvolvedor existente' },
                  technologyIds: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Lista de UUIDs das tecnologias a vincular',
                    example: ['b1c2d3e4-f5a6-7890-abcd-ef1234567890'],
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Projeto cadastrado com sucesso' },
          400: { description: 'Erro de validação (campos obrigatórios ou tecnologias inexistentes)' },
          404: { description: 'Perfil de desenvolvedor não encontrado' },
        },
      },
    },
    '/api/projects/{id}': {
      get: {
        tags: ['Projetos (Projects)'],
        summary: 'Buscar projeto por ID',
        description: 'Retorna os detalhes completos do projeto, incluindo perfil do autor, tecnologias associadas, curtidas (upvotes), nota média e lista de feedbacks recebidos.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'UUID do projeto',
          },
        ],
        responses: {
          200: { description: 'Projeto encontrado com relacionamentos' },
          404: { description: 'Projeto não encontrado' },
        },
      },
    },
    '/api/projects/{id}/upvote': {
      put: {
        tags: ['Projetos (Projects)'],
        summary: 'Curtir/Dar upvote no projeto',
        description: 'Incrementa atomicamente em +1 o número de curtidas/estrelas (`upvotes`) do projeto no banco de dados e retorna os dados atualizados.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'UUID do projeto a receber o upvote',
          },
        ],
        responses: {
          200: {
            description: 'Upvote registrado com sucesso',
            content: {
              'application/json': {
                example: {
                  status: 'success',
                  statusCode: 200,
                  message: 'Upvote registrado com sucesso! Curtidas incrementadas.',
                  data: {
                    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    title: 'DevShowcase Platform',
                    upvotes: 6,
                    averageRating: 4.8,
                  },
                },
              },
            },
          },
          404: {
            description: 'Projeto não encontrado',
            content: {
              'application/json': {
                example: {
                  status: 'error',
                  statusCode: 404,
                  message: "Projeto com ID 'uuid-inexistente' não foi encontrado para receber upvote.",
                },
              },
            },
          },
        },
      },
    },
    '/api/projects/{id}/feedbacks': {
      post: {
        tags: ['Projetos (Projects)', 'Feedbacks (Opiniões)'],
        summary: 'Cadastrar feedback e recalcular nota média do projeto',
        description: 'Cadastra uma avaliação com nota de 1 a 5 e comentário diretamente para o projeto informado na URL. Na camada de serviço, a nota média (`averageRating`) do projeto é automaticamente recalculada e atualizada no banco de dados.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'UUID do projeto a ser avaliado',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['author', 'content', 'rating'],
                properties: {
                  author: { type: 'string', example: 'Prof. Avaliador' },
                  content: { type: 'string', example: 'Excelente código, arquitetura em camadas e documentação exemplar!' },
                  rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Feedback cadastrado com sucesso e nota média recalculada',
            content: {
              'application/json': {
                example: {
                  status: 'success',
                  statusCode: 201,
                  message: 'Feedback cadastrado com sucesso e nota média recalculada!',
                  data: {
                    feedback: {
                      id: 'feedback-uuid-1',
                      author: 'Prof. Avaliador',
                      content: 'Excelente código, arquitetura em camadas e documentação exemplar!',
                      rating: 5,
                      projectId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                      createdAt: '2026-09-24T18:10:00.000Z',
                    },
                    projectAverageRating: 4.8,
                    totalFeedbacks: 5,
                  },
                },
              },
            },
          },
          400: {
            description: 'Erro de validação (ex: nota menor que 1 ou maior que 5, comentário ausente)',
            content: {
              'application/json': {
                example: {
                  status: 'error',
                  statusCode: 400,
                  message: 'Falha na validação dos dados de entrada.',
                  errors: [
                    {
                      field: 'rating',
                      message: 'A avaliação máxima é 5 estrelas',
                    },
                  ],
                },
              },
            },
          },
          404: {
            description: 'Projeto não encontrado',
            content: {
              'application/json': {
                example: {
                  status: 'error',
                  statusCode: 404,
                  message: "Projeto com ID 'uuid-inexistente' não foi encontrado para receber feedback.",
                },
              },
            },
          },
        },
      },
    },
    '/api/feedbacks': {
      post: {
        tags: ['Feedbacks (Opiniões)'],
        summary: 'Cadastrar feedback via body (projectId)',
        description: 'Endpoint alternativo para cadastro de feedback informando o `projectId` no corpo da requisição.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['author', 'content', 'rating', 'projectId'],
                properties: {
                  author: { type: 'string', example: 'Comunidade Dev' },
                  content: { type: 'string', example: 'Projeto muito útil e bem documentado!' },
                  rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                  projectId: { type: 'string', description: 'UUID do projeto avaliado' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Feedback registrado com sucesso' },
          400: { description: 'Nota inválida (fora do intervalo 1 a 5)' },
          404: { description: 'Projeto não encontrado' },
        },
      },
      get: {
        tags: ['Feedbacks (Opiniões)'],
        summary: 'Listar todos os feedbacks',
        responses: {
          200: { description: 'Lista de todos os feedbacks cadastrados' },
        },
      },
    },
    '/api/feedbacks/project/{projectId}': {
      get: {
        tags: ['Feedbacks (Opiniões)'],
        summary: 'Listar feedbacks de um projeto',
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'UUID do projeto',
          },
        ],
        responses: {
          200: { description: 'Lista de feedbacks do projeto' },
          404: { description: 'Projeto não encontrado' },
        },
      },
    },
    '/api/profiles': {
      post: {
        tags: ['Perfis (Profiles)'],
        summary: 'Cadastrar perfil de desenvolvedor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Guilherme Barbosa' },
                  email: { type: 'string', example: 'guilherme@example.com' },
                  bio: { type: 'string', example: 'Desenvolvedor Full Stack' },
                  githubUrl: { type: 'string', example: 'https://github.com/guilherme' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Perfil cadastrado com sucesso' },
          400: { description: 'Erro de validação (e-mail ou URL inválida)' },
          409: { description: 'E-mail já cadastrado' },
        },
      },
      get: {
        tags: ['Perfis (Profiles)'],
        summary: 'Listar todos os perfis',
        responses: {
          200: { description: 'Lista de todos os perfis com seus projetos' },
        },
      },
    },
    '/api/profiles/{id}': {
      get: {
        tags: ['Perfis (Profiles)'],
        summary: 'Buscar perfil por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'UUID do perfil',
          },
        ],
        responses: {
          200: { description: 'Perfil encontrado' },
          404: { description: 'Perfil não encontrado' },
        },
      },
    },
    '/api/technologies': {
      post: {
        tags: ['Tecnologias (Technologies)'],
        summary: 'Cadastrar nova tecnologia',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Node.js' },
                  category: { type: 'string', example: 'Backend' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Tecnologia cadastrada com sucesso' },
          400: { description: 'Erro de validação (nome vazio)' },
          409: { description: 'Tecnologia com nome já existente' },
        },
      },
      get: {
        tags: ['Tecnologias (Technologies)'],
        summary: 'Listar todas as tecnologias',
        responses: {
          200: { description: 'Lista de tecnologias cadastradas' },
        },
      },
    },
    '/api/database/reset': {
      post: {
        tags: ['🔧 Manutenção do Banco (Zerar Tabelas)'],
        summary: '🧹 Limpar e Zerar Todas as Tabelas do Banco',
        description: 'Exclui todos os registros de todas as tabelas (feedbacks, projetos, tecnologias e perfis), deixando o banco 100% vazio e zerado. Útil para demonstração e reset de testes.',
        responses: {
          200: {
            description: 'Banco de dados zerado com sucesso',
          },
        },
      },
    },
  },
};
