import { LoyaltyRepository } from '../../domain/repositories/loyalty.repository';
import { LoyaltyPointHistory, LoyaltyReward, LoyaltyProfile } from '../../domain/entities/loyalty.entity';
import { LoyaltyRemoteDataSource } from '../datasources/loyalty-remote.datasource';
import { DEFAULT_LOYALTY_TIERS } from '../models/loyalty.model';

export class LoyaltyRepositoryImpl implements LoyaltyRepository {
  private dataSource = new LoyaltyRemoteDataSource();

  async getLoyaltyProfile(userId: string): Promise<LoyaltyProfile> {
    const totalPoints = await this.dataSource.getUserPoints(userId);
    const history = await this.dataSource.getPointHistory(userId);

    // Calculate Tier
    let currentTier = DEFAULT_LOYALTY_TIERS[0];
    let nextTierPoints = DEFAULT_LOYALTY_TIERS[1].minPoints;
    
    if (totalPoints >= DEFAULT_LOYALTY_TIERS[2].minPoints) {
      currentTier = DEFAULT_LOYALTY_TIERS[2];
      nextTierPoints = DEFAULT_LOYALTY_TIERS[2].minPoints;
    } else if (totalPoints >= DEFAULT_LOYALTY_TIERS[1].minPoints) {
      currentTier = DEFAULT_LOYALTY_TIERS[1];
      nextTierPoints = DEFAULT_LOYALTY_TIERS[2].minPoints;
    }

    const progressPercentage = Math.min(100, Math.round((totalPoints / (nextTierPoints || 1000)) * 100));
    const referralCode = userId && userId !== 'guest' 
      ? `TR-${userId.slice(0, 6).toUpperCase()}` 
      : 'TROOLLY-VIP';

    return {
      totalPoints,
      tier: currentTier,
      nextTierPoints,
      progressPercentage,
      referralCode,
      history
    };
  }

  async getPointHistory(userId: string): Promise<LoyaltyPointHistory[]> {
    return this.dataSource.getPointHistory(userId);
  }

  async getAvailableRewards(): Promise<LoyaltyReward[]> {
    return this.dataSource.getRewards();
  }

  async redeemReward(userId: string, rewardId: string) {
    const rewards = this.dataSource.getRewards();
    const targetReward = rewards.find(r => r.id === rewardId);
    if (!targetReward) {
      return { success: false, message: 'المكافأة المحددة غير متوفرة حالياً', remainingPoints: 0 };
    }

    const currentPoints = await this.dataSource.getUserPoints(userId);
    if (currentPoints < targetReward.requiredPoints) {
      return { 
        success: false, 
        message: `نقاطك غير كافية! تحتاج إلى ${targetReward.requiredPoints} نقطة، رصيدك الحالي ${currentPoints}`, 
        remainingPoints: currentPoints 
      };
    }

    const remainingPoints = currentPoints - targetReward.requiredPoints;
    await this.dataSource.updateUserPoints(userId, remainingPoints);

    const discountCode = `LOYALTY-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Add to history
    await this.dataSource.addHistoryEntry(userId, {
      userId,
      points: -targetReward.requiredPoints,
      type: 'redeemed',
      title: `استبدال مكافأة: ${targetReward.title}`,
      description: `تم الحصول على كود خصم بقيمة ${targetReward.discountRiyal} ر.ي (${discountCode})`,
      createdAt: new Date().toISOString(),
      rewardValueRiyal: targetReward.discountRiyal
    });

    return {
      success: true,
      message: `تم استبدال ${targetReward.requiredPoints} نقطة بنجاح بقسيمة خصم ${targetReward.discountRiyal} ر.ي!`,
      discountCode,
      remainingPoints
    };
  }

  async addPoints(userId: string, points: number, type: 'earned' | 'bonus' | 'referral' | 'welcome', title: string, orderId?: string): Promise<number> {
    const current = await this.dataSource.getUserPoints(userId);
    const updated = current + points;
    await this.dataSource.updateUserPoints(userId, updated);
    await this.dataSource.addHistoryEntry(userId, {
      userId,
      points,
      type,
      title,
      createdAt: new Date().toISOString(),
      relatedOrderId: orderId
    });
    return updated;
  }
}
