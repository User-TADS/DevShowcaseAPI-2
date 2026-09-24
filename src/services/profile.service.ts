import { profileRepository } from '../repositories/profile.repository';
import { CreateProfileDTO } from '../dtos/profile.dto';
import { ConflictError, NotFoundError } from '../errors/app-error';

export class ProfileService {
  async create(data: CreateProfileDTO) {
    const existing = await profileRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError(`Já existe um perfil cadastrado com o e-mail: ${data.email}`);
    }

    return profileRepository.create(data);
  }

  async getById(id: string) {
    const profile = await profileRepository.findById(id);
    if (!profile) {
      throw new NotFoundError(`Perfil com ID ${id} não foi encontrado.`);
    }
    return profile;
  }

  async getAll() {
    return profileRepository.findAll();
  }
}

export const profileService = new ProfileService();
