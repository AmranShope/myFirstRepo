import { LoyaltyRepository } from '../repositories/loyalty.repository';

export class RedeemLoyaltyPointsUseCase {
  constructor(private loyaltyRepository: LoyaltyRepository) {}

  async execute(userId: string, rewardId: string) {
    return this.loyaltyRepository.redeemReward(userId, rewardId);
  }
}
