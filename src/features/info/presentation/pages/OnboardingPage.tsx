import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'استمتع بخصومات حصرية',
      desc: 'تسوق أفضل المنتجات والبقالة بأسعار تنافسية وعروض يومية متجددة.',
      icon: <ShoppingBag className="w-20 h-20 text-[#1D327B]" />,
      bg: 'bg-orange-50'
    },
    {
      title: 'توصيل سريع إلى باب منزلك',
      desc: 'فريق ترولي يوصل طلبيتك بأسرع وقت في جميع أحياء صنعاء وعدن والمدن اليمنية.',
      icon: <Truck className="w-20 h-20 text-[#EC6A62]" />,
      bg: 'bg-blue-50'
    },
    {
      title: 'طرق دفع آمنة ومتنوعة',
      desc: 'ادفع نقداً عند الاستلام، أو عبر الكريمي جوال، حاسب، ومحفظة فلوس بسهولة.',
      icon: <ShieldCheck className="w-20 h-20 text-emerald-600" />,
      bg: 'bg-emerald-50'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setCurrentScreen('login');
    }
  };

  const handleSkip = () => {
    setCurrentScreen('login');
  };

  const slide = slides[currentSlide];

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white text-[#1F1F1F] flex flex-col justify-between p-6 animate-in fade-in duration-300">
      {/* Top Header: Logo + Skip */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xl font-black text-[#1D327B] flex items-center gap-1">
          <span>ترولي</span>
          <span className="text-[#EC6A62] text-sm font-bold">Troolly</span>
        </div>

        <button 
          onClick={handleSkip} 
          className="text-xs font-bold text-gray-500 hover:text-[#1D327B] bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer"
        >
          تخطي
        </button>
      </div>

      {/* Slide Illustration & Text */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 px-4">
        <div className={`w-36 h-36 rounded-3xl flex items-center justify-center shadow-inner ${slide.bg}`}>
          {slide.icon}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#1F1F1F]">{slide.title}</h2>
          <p className="text-sm font-medium text-gray-600 max-w-xs leading-relaxed">{slide.desc}</p>
        </div>
      </div>

      {/* Footer: Pagination dots & Next button */}
      <div className="space-y-6 pb-6">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-[#1D327B]' : 'w-2.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3.5 rounded-xl font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <span>{currentSlide === slides.length - 1 ? 'البدء الآن 🚀' : 'التالي'}</span>
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
