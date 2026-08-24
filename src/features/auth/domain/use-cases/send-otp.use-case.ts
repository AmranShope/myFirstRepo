import { IAuthRepository } from '../repositories/auth.repository';
import { AuthResult } from '../entities/user.entity';
import { ValidateYemeniPhoneUseCase } from './validate-phone.use-case';

export class SendOtpUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private validatePhoneUseCase: ValidateYemeniPhoneUseCase = new ValidateYemeniPhoneUseCase()
  ) {}

  async execute(rawPhone: string): Promise<AuthResult<string>> {
    const validation = this.validatePhoneUseCase.execute(rawPhone);
    
    if (!validation.isValid || !validation.formattedInternational) {
      return {
        success: false,
        message: validation.errorMessage || 'رقم الهاتف غير صحيح'
      };
    }

    return await this.authRepository.sendOtp(validation.formattedInternational);
  }
}
