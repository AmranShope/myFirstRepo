import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { useProfile } from '../hooks/useProfile';
import { ArrowRight, Camera, User, LogIn, Check, ShieldCheck, Mail, MapPin } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { setCurrentScreen, user } = useApp();
  const { isSaving, saveProfile } = useProfile();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone?.replace('+967', '').trim() || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.city || 'صنعاء');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({
      name,
      phone: phone ? `+967 ${phone.trim()}` : user?.phone,
      email,
      city
    });
  };

  return (
    <div id="profile-page-container" className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            id="profile-back-btn"
            onClick={() => setCurrentScreen('main')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            aria-label="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-[#1F1F1F]">الملف الشخصي</h1>
        </div>
      </div>

      {!user ? (
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 text-[#1D327B] rounded-full flex items-center justify-center text-3xl shadow-inner border border-blue-100">
            👤
          </div>
          <h2 className="text-lg font-black text-[#1F1F1F]">لم تسجل الدخول بعد</h2>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium">
            أنت تتصفح كزائر. يرجى تسجيل الدخول لعرض وتحديث بيانات ملفك الشخصي وعناوينك ومتابعة طلباتك.
          </p>
          <button
            id="profile-login-btn"
            onClick={() => setCurrentScreen('login')}
            className="bg-[#1D327B] hover:bg-[#15255e] text-white px-6 py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول / إنشاء حساب</span>
          </button>
        </div>
      ) : (
        /* Body Form */
        <form onSubmit={handleSave} className="p-4 space-y-4 flex-1 pb-16">
          
          {/* Upload Avatar Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 text-center space-y-3 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 block">- الصورة الشخصية</span>
            
            <div className="relative w-28 h-28 mx-auto">
              <div className="w-28 h-28 rounded-2xl bg-gray-50 border-2 border-dashed border-[#1D327B]/40 flex items-center justify-center overflow-hidden shadow-inner">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-[#1D327B]" />
                )}
              </div>

              <button
                type="button"
                className="absolute -bottom-1 -left-1 bg-[#1D327B] text-white p-2 rounded-full shadow-md hover:bg-[#2843a0] cursor-pointer"
                title="تغيير الصورة"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            {/* Name */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">الاسم الكامل:</label>
              <input
                id="profile-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك الكريم"
                required
                className="w-full text-sm font-black text-[#1F1F1F] bg-transparent outline-none"
              />
            </div>

            {/* Phone */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-500 block mb-1">رقم الموبايل:</label>
                <input
                  id="profile-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="7xxxxxxxx"
                  required
                  className="w-full text-sm font-black text-[#1F1F1F] bg-transparent outline-none dir-ltr text-right"
                />
              </div>
              <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-extrabold text-gray-600 dir-ltr">
                +967
              </span>
            </div>

            {/* Email */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">البريد الإلكتروني (اختياري):</label>
              <input
                id="profile-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-sm font-black text-[#1F1F1F] bg-transparent outline-none dir-ltr text-right"
              />
            </div>

            {/* City */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">المدينة:</label>
              <input
                id="profile-city-input"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: صنعاء، عدن، تعز"
                required
                className="w-full text-sm font-black text-[#1F1F1F] bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="profile-save-btn"
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#1D327B] hover:bg-[#2843a0] disabled:opacity-60 text-white py-3.5 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all text-center mt-6 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSaving ? 'جارٍ الحفظ في السحابة...' : 'حفظ التعديلات'}
          </button>
        </form>
      )}

    </div>
  );
};
