export type LoyaltyTransactionType = 'earned' | 'redeemed' | 'bonus' | 'referral' | 'welcome';

export interface LoyaltyPointHistory {
  id: string;
  userId: string;
  points: number; // positive for earned/bonus/welcome, negative for redeemed
  type: LoyaltyTransactionType;
  title: string;
  description?: string;
  createdAt: string;
  relatedOrderId?: string;
  rewardValueRiyal?: number;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  requiredPoints: number;
  discountRiyal: number;
  categoryRestriction?: string;
  badge?: string;
  icon?: string;
  isPopular?: boolean;
}

export interface LoyaltyTier {
  name: string;
  title: string;
  minPoints: number;
  multiplier: number; // e.g. 1.0x, 1.25x, 1.5x
  badgeColor: string;
  perks: string[];
}

export interface LoyaltyProfile {
  totalPoints: number;
  tier: LoyaltyTier;
  nextTierPoints: number;
  progressPercentage: number;
  referralCode: string;
  history: LoyaltyPointHistory[];
}
