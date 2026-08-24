import React, { useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';

export const SplashPage: React.FC = () => {
  const { setCurrentScreen } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [setCurrentScreen]);

  return (
    <div 
      onClick={() => setCurrentScreen('onboarding')}
      className="w-full max-w-md mx-auto min-h-screen bg-[#1D327B] text-white flex flex-col items-center justify-between p-8 cursor-pointer select-none animate-in fade-in duration-300"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
        {/* Big Troolly Branding Logo */}
        <div className="relative">
          <div className="text-5xl font-black tracking-tighter text-white flex items-center gap-1.5">
            <span>ترولي</span>
            <span className="text-[#EC6A62] text-3xl font-bold">Troolly</span>
            <span className="text-xs font-semibold text-white/60 self-start">TM</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-lg font-bold text-white/90 pt-10">
          استمتع بخصومات حصرية
        </p>
      </div>

      {/* Footer subtle hint */}
      <div className="text-center text-xs text-white/60 pb-4 animate-pulse font-medium">
        اضغط في أي مكان للمتابعة ←
      </div>
    </div>
  );
};
