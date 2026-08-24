import { LoyaltyRepository } from '../repositories/loyalty.repository';
import { LoyaltyProfile } from '../entities/loyalty.entity';

export class GetLoyaltyProfileUseCase {
  constructor(private loyaltyRepository: LoyaltyRepository) {}

  async execute(userId: string): Promise<LoyaltyProfile> {
    return this.loyaltyRepository.getLoyaltyProfile(userId);
  }
}
