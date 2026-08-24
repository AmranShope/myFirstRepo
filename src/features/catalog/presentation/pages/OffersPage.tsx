import React, { useState } from 'react';
import { Tag, Flame, Copy, Check, Gift, Percent } from 'lucide-react';
import { PRODUCTS, PROMO_CODES } from '../../../../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../../../../context/AppContext';

export const OffersPage: React.FC = () => {
  const { applyPromo, addToCart } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const discountedProducts = PRODUCTS.filter(p => p.originalPrice);

  const handleCopyCode = (code: string) => {
    applyPromo(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const bundles = [
    {
      id: 'b1',
      title: 'سلة المطبخ اليمني الاقتصادية 🌾',
      desc: 'أرز الشاهين 5كجم + زيت عافية 1.5 لتر + سمن بلدي 500غ + معجون طماطم',
      originalPrice: 30300,
      price: 26800,
      saving: 3500,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
      productIds: ['p15', 'p16', 'p17']
    },
    {
      id: 'b2',
      title: 'سلة الفواكه الطازجة الممتازة 🥭',
      desc: 'مانجو سمكة 2كجم + موز يمني 2كجم + تفاح أحمر سكري 1كجم',
      originalPrice: 12200,
      price: 9800,
      saving: 2400,
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80',
      productIds: ['p1', 'p2', 'p5']
    }
  ];

  return (
    <div className="space-y-4 pb-28 pt-2 px-3 sm:px-4 max-w-md w-full mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#FF4441] to-[#EC6A62] text-white p-4 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <Flame className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="font-black text-lg text-white">العروض والتخفيضات اليومية 🔥</h1>
              <p className="text-xs text-white/80 font-medium">وفّر أكثر مع أكواد خصم وسلال ترولي الاقتصادية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Codes Coupons Section */}
      <div className="space-y-2">
        <h2 className="text-sm font-extrabold text-[#1F1F1F] flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-[#FF4441]" />
          <span>كوبونات الخصم المتاحة لليوم</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.entries(PROMO_CODES).map(([code, details]) => {
            const isCopied = copiedCode === code;

            return (
              <div 
                key={code}
                className="bg-white p-3.5 rounded-2xl border-2 border-dashed border-[#1D327B]/30 shadow-xs flex items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#1D327B] text-white text-xs font-black px-2.5 py-0.5 rounded-md tracking-wider">
                      {code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      مفعل
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-800">{details.description}</p>
                </div>

                <button
                  onClick={() => handleCopyCode(code)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-2xs active:scale-95 transition-all shrink-0 ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#FF4441] hover:bg-[#e03a37] text-white'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>تطبيق</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Combo Bundles */}
      <div className="space-y-2.5 pt-2">
        <h2 className="text-sm font-extrabold text-[#1F1F1F] flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-[#1D327B]" />
          <span>سلال التوفير العائلية</span>
        </h2>

        <div className="space-y-3">
          {bundles.map(bundle => (
            <div key={bundle.id} className="bg-white p-3.5 rounded-2xl shadow-xs border border-gray-100 flex gap-3 items-center">
              <img
                src={bundle.image}
                alt={bundle.title}
                className="w-24 h-24 rounded-xl object-cover border border-gray-100 shrink-0"
              />

              <div className="flex-1 space-y-1">
                <span className="bg-red-100 text-[#FF4441] text-[10px] font-black px-2 py-0.5 rounded-full">
                  توفير {bundle.saving.toLocaleString('ar-YE')} ر.ي
                </span>
                <h3 className="font-extrabold text-sm text-[#1F1F1F]">{bundle.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{bundle.desc}</p>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-gray-400 line-through mr-1">
                      {bundle.originalPrice.toLocaleString('ar-YE')} ر.ي
                    </span>
                    <span className="text-base font-black text-[#1D327B]">
                      {bundle.price.toLocaleString('ar-YE')} ر.ي
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      bundle.productIds.forEach(id => {
                        const p = PRODUCTS.find(item => item.id === id);
                        if (p) addToCart(p, 1);
                      });
                    }}
                    className="bg-[#1D327B] hover:bg-[#2843a0] text-white px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all shadow-2xs"
                  >
                    أضف السلة كاملة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discounted Products Grid */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#1F1F1F] flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-[#FF4441]" />
            <span>منتجات عليها خصومات خاصة</span>
          </h2>
          <span className="text-xs font-bold text-[#FF4441] bg-red-50 px-2 py-0.5 rounded-full">
            {discountedProducts.length} منتج
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {discountedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};
