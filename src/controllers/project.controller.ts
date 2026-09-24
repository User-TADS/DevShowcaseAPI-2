import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import {
  CreateProjectDTO,
  CreateProjectFeedbackDTO,
  GetProjectsQueryDTO,
} from '../dtos/project.dto';

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateProjectDTO = req.body;
      const project = await projectService.create(data);

      res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Projeto cadastrado com sucesso!',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { technology, profileId, page, limit } = req.query;

      const queryParams: GetProjectsQueryDTO = {
        technology: typeof technology === 'string' ? technology : undefined,
        profileId: typeof profileId === 'string' ? profileId : undefined,
        page: page ? parseInt(String(page), 10) : undefined,
        limit: limit ? parseInt(String(limit), 10) : undefined,
      };

      const result = await projectService.getAll(queryParams);

      res.status(200).json({
        status: 'success',
        statusCode: 200,
        count: result.projects.length,
        pagination: result.pagination,
        data: result.projects,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const project = await projectService.getById(id);

      res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async upvote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedProject = await projectService.upvote(id);

      res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Upvote registrado com sucesso! Curtidas incrementadas.',
        data: updatedProject,
      });
    } catch (error) {
      next(error);
    }
  }

  async addFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const feedbackData: CreateProjectFeedbackDTO = req.body;

      const result = await projectService.addFeedback(id, feedbackData);

      res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Feedback cadastrado com sucesso e nota média recalculada!',
        data: {
          feedback: result.feedback,
          projectAverageRating: result.projectAverageRating,
          totalFeedbacks: result.totalFeedbacks,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
