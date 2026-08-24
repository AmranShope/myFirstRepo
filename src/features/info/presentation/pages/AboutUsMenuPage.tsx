import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { ArrowRight, Info, RotateCcw, Shield, ChevronLeft } from 'lucide-react';

export const AboutUsMenuPage: React.FC = () => {
  const { setCurrentScreen } = useApp();

  const menuItems = [
    {
      id: 'about_app',
      label: 'عن التطبيق',
      icon: <Info className="w-5 h-5 text-[#1D327B]" />,
      screen: 'about_app'
    },
    {
      id: 'return_policy',
      label: 'سياسة الاسترجاع',
      icon: <RotateCcw className="w-5 h-5 text-[#1D327B]" />,
      screen: 'return_policy'
    },
    {
      id: 'privacy_policy',
      label: 'سياسة الخصوصية',
      icon: <Shield className="w-5 h-5 text-[#1D327B]" />,
      screen: 'privacy_policy'
    }
  ];

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
          <h1 className="text-base font-black text-[#1F1F1F]">من نحن</h1>
        </div>
      </div>

      <div className="p-4 space-y-2.5 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.screen)}
            className="w-full bg-white p-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all shadow-2xs flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                {item.icon}
              </div>
              <span className="text-sm font-black text-[#1F1F1F]">{item.label}</span>
            </div>

            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#1D327B] group-hover:-translate-x-1 transition-all" />
          </button>
        ))}
      </div>

    </div>
  );
};
