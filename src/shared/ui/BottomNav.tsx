import React from 'react';
import { Home, LayoutGrid, Tag, Heart, MoreHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, favorites } = useApp();

  const tabs: { id: MainTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'categories', label: 'جميع الفئات', icon: LayoutGrid },
    { id: 'offers', label: 'العروض', icon: Tag },
    { id: 'favorites', label: 'المفضلة', icon: Heart, badge: favorites.length },
    { id: 'more', label: 'المزيد', icon: MoreHorizontal }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white text-gray-500 h-[72px] border-t border-gray-200/80 shadow-lg flex items-center justify-around px-2 w-full max-w-md mx-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center w-full h-full relative transition-all duration-200"
          >
            <div className={`p-1.5 rounded-2xl transition-all ${
              isActive ? 'bg-[#1D327B] text-white shadow-xs' : 'text-gray-400 hover:text-gray-700'
            }`}>
              <Icon className="w-5 h-5" />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute top-1.5 right-3 bg-[#EC6A62] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {tab.badge}
                </span>
              ) : null}
            </div>

            <span className={`text-[11px] font-black mt-0.5 ${
              isActive ? 'text-[#1D327B]' : 'text-gray-400'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
