import { technologyRepository } from '../repositories/technology.repository';
import { CreateTechnologyDTO } from '../dtos/technology.dto';
import { ConflictError } from '../errors/app-error';

export class TechnologyService {
  async create(data: CreateTechnologyDTO) {
    const existing = await technologyRepository.findByName(data.name);
    if (existing) {
      throw new ConflictError(`A tecnologia '${data.name}' já está cadastrada.`);
    }

    return technologyRepository.create(data);
  }

  async getAll() {
    return technologyRepository.findAll();
  }

  async getManyByIds(ids: string[]) {
    return technologyRepository.findManyByIds(ids);
  }
}

export const technologyService = new TechnologyService();
