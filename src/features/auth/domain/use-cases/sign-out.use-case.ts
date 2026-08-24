import { IAuthRepository } from '../repositories/auth.repository';

export class SignOutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.signOut();
  }
}
