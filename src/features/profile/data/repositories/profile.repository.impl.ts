import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { UserProfileEntity, UpdateProfileParams } from '../../domain/entities/profile.entity';
import { ProfileRemoteDataSource } from '../datasources/profile-remote.datasource';

export class ProfileRepositoryImpl implements ProfileRepository {
  private dataSource = new ProfileRemoteDataSource();

  async getProfile(userId: string): Promise<UserProfileEntity | null> {
    return this.dataSource.getProfile(userId);
  }

  async updateProfile(userId: string, params: UpdateProfileParams): Promise<UserProfileEntity> {
    return this.dataSource.updateProfile(userId, params);
  }

  async deleteUserAccount(userId: string): Promise<void> {
    // Delete account logic/request
  }
}
