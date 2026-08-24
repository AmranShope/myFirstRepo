import { LoyaltyPointHistory, LoyaltyReward, LoyaltyProfile } from '../entities/loyalty.entity';

export interface LoyaltyRepository {
  getLoyaltyProfile(userId: string): Promise<LoyaltyProfile>;
  getPointHistory(userId: string): Promise<LoyaltyPointHistory[]>;
  getAvailableRewards(): Promise<LoyaltyReward[]>;
  redeemReward(userId: string, rewardId: string): Promise<{ success: boolean; message: string; discountCode?: string; remainingPoints: number }>;
  addPoints(userId: string, points: number, type: 'earned' | 'bonus' | 'referral' | 'welcome', title: string, orderId?: string): Promise<number>;
}
