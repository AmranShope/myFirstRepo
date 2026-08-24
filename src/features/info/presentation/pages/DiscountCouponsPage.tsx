import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { ArrowRight, Ticket } from 'lucide-react';

export const DiscountCouponsPage: React.FC = () => {
  const { setCurrentScreen, applyPromo, showToast } = useApp();

  const coupons = [
    {
      id: 'c1',
      code: 'YEMEN2026',
      discountTitle: 'احصل على خصم 500 ر.ي',
      pointsText: 'احصل على 500 ريال مقابل 500 نقطة',
      desc: '500 نقطة احصل على خصم 100% حتى 500 تسوق مقابل 2000 لتطبيق العرض.'
    },
    {
      id: 'c2',
      code: 'TROOLLY1000',
      discountTitle: 'احصل على خصم 1000 ر.ي',
      pointsText: 'احصل على 1000 ريال مقابل 1000 نقطة',
      desc: '500 نقطة احصل على خصم 100% حتى 500 تسوق مقابل 2000 لتطبيق العرض.'
    }
  ];

  const handleClaim = (code: string) => {
    const res = applyPromo(code);
    showToast(res.message);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('main')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-[#1F1F1F]">كوبونات الخصم</h1>
        </div>
      </div>

      <div className="p-4 space-y-3 flex-1">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs flex items-stretch divide-x divide-dashed divide-gray-300 dir-rtl"
          >
            {/* Main Details */}
            <div className="p-4 flex-1 space-y-1">
              <h3 className="text-xs font-black text-[#1F1F1F]">
                {coupon.pointsText}
              </h3>
              <p className="text-[10px] font-medium text-gray-500 leading-relaxed">
                {coupon.desc}
              </p>
              <button
                onClick={() => handleClaim(coupon.code)}
                className="mt-2 text-[11px] font-extrabold text-[#1D327B] hover:underline cursor-pointer"
              >
                تطبيق الكوبون الآن ←
              </button>
            </div>

            {/* Voucher Badge Side */}
            <div className="bg-[#1D327B]/5 p-4 flex flex-col items-center justify-center text-center w-28 shrink-0">
              <span className="text-[10px] font-bold text-gray-500 block">احصل على خصم</span>
              <span className="text-sm font-black text-[#FF4441] dir-ltr block my-0.5">
                {coupon.discountTitle.replace('احصل على خصم ', '')}
              </span>
              <Ticket className="w-5 h-5 text-[#1D327B] mt-1" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
