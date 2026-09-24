import { z } from 'zod';

export const CreateProjectSchema = z.object({
  title: z
    .string({ required_error: 'O título do projeto é obrigatório' })
    .trim()
    .min(1, 'O título não pode estar vazio'),
  description: z
    .string({ required_error: 'A descrição do projeto é obrigatória' })
    .trim()
    .min(3, 'A descrição deve conter pelo menos 3 caracteres'),
  repositoryUrl: z
    .string()
    .trim()
    .url('A URL do repositório deve ser válida (ex: https://github.com/usuario/repo)')
    .optional()
    .or(z.literal('')),
  liveUrl: z
    .string()
    .trim()
    .url('A URL do projeto em produção deve ser válida (ex: https://meuprojeto.com)')
    .optional()
    .or(z.literal('')),
  profileId: z
    .string({ required_error: 'O ID do perfil do desenvolvedor (profileId) é obrigatório' })
    .trim()
    .min(1, 'O profileId não pode estar vazio'),
  technologyIds: z.array(z.string().trim()).optional().default([]),
});

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;

// DTO para cadastrar feedback na rota POST /api/projects/:id/feedbacks
export const CreateProjectFeedbackSchema = z.object({
  author: z
    .string({ required_error: 'O nome do autor do feedback é obrigatório' })
    .trim()
    .min(2, 'O nome do autor deve ter pelo menos 2 caracteres'),
  content: z
    .string({ required_error: 'O comentário do feedback é obrigatório' })
    .trim()
    .min(3, 'O feedback deve conter pelo menos 3 caracteres'),
  rating: z
    .number({ required_error: 'A avaliação (rating) é obrigatória' })
    .int('A avaliação deve ser um número inteiro')
    .min(1, 'A avaliação mínima é 1 estrela')
    .max(5, 'A avaliação máxima é 5 estrelas'),
});

export type CreateProjectFeedbackDTO = z.infer<typeof CreateProjectFeedbackSchema>;

// Validação dos parâmetros de consulta da rota GET /api/projects
export const GetProjectsQuerySchema = z.object({
  technology: z.string().trim().optional(),
  profileId: z.string().trim().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: 'O parâmetro page deve ser um número inteiro maior ou igual a 1',
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 100, {
      message: 'O parâmetro limit deve ser um número inteiro entre 1 e 100',
    }),
});

export type GetProjectsQueryDTO = {
  technology?: string;
  profileId?: string;
  page?: number;
  limit?: number;
};

export interface ProjectResponseDTO {
  id: string;
  title: string;
  description: string;
  repositoryUrl?: string | null;
  liveUrl?: string | null;
  upvotes: number;
  averageRating: number;
  profileId: string;
  profile?: {
    id: string;
    name: string;
    email: string;
  };
  technologies?: {
    id: string;
    name: string;
    category?: string | null;
  }[];
  feedbacks?: {
    id: string;
    author: string;
    content: string;
    rating: number;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
