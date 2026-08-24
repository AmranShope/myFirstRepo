import { ProfileRepository } from '../repositories/profile.repository';
import { UpdateProfileParams, UserProfileEntity } from '../entities/profile.entity';

export class UpdateProfileUseCase {
  constructor(private profileRepository: ProfileRepository) {}

  async execute(userId: string, params: UpdateProfileParams): Promise<UserProfileEntity> {
    return this.profileRepository.updateProfile(userId, params);
  }
}
