import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div 
      id="global-offline-banner" 
      className="w-full bg-[#EC6A62] text-white px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-between shadow-md z-50 sticky top-0 animate-in slide-in-from-top duration-300"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
        <span>لا يوجد اتصال بالإنترنت. البيانات المعروضة من الذاكرة المؤقتة.</span>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg text-xs transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3 h-3" />
        <span>إعادة المحاولة</span>
      </button>
    </div>
  );
};
