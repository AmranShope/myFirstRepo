import { IAuthRepository } from '../../domain/repositories/auth.repository';
import { UserEntity, AuthResult } from '../../domain/entities/user.entity';
import { AuthRemoteDataSource } from '../datasources/auth-remote.datasource';

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(private remoteDataSource: AuthRemoteDataSource = new AuthRemoteDataSource()) {}

  async sendOtp(formattedPhone: string): Promise<AuthResult<string>> {
    try {
      const verificationId = await this.remoteDataSource.sendPhoneOtp(formattedPhone);
      return {
        success: true,
        data: verificationId
      };
    } catch (error: any) {
      const message = this.remoteDataSource.mapErrorMessage(error);
      return {
        success: false,
        message
      };
    }
  }

  async verifyOtp(otpCode: string, pendingPhone: string): Promise<AuthResult<UserEntity>> {
    try {
      const user = await this.remoteDataSource.confirmOtp(otpCode, pendingPhone);
      
      if (user.isBanned) {
        await this.signOut();
        return {
          success: false,
          message: 'عذراً، هذا الحساب محظور من قِبل إدارة المتجر.'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error: any) {
      const message = this.remoteDataSource.mapErrorMessage(error);
      return {
        success: false,
        message
      };
    }
  }

  async signOut(): Promise<void> {
    await this.remoteDataSource.signOut();
  }

  async getCurrentUser(): Promise<UserEntity | null> {
    const raw = localStorage.getItem('troolly_user_session');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async updateUserProfile(uid: string, profileData: Partial<UserEntity>): Promise<UserEntity> {
    return await this.remoteDataSource.updateUserProfile(uid, profileData);
  }

  onAuthStateChange(callback: (user: UserEntity | null) => void): () => void {
    return this.remoteDataSource.onAuthStateChanged(callback);
  }
}
