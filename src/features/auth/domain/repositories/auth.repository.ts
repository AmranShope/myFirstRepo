import { UserEntity, AuthResult } from '../entities/user.entity';

export interface IAuthRepository {
  /**
   * Sends OTP to a formatted international phone number
   */
  sendOtp(formattedPhone: string): Promise<AuthResult<string>>;

  /**
   * Confirms the OTP code and returns the authenticated UserEntity
   */
  verifyOtp(otpCode: string, pendingPhone: string): Promise<AuthResult<UserEntity>>;

  /**
   * Signs out the current user session
   */
  signOut(): Promise<void>;

  /**
   * Gets the stored or active user profile
   */
  getCurrentUser(): Promise<UserEntity | null>;

  /**
   * Updates user profile fields
   */
  updateUserProfile(uid: string, profileData: Partial<UserEntity>): Promise<UserEntity>;

  /**
   * Listens for real-time auth state changes
   */
  onAuthStateChange(callback: (user: UserEntity | null) => void): () => void;
}
