import React, { useState, useEffect } from 'react';

export const BannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [
    {
      id: 'b1',
      title: 'الطعم الالذ مع\nطحينية الحلواني',
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
      bgGrad: 'from-stone-950 via-stone-900 to-neutral-900'
    },
    {
      id: 'b2',
      title: 'عروض الخضروات\nوالفواكه الطازجة',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
      bgGrad: 'from-emerald-950 via-emerald-900 to-green-950'
    },
    {
      id: 'b3',
      title: 'أفضل الأجبان\nوالألبان البلادية',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
      bgGrad: 'from-[#031527] via-[#0A2540] to-[#143B66]'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const leftIndex = (currentIndex - 1 + banners.length) % banners.length;
  const rightIndex = (currentIndex + 1) % banners.length;
  const currBanner = banners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden my-3 py-1">
      {/* 3 Visible Banner Cards Row */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 px-1 w-full">
        
        {/* Left Peeking Card */}
        <div 
          onClick={() => setCurrentIndex(leftIndex)}
          className="w-[9%] sm:w-[11%] h-36 sm:h-44 rounded-2xl overflow-hidden relative shadow-md shrink-0 cursor-pointer border border-white/10 opacity-95 transition-all hover:opacity-100"
        >
          <img
            src={banners[leftIndex].image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${banners[leftIndex].bgGrad} opacity-85 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Center Main Card */}
        <div 
          className="flex-1 max-w-[78%] sm:max-w-[80%] h-40 sm:h-48 rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-lg shrink-0 border border-white/10 transition-all duration-300"
        >
          <img
            src={currBanner.image}
            alt={currBanner.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${currBanner.bgGrad} opacity-75 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-black/30" />

          {/* Banner Text Content */}
          <div className="absolute inset-y-0 left-0 w-[62%] sm:w-[60%] p-4 sm:p-5 flex flex-col justify-center text-right z-10">
            <h2 className="text-sm sm:text-base md:text-lg font-black text-white leading-relaxed drop-shadow-md whitespace-pre-line">
              {currBanner.title}
            </h2>
          </div>
        </div>

        {/* Right Peeking Card */}
        <div 
          onClick={() => setCurrentIndex(rightIndex)}
          className="w-[9%] sm:w-[11%] h-36 sm:h-44 rounded-2xl overflow-hidden relative shadow-md shrink-0 cursor-pointer border border-white/10 opacity-95 transition-all hover:opacity-100"
        >
          <img
            src={banners[rightIndex].image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${banners[rightIndex].bgGrad} opacity-85 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-black/20" />
        </div>

      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-6 bg-[#EC6A62]' : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
