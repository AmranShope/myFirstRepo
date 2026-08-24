import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, RefreshCw, ShoppingCart, MapPin, Search, Server, Heart, AlertCircle, WifiOff, FileX } from 'lucide-react';

export const EmptyStatesView: React.FC = () => {
  const { setCurrentScreen, emptyStateType, setEmptyStateType, setAddressReturnScreen } = useApp();

  const states = [
    {
      id: 'no_data',
      tabLabel: 'لا بيانات',
      title: '!لا يوجد بيانات للعرض',
      subtitle: '',
      btnText: 'إعادة المحاولة',
      icon: <FileX className="w-16 h-16 text-[#1D327B]" />,
      action: () => setCurrentScreen('main')
    },
    {
      id: 'no_network',
      tabLabel: 'خطأ شبكة',
      title: '!حدث خطأ في الاتصال بالشبكة',
      subtitle: 'قم بإعادة المحاولة او قم بتأكد من الشبكة',
      btnText: 'إعادة المحاولة',
      icon: <WifiOff className="w-16 h-16 text-[#EC6A62]" />,
      action: () => setCurrentScreen('main')
    },
    {
      id: 'empty_cart',
      tabLabel: 'سلة فارغة',
      title: '!سلة التسوق فارغة',
      subtitle: '',
      btnText: 'تسوق الآن',
      icon: <ShoppingCart className="w-16 h-16 text-[#1D327B]" />,
      action: () => setCurrentScreen('main')
    },
    {
      id: 'no_addresses',
      tabLabel: 'لا عناوين',
      title: '!لا توجد عناوين مضافة',
      subtitle: '',
      btnText: '+ إضافة عنوان',
      icon: <MapPin className="w-16 h-16 text-[#1D327B]" />,
      action: () => {
        setAddressReturnScreen('addresses');
        setCurrentScreen('map_picker');
      }
    },
    {
      id: 'no_search',
      tabLabel: 'لا نتائج بحث',
      title: 'لا توجد نتائج لبحثك',
      subtitle: 'قم بإعادة المحاولة او قم بتأكد من الشبكة',
      btnText: 'إعادة المحاولة',
      icon: <Search className="w-16 h-16 text-[#1D327B]" />,
      action: () => setCurrentScreen('main')
    },
    {
      id: 'server_error',
      tabLabel: 'خطأ سيرفر',
      title: '!حدث خطأ في الاتصال بالسيرفر',
      subtitle: 'قم بإعادة المحاولة او قم بتأكد من الشبكة',
      btnText: 'إعادة المحاولة',
      icon: <Server className="w-16 h-16 text-amber-600" />,
      action: () => setCurrentScreen('main')
    },
    {
      id: 'no_favorites',
      tabLabel: 'مفضلة فارغة',
      title: '!المفضلة فارغة',
      subtitle: 'قم بإضافة المنتجات المفضلة إليك',
      btnText: '+ إضافة للمفضلة',
      icon: <Heart className="w-16 h-16 text-[#EC6A62]" />,
      action: () => setCurrentScreen('main')
    }
  ];

  const activeState = states.find(s => s.id === emptyStateType) || states[0];

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
          <h1 className="text-base font-black text-[#1F1F1F]">شاشات الحالات الفارغة (7 أنواع)</h1>
        </div>
      </div>

      {/* Tabs Selector Row for direct evaluation */}
      <div className="p-3 bg-white border-b border-gray-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {states.map(s => (
          <button
            key={s.id}
            onClick={() => setEmptyStateType(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 transition-all cursor-pointer ${
              emptyStateType === s.id
                ? 'bg-[#1D327B] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.tabLabel}
          </button>
        ))}
      </div>

      {/* Empty State Presentation */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5 my-auto">
        <div className="w-32 h-32 rounded-full bg-blue-50 border-2 border-dashed border-[#1D327B]/30 flex items-center justify-center shadow-inner">
          {activeState.icon}
        </div>

        <div className="space-y-1 max-w-xs">
          <h2 className="text-lg font-black text-[#1F1F1F]">{activeState.title}</h2>
          {activeState.subtitle && (
            <p className="text-xs font-medium text-gray-500">{activeState.subtitle}</p>
          )}
        </div>

        <button
          onClick={activeState.action}
          className="bg-[#1D327B] hover:bg-[#2843a0] text-white py-3 px-8 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{activeState.btnText}</span>
        </button>
      </div>

      <div className="p-4" />
    </div>
  );
};
