import React from 'react';
import { X, Award, Gift, Check, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../../../../context/AppContext';
import { useLoyalty } from '../hooks/useLoyalty';

export const LoyaltyPointsModal: React.FC = () => {
  const { isLoyaltyModalOpen, setIsLoyaltyModalOpen, user, setCurrentScreen } = useApp();
  const { points, rewards, redeemingId, redeemReward } = useLoyalty();

  if (!isLoyaltyModalOpen) return null;

  return (
    <div 
      id="loyalty-points-modal-overlay" 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div 
        id="loyalty-points-modal-container"
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col shadow-2xl border border-gray-100"
      >
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-20 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 text-white p-2 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-[#1F1F1F]">برنامج مكافآت ترولي</h1>
              <span className="text-xs text-gray-500 font-medium">اكسب نقطة مقابل كل 100 ر.ي تشتري بها!</span>
            </div>
          </div>

          <button
            onClick={() => setIsLoyaltyModalOpen(false)}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 flex-1 pb-6">
          
          {!user ? (
            <div className="p-6 bg-amber-50/60 rounded-2xl border border-amber-200 text-center space-y-3">
              <div className="text-3xl">🌟</div>
              <h3 className="font-black text-sm text-[#1F1F1F]">سجل دخولك لبدء جمع واستبدال النقاط</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                أنشئ حسابك الآن لتحصل على نقاط ترحيبية فورية مع كل طلب وتستبدلها بقسائم خصم نقدية!
              </p>
              <button
                onClick={() => {
                  setIsLoyaltyModalOpen(false);
                  setCurrentScreen('login');
                }}
                className="bg-[#1D327B] hover:bg-[#15255e] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                تسجيل الدخول الآن
              </button>
            </div>
          ) : (
            <>
              {/* Points Balance Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white p-5 rounded-2xl shadow-md text-center space-y-1 relative overflow-hidden">
                <span className="text-xs font-extrabold text-amber-100 block">رصيد نقاطك الحالي</span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-3xl font-black text-white">{points}</span>
                  <span className="text-sm font-bold text-amber-100">نقطة ترولي 🌟</span>
                </div>
                <p className="text-[11px] text-amber-100 font-medium pt-1">
                  تعادل خصماً بقيمة تزيد عن <strong className="underline font-extrabold">{(points * 10).toLocaleString('ar-YE')} ر.ي</strong>
                </p>
              </div>

              {/* Rewards List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-[#1F1F1F] flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-600" />
                    <span>خيارات استبدال النقاط:</span>
                  </h3>
                  <button
                    onClick={() => {
                      setIsLoyaltyModalOpen(false);
                      setCurrentScreen('loyalty');
                    }}
                    className="text-xs text-[#1D327B] font-bold hover:underline"
                  >
                    عرض التفاصيل
                  </button>
                </div>

                <div className="space-y-2.5">
                  {rewards.map(reward => {
                    const canAfford = points >= reward.requiredPoints;
                    const isRedeeming = redeemingId === reward.id;

                    return (
                      <div
                        key={reward.id}
                        className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-[#1D327B]">{reward.title}</span>
                          </div>
                          <p className="text-xs text-gray-500">{reward.description}</p>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                            تتطلب {reward.requiredPoints} نقطة
                          </span>
                        </div>

                        <button
                          onClick={() => redeemReward(reward.id)}
                          disabled={!canAfford || isRedeeming}
                          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isRedeeming ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>جاري...</span>
                            </>
                          ) : canAfford ? (
                            'استبدال الآن'
                          ) : (
                            'نقاط غير كافية'
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
