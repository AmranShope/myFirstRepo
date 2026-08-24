import { IAuthRepository } from '../repositories/auth.repository';
import { AuthResult, UserEntity } from '../entities/user.entity';

export class VerifyOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(otpCode: string, pendingPhone: string): Promise<AuthResult<UserEntity>> {
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      return {
        success: false,
        message: 'يرجى إدخال كود التحقق المكون من 6 أرقام كاملاً'
      };
    }

    return await this.authRepository.verifyOtp(cleanCode, pendingPhone);
  }
}
