import { Request, Response, NextFunction } from 'express';
import { technologyService } from '../services/technology.service';
import { CreateTechnologyDTO } from '../dtos/technology.dto';

export class TechnologyController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateTechnologyDTO = req.body;
      const technology = await technologyService.create(data);

      res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Tecnologia cadastrada com sucesso!',
        data: technology,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const technologies = await technologyService.getAll();

      res.status(200).json({
        status: 'success',
        statusCode: 200,
        count: technologies.length,
        data: technologies,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const technologyController = new TechnologyController();
