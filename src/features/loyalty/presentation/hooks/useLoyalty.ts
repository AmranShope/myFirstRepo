import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { LoyaltyRepositoryImpl } from '../../data/repositories/loyalty.repository.impl';
import { GetLoyaltyProfileUseCase } from '../../domain/use-cases/get-loyalty-profile.use-case';
import { RedeemLoyaltyPointsUseCase } from '../../domain/use-cases/redeem-loyalty-points.use-case';
import { LoyaltyPointHistory, LoyaltyReward, LoyaltyTier } from '../../domain/entities/loyalty.entity';
import { DEFAULT_LOYALTY_TIERS, AVAILABLE_LOYALTY_REWARDS } from '../../data/models/loyalty.model';

const loyaltyRepo = new LoyaltyRepositoryImpl();
const getProfileUseCase = new GetLoyaltyProfileUseCase(loyaltyRepo);
const redeemUseCase = new RedeemLoyaltyPointsUseCase(loyaltyRepo);

export function useLoyalty() {
  const { user, setUser, showToast } = useApp();
  const [history, setHistory] = useState<LoyaltyPointHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const points = user?.loyaltyPoints ?? 0;

  // Calculate current Tier dynamically
  const tier: LoyaltyTier = useMemo(() => {
    if (points >= DEFAULT_LOYALTY_TIERS[2].minPoints) return DEFAULT_LOYALTY_TIERS[2];
    if (points >= DEFAULT_LOYALTY_TIERS[1].minPoints) return DEFAULT_LOYALTY_TIERS[1];
    return DEFAULT_LOYALTY_TIERS[0];
  }, [points]);

  const nextTierPoints = useMemo(() => {
    if (points >= DEFAULT_LOYALTY_TIERS[2].minPoints) return DEFAULT_LOYALTY_TIERS[2].minPoints;
    if (points >= DEFAULT_LOYALTY_TIERS[1].minPoints) return DEFAULT_LOYALTY_TIERS[2].minPoints;
    return DEFAULT_LOYALTY_TIERS[1].minPoints;
  }, [points]);

  const progressPercentage = useMemo(() => {
    return Math.min(100, Math.round((points / nextTierPoints) * 100));
  }, [points, nextTierPoints]);

  const referralCode = useMemo(() => {
    return user?.id && user.id !== 'guest' 
      ? `TR-${user.id.slice(0, 6).toUpperCase()}` 
      : 'TROOLLY-VIP';
  }, [user?.id]);

  const loadHistory = useCallback(async () => {
    if (!user?.id || user.id === 'guest') {
      // Default local welcome transaction
      setHistory([
        {
          id: 'welcome_tx',
          userId: 'guest',
          points: points,
          type: 'welcome',
          title: 'نقاط ترحيبية فورية',
          description: 'هدية ترحيبية عند بدء استخدام ترولي',
          createdAt: new Date().toISOString()
        }
      ]);
      return;
    }

    setLoading(true);
    try {
      const items = await loyaltyRepo.getPointHistory(user.id);
      if (items.length === 0) {
        setHistory([
          {
            id: 'welcome_tx',
            userId: user.id,
            points: points,
            type: 'welcome',
            title: 'نقاط ترحيبية فورية',
            description: 'هدية ترحيبية عند فتح الحساب',
            createdAt: user.createdAt || new Date().toISOString()
          }
        ]);
      } else {
        setHistory(items);
      }
    } catch {
      // Silent catch
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.createdAt, points]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const redeemReward = useCallback(async (rewardId: string) => {
    if (!user?.id) {
      showToast('يرجى تسجيل الدخول لاستبدال النقاط');
      return { success: false, message: 'يرجى تسجيل الدخول' };
    }

    setRedeemingId(rewardId);
    try {
      const res = await redeemUseCase.execute(user.id, rewardId);
      if (res.success) {
        const updated = { ...user, loyaltyPoints: res.remainingPoints };
        setUser(updated);
        localStorage.setItem('troolly_user_session', JSON.stringify(updated));
        showToast(res.message);
        loadHistory();
      } else {
        showToast(res.message);
      }
      return res;
    } catch {
      showToast('تعذر استبدال النقاط، يرجى المحاولة لاحقاً');
      return { success: false, message: 'حدث خطأ' };
    } finally {
      setRedeemingId(null);
    }
  }, [user, setUser, showToast, loadHistory]);

  return {
    points,
    tier,
    nextTierPoints,
    progressPercentage,
    referralCode,
    history,
    rewards: AVAILABLE_LOYALTY_REWARDS,
    tiers: DEFAULT_LOYALTY_TIERS,
    loading,
    redeemingId,
    redeemReward,
    refreshHistory: loadHistory
  };
}
