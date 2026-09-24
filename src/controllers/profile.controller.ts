import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';
import { CreateProfileDTO } from '../dtos/profile.dto';

export class ProfileController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateProfileDTO = req.body;
      const profile = await profileService.create(data);

      res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Perfil de desenvolvedor cadastrado com sucesso!',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const profile = await profileService.getById(id);

      res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profiles = await profileService.getAll();

      res.status(200).json({
        status: 'success',
        statusCode: 200,
        count: profiles.length,
        data: profiles,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const profileController = new ProfileController();
