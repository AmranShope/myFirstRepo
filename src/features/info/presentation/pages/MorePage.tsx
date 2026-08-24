import React, { useState } from 'react';
import { 
  User, MapPin, Package, Award, ShieldCheck, 
  Globe, LogOut, LogIn, ChevronLeft, Info, FileX, Ticket, Pencil,
  Database, RefreshCw, CheckCircle2
} from 'lucide-react';
import { useApp } from '../../../../context/AppContext';
import { CatalogRepositoryImpl } from '../../../catalog/data/repositories/catalog.repository.impl';

const catalogRepo = new CatalogRepositoryImpl();
const ADMIN_UID = '34nLmHXwsUfz7U1heSv7LTxMgYt1';

export const MorePage: React.FC = () => {
  const { 
    user, 
    isGuest,
    setCurrentScreen, 
    setActiveDialog, 
    showToast 
  } = useApp();

  const isAdmin = user?.id === ADMIN_UID;

  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const handleSeedCatalog = async () => {
    if (!isAdmin) {
      showToast('عذراً، هذا الإجراء مخصص لحساب الإدارة المصرح له فقط.');
      return;
    }

    setIsSeeding(true);
    setSeedSuccess(null);
    try {
      const result = await catalogRepo.seedCatalog();
      const msg = `تمت المزامنة بنجاح! تم رفع ${result.seededCategories} أقسام و ${result.seededProducts} منتجاً إلى Firestore`;
      setSeedSuccess(msg);
      showToast(msg);
    } catch (err: any) {
      console.error(err);
      showToast('حدث خطأ أثناء المزامنة مع Firestore. يرجى التأكد من الصلاحيات والاتصال.');
    } finally {
      setIsSeeding(false);
    }
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    showToast(nextLang === 'en' ? 'App language changed to English (RTL layout maintained)' : 'تم تغيير لغة التطبيق إلى العربية');
  };

  const menuItems = [
    {
      id: 'profile',
      label: 'الملف الشخصي',
      icon: <User className="w-5 h-5 text-[#1D327B]" />,
      action: () => setCurrentScreen(user ? 'profile' : 'login')
    },
    {
      id: 'addresses',
      label: 'عناويني',
      icon: <MapPin className="w-5 h-5 text-[#1D327B]" />,
      action: () => setCurrentScreen('addresses')
    },
    {
      id: 'my_orders',
      label: 'طلباتي',
      icon: <Package className="w-5 h-5 text-[#1D327B]" />,
      action: () => setCurrentScreen('my_orders')
    },
    {
      id: 'loyalty',
      label: 'نقاط ولاء العملاء',
      icon: <Award className="w-5 h-5 text-[#1D327B]" />,
      action: () => setCurrentScreen('loyalty'),
      extra: user && user.loyaltyPoints > 0 ? (
        <span className="text-xs font-black bg-blue-50 text-[#1D327B] px-2 py-0.5 rounded-full border border-blue-100">
          {user.loyaltyPoints} نقطة
        </span>
      ) : undefined
    },
    {
      id: 'coupons',
      label: 'كوبونات الخصم',
      icon: <Ticket className="w-5 h-5 text-[#1D327B]" />,
      action: () => setCurrentScreen('coupons')
    },
    {
      id: 'lang',
      label: 'تغير لغة التطبيق',
      icon: <Globe className="w-5 h-5 text-[#1D327B]" />,
      action: toggleLanguage,
      extra: <span className="text-xs font-bold text-gray-500">{lang === 'ar' ? 'العربية' : 'English'}</span>
    },
    {
      id: 'privacy',
      label: 'الخصوصية والأمان',
      icon: <ShieldCheck className="w-5 h-5 text-[#1D327B]" />,
      action: () => setCurrentScreen('privacy_security')
    },
    {
      id: 'about',
      label: 'من نحن',
      icon: <Info className="w-5 h-5 text-[#1D327B]" />,
      action: () => setCurrentScreen('about_us')
    },
    {
      id: 'empty_states',
      label: 'استعراض الحالات الفارغة (7 شاشات)',
      icon: <FileX className="w-5 h-5 text-[#1D327B]" />,
      action: () => setCurrentScreen('empty_states')
    }
  ];

  return (
    <div className="pb-28 max-w-md w-full mx-auto animate-in fade-in duration-200">
      
      {/* Top Header Light Background Area */}
      <div className="bg-[#EEF2F6] pt-12 pb-14 px-4 relative flex flex-col items-center">
        {/* Centered Circular Profile Avatar */}
        <div 
          onClick={() => setCurrentScreen(user ? 'profile' : 'login')}
          className="absolute -bottom-12 sm:-bottom-14 left-1/2 -translate-x-1/2 cursor-pointer group z-20"
        >
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'المستخدم'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#1D327B] bg-white shadow-xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-50 border-2 border-[#1D327B] flex items-center justify-center text-4xl group-hover:scale-105 transition-transform shadow-xs">
                👤
              </div>
            )}
            {user && (
              <button 
                type="button"
                className="absolute bottom-1 left-0 bg-[#E0E7FF] text-[#1D327B] p-2 rounded-full border-2 border-white shadow-2xs hover:bg-indigo-100 transition-colors cursor-pointer"
                title="تعديل الملف الشخصي"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Card with Top Curved Arch */}
      <div className="bg-white rounded-t-[44px] pt-16 sm:pt-18 px-5 pb-6 space-y-4 shadow-sm min-h-[500px] relative z-10">
        
        {/* User Name or Guest Banner */}
        {user ? (
          <div className="text-center mb-3 mt-1 space-y-1">
            <h2 className="font-black text-lg text-[#1F1F1F]">
              {user.name || 'عميل ترولي'}
            </h2>
            <p className="text-xs text-gray-500 font-semibold" dir="ltr">
              {user.phone}
            </p>
          </div>
        ) : (
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-center space-y-2 mb-3 mt-1">
            <h2 className="font-black text-base text-[#1D327B]">
              أنت تتصفح كزائر
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
              سجل دخولك الآن لحفظ عناوين التوصيل، تتبع طلباتك السابقة، وجمع نقاط الولاء!
            </p>
            <button
              onClick={() => setCurrentScreen('login')}
              className="bg-[#1D327B] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول / إنشاء حساب</span>
            </button>
          </div>
        )}

        {/* Menu Options List */}
        <div className="divide-y divide-gray-100">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full py-3.5 px-1 flex items-center justify-between hover:bg-gray-50/80 rounded-xl transition-colors text-right group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#1D327B]">
                  {item.icon}
                </span>
                <span className="text-sm font-bold text-[#1F1F1F] group-hover:text-[#1D327B] transition-colors">{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.extra}
                <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#1D327B] transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* Firebase Firestore Sync / Admin Controls */}
        {isAdmin && (
          <div className="bg-gradient-to-l from-slate-50 to-blue-50/50 p-4 rounded-2xl border border-blue-100/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#1D327B]" />
                <span className="text-xs font-black text-[#1D327B]">مزامنة قاعدة البيانات (لوحة الإدارة)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                أدمن مصرح
              </span>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              رفع ومزامنة جميع الأقسام والمنتجات وسلال التوفير إلى مجموعات Firestore مباشرة بضغطة زر واحدة.
            </p>

            <button
              id="seed-catalog-btn"
              disabled={isSeeding}
              onClick={handleSeedCatalog}
              className="w-full bg-[#1D327B] hover:bg-[#15245a] text-white py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-60 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'جارٍ رفع المنتجات لقاعدة البيانات...' : 'رفع ومزامنة المنتجات مع Firebase الآن'}</span>
            </button>

            {seedSuccess && (
              <div className="flex items-start gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-bold">{seedSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* Logout / Login Action Button */}
        <div>
          {user ? (
            <button
              onClick={() => setActiveDialog('logout')}
              className="w-full py-3.5 px-1 flex items-center justify-between hover:bg-red-50/80 rounded-xl transition-colors text-right group mt-1 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-red-600">
                  <LogOut className="w-5 h-5" />
                </span>
                <span className="text-sm font-bold text-red-600">تسجيل الخروج</span>
              </div>

              <ChevronLeft className="w-4 h-4 text-red-400" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentScreen('login')}
              className="w-full py-3.5 px-1 flex items-center justify-between hover:bg-blue-50/80 rounded-xl transition-colors text-right group mt-1 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#1D327B]">
                  <LogIn className="w-5 h-5" />
                </span>
                <span className="text-sm font-bold text-[#1D327B]">تسجيل الدخول</span>
              </div>

              <ChevronLeft className="w-4 h-4 text-[#1D327B]" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
