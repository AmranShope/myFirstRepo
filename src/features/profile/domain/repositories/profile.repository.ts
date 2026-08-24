import { UserProfileEntity, UpdateProfileParams } from '../entities/profile.entity';

export interface ProfileRepository {
  getProfile(userId: string): Promise<UserProfileEntity | null>;
  updateProfile(userId: string, params: UpdateProfileParams): Promise<UserProfileEntity>;
  deleteUserAccount(userId: string): Promise<void>;
}
