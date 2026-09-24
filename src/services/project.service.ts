import { projectRepository } from '../repositories/project.repository';
import { profileRepository } from '../repositories/profile.repository';
import { technologyRepository } from '../repositories/technology.repository';
import { feedbackRepository } from '../repositories/feedback.repository';
import { CreateProjectDTO, CreateProjectFeedbackDTO, GetProjectsQueryDTO } from '../dtos/project.dto';
import { NotFoundError, BadRequestError } from '../errors/app-error';

export class ProjectService {
  async create(data: CreateProjectDTO) {
    // Regra de negócio 1: Validar existência do perfil do desenvolvedor
    const profile = await profileRepository.findById(data.profileId);
    if (!profile) {
      throw new NotFoundError(
        `Perfil de desenvolvedor com ID '${data.profileId}' não foi encontrado.`
      );
    }

    // Regra de negócio 2: Validar integridade das tecnologias associadas
    if (data.technologyIds && data.technologyIds.length > 0) {
      const foundTechs = await technologyRepository.findManyByIds(data.technologyIds);
      if (foundTechs.length !== data.technologyIds.length) {
        const foundIds = new Set(foundTechs.map((t) => t.id));
        const missingIds = data.technologyIds.filter((id) => !foundIds.has(id));
        throw new BadRequestError(
          `Tecnologias não encontradas: ${missingIds.join(', ')}`
        );
      }
    }

    return projectRepository.create(data);
  }

  async getAll(query: GetProjectsQueryDTO) {
    const page = query.page && query.page >= 1 ? query.page : 1;
    const limit = query.limit && query.limit >= 1 && query.limit <= 100 ? query.limit : 10;
    const skip = (page - 1) * limit;

    const { total, projects } = await projectRepository.findAll({
      profileId: query.profileId,
      technology: query.technology,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getById(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError(`Projeto com ID '${id}' não foi encontrado.`);
    }
    return project;
  }

  async upvote(id: string) {
    // Regra de negócio: Verificar se o projeto existe antes de incrementar upvotes
    const existing = await projectRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Projeto com ID '${id}' não foi encontrado para receber upvote.`);
    }

    return projectRepository.incrementUpvote(id);
  }

  async addFeedback(projectId: string, feedbackData: CreateProjectFeedbackDTO) {
    // Regra de negócio 1: Validar se o projeto avaliado existe
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Projeto com ID '${projectId}' não foi encontrado para receber feedback.`);
    }

    // Regra de negócio 2: Validar nota entre 1 e 5
    if (feedbackData.rating < 1 || feedbackData.rating > 5) {
      throw new BadRequestError('A avaliação (rating) deve ser um número inteiro entre 1 e 5.');
    }

    // Regra de negócio 3: Registrar o feedback vinculado ao projeto
    const feedback = await feedbackRepository.create({
      author: feedbackData.author,
      content: feedbackData.content,
      rating: feedbackData.rating,
      projectId,
    });

    // Regra de negócio 4: Recalcular a média das avaliações do projeto dinamicamente
    const { average, count } = await feedbackRepository.calculateAverageRating(projectId);

    // Regra de negócio 5: Atualizar a nota média no cadastro do projeto
    const updatedProject = await projectRepository.updateAverageRating(projectId, average);

    return {
      feedback,
      projectAverageRating: updatedProject.averageRating,
      totalFeedbacks: count,
    };
  }
}

export const projectService = new ProjectService();
