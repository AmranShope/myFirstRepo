import React from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useApp } from '../../../../context/AppContext';

export const FloatingCartBar: React.FC = () => {
  const { cartCount, cartTotal, setCurrentScreen } = useApp();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-[84px] left-0 right-0 z-20 px-4 w-full max-w-md mx-auto pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
      <button
        id="floating-cart-bar-btn"
        onClick={() => setCurrentScreen('cart')}
        className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-between border border-white/20 active:scale-[0.99] transition-all group cursor-pointer"
      >
        {/* Count & Bag */}
        <div className="flex items-center gap-3">
          <div className="relative bg-[#FF4441] text-white p-2 rounded-xl flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#1D327B] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs text-white/80 font-medium">سلة التسوق ({cartCount} منتجات)</span>
            <span className="text-base font-extrabold text-white">
              {cartTotal.toLocaleString('ar-YE')} <span className="text-xs font-normal">ر.ي</span>
            </span>
          </div>
        </div>

        {/* View Cart CTA */}
        <div className="flex items-center gap-1.5 bg-white/15 group-hover:bg-white/25 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all">
          <span>عرض السلة</span>
          <ArrowLeft className="w-4 h-4 text-white rotate-0" />
        </div>
      </button>
    </div>
  );
};

