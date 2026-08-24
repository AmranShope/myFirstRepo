import React, { useState } from 'react';
import { 
  ArrowRight, 
  Award, 
  Gift, 
  History, 
  Share2, 
  Sparkles, 
  ChevronLeft, 
  LogIn, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useApp } from '../../../../context/AppContext';
import { useLoyalty } from '../hooks/useLoyalty';

export const LoyaltyPage: React.FC = () => {
  const { setCurrentScreen, user, showToast, setActiveDialog } = useApp();
  const { 
    points, 
    tier, 
    nextTierPoints, 
    progressPercentage, 
    referralCode, 
    history, 
    rewards, 
    tiers, 
    loading, 
    redeemingId, 
    redeemReward 
  } = useLoyalty();

  const [activeTab, setActiveTab] = useState<'rewards' | 'history' | 'tiers'>('rewards');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopied(true);
    showToast('تم نسخ رمز الإحالة والمشاركة إلى الحافظة 📋');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    setActiveDialog('share_app');
  };

  return (
    <div id="loyalty-page-container" className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            id="loyalty-back-btn"
            onClick={() => setCurrentScreen('main')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            aria-label="الرجوع للرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <Award className="w-5 h-5 text-amber-500" />
            <h1 className="text-base font-black text-[#1F1F1F]">نقاط ولاء ترولي</h1>
          </div>
        </div>

        {user && (
          <span className="text-xs font-black bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-full">
            {tier.title}
          </span>
        )}
      </header>

      {!user ? (
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-amber-200/60">
            🏆
          </div>
          <h2 className="text-lg font-black text-[#1F1F1F]">سجل دخولك لجمع النقاط</h2>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            برنامج ولاء ترولي يمنحك نقاطاً تلقائية مع كل عملية شراء لاستبدالها بخصومات فورية ونقدية عند إتمام كل طلب!
          </p>
          <button
            id="loyalty-login-cta-btn"
            onClick={() => setCurrentScreen('login')}
            className="bg-[#1D327B] hover:bg-[#15255e] text-white px-6 py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول / إنشاء حساب</span>
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4 flex-1 pb-20">
          
          {/* Main Loyalty Balance Card */}
          <div className="bg-gradient-to-br from-[#1D327B] via-[#243c8f] to-[#12225a] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden space-y-4">
            
            {/* Background Decorative Rings */}
            <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-400/10 rounded-full blur-lg pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>عضوية ترولي بريميوم</span>
                </span>
                <h2 className="text-base font-black text-white">{user.name || 'عميل ترولي المميز'}</h2>
                <p className="text-xs text-white/70">كل 100 ر.ي تمنحك نقطة ولاء مجانية</p>
              </div>

              <div className="text-center bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-inner">
                <span className="text-3xl font-black text-amber-300 block leading-none">{points}</span>
                <span className="text-[10px] text-white/90 font-bold mt-0.5 block">نقطة متاحة 🌟</span>
              </div>
            </div>

            {/* Tier Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-white/15 relative z-10">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-amber-200">المستوى الحالي: {tier.title}</span>
                <span className="text-white/80">{points} / {nextTierPoints} نقطة</span>
              </div>
              
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <p className="text-[10px] text-white/60 text-left dir-rtl">
                {points >= nextTierPoints 
                  ? 'أنت الآن في أعلى مستوى للمكافآت! 🎉'
                  : `تبقى ${Math.max(0, nextTierPoints - points)} نقطة للترقية للمستوى التالي`}
              </p>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="bg-white p-1 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-1">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'rewards'
                  ? 'bg-[#1D327B] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>المكافآت والخصومات</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#1D327B] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>سجل العمليات</span>
            </button>

            <button
              onClick={() => setActiveTab('tiers')}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'tiers'
                  ? 'bg-[#1D327B] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>مستويات العضوية</span>
            </button>
          </div>

          {/* TAB 1: Rewards List */}
          {activeTab === 'rewards' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              
              {/* Share & Earn Card */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#FF4441] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>شارك واكسب 100 نقطة</span>
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                    مكافأة فورية
                  </span>
                </div>

                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                  شارك رمز الإحالة الخاص بك مع أصدقائك، واكسب 100 نقطة مجانية فور إتمامهم أول طلب!
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleCopyCode}
                    className="flex-1 bg-red-50 hover:bg-red-100/80 text-red-600 font-mono text-xs font-black p-3 rounded-xl border border-red-100 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="tracking-wider dir-ltr">{referralCode}</span>
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-red-500" />}
                  </button>

                  <button
                    onClick={handleShare}
                    className="bg-[#1D327B] hover:bg-[#2843a0] text-white px-4 py-3 rounded-xl font-black text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة</span>
                  </button>
                </div>
              </div>

              {/* Reward Options Grid */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-black text-[#1F1F1F] flex items-center gap-1 px-1">
                  <Gift className="w-4 h-4 text-[#1D327B]" />
                  <span>قسائم الخصم المتاحة للاستبدال:</span>
                </h3>

                {rewards.map(reward => {
                  const canAfford = points >= reward.requiredPoints;
                  const isRedeeming = redeemingId === reward.id;

                  return (
                    <div
                      key={reward.id}
                      className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between gap-3 hover:border-amber-300 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-[#1D327B]">{reward.title}</h4>
                          {reward.badge && (
                            <span className="text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md">
                              {reward.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-snug">{reward.description}</p>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                            {reward.requiredPoints} نقطة
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">
                            خصم {reward.discountRiyal.toLocaleString('ar-YE')} ر.ي
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => redeemReward(reward.id)}
                        disabled={!canAfford || isRedeeming}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
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
                          <span>استبدال</span>
                        ) : (
                          <span>نقاط أقل</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: History List */}
          {activeTab === 'history' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                  <h3 className="text-xs font-black text-[#1F1F1F] flex items-center gap-1.5">
                    <History className="w-4 h-4 text-[#1D327B]" />
                    <span>سجل الحركات والنقاط المكتسبة</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400">
                    {history.length} عملية
                  </span>
                </div>

                {loading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1D327B]" />
                    <span className="text-xs font-bold">جاري تحميل سجل العمليات...</span>
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-xs font-bold">
                    لا توجد حركات سابقة للنقاط حتى الآن
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map(item => {
                      const isPositive = item.points > 0;
                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-gray-50/80 hover:bg-gray-50 rounded-xl flex items-center justify-between text-xs border border-gray-100/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                              isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                            }`}>
                              {isPositive ? '🎁' : '🏷️'}
                            </div>
                            <div>
                              <span className="block font-black text-gray-800 text-xs">{item.title}</span>
                              <span className="text-[10px] text-gray-400 block font-medium">
                                {new Date(item.createdAt).toLocaleDateString('ar-YE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          <div className="text-left">
                            <span className={`font-black text-xs block dir-ltr ${
                              isPositive ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                              {isPositive ? `+${item.points}` : item.points} نقطة
                            </span>
                            {item.rewardValueRiyal && (
                              <span className="text-[9px] text-gray-500 font-bold block">
                                بقيمة {item.rewardValueRiyal} ر.ي
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Tiers & Perks */}
          {activeTab === 'tiers' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="space-y-2.5">
                {tiers.map(t => {
                  const isCurrent = tier.name === t.name;
                  return (
                    <div
                      key={t.name}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent 
                          ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/30 shadow-xs' 
                          : 'bg-white border-gray-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${t.badgeColor}`}>
                            {t.title}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                              مستواك الحالي
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-black text-gray-600">
                          {t.minPoints === 0 ? 'من 0 نقطة' : `من ${t.minPoints} نقطة`}
                        </span>
                      </div>

                      <ul className="space-y-1.5 pt-1 text-xs text-gray-600">
                        {t.perks.map((perk, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
