import { feedbackRepository } from '../repositories/feedback.repository';
import { projectRepository } from '../repositories/project.repository';
import { CreateFeedbackDTO } from '../dtos/feedback.dto';
import { NotFoundError, BadRequestError } from '../errors/app-error';

export class FeedbackService {
  async create(data: CreateFeedbackDTO) {
    // 1. Validar existência do projeto
    const project = await projectRepository.findById(data.projectId);
    if (!project) {
      throw new NotFoundError(`Projeto com ID '${data.projectId}' não foi encontrado.`);
    }

    // 2. Validar limites da nota
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestError('A avaliação (rating) deve ser um número inteiro entre 1 e 5.');
    }

    // 3. Cadastrar feedback
    const feedback = await feedbackRepository.create(data);

    // 4. Recalcular e atualizar a média no projeto
    const { average, count } = await feedbackRepository.calculateAverageRating(data.projectId);
    await projectRepository.updateAverageRating(data.projectId, average);

    return {
      feedback,
      projectAverageRating: average,
      totalFeedbacks: count,
    };
  }

  async getByProjectId(projectId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Projeto com ID '${projectId}' não foi encontrado.`);
    }

    return feedbackRepository.findByProjectId(projectId);
  }

  async getAll() {
    return feedbackRepository.findAll();
  }
}

export const feedbackService = new FeedbackService();
