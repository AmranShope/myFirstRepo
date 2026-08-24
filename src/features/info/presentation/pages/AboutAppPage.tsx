import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { ArrowRight, Phone, MessageCircle, Mail, Share2, Star, Youtube, Facebook, Twitter, Instagram, ChevronLeft } from 'lucide-react';

export const AboutAppPage: React.FC = () => {
  const { setCurrentScreen, setActiveDialog, showToast } = useApp();

  const contactLinks = [
    { label: 'الهاتف', icon: <Phone className="w-5 h-5 text-[#1D327B]" />, action: () => window.open('tel:+967777777777') },
    { label: 'يوتيوب', icon: <Youtube className="w-5 h-5 text-[#1D327B]" />, action: () => showToast('فتح القناة الرسمية على يوتيوب 🔴') },
    { label: 'فيسبوك', icon: <Facebook className="w-5 h-5 text-[#1D327B]" />, action: () => showToast('فتح الصفحة الرسمية على فيسبوك 🟦') },
    { label: 'تويتر', icon: <Twitter className="w-5 h-5 text-[#1D327B]" />, action: () => showToast('فتح حساب ترولي على منصة X 🐦') },
    { label: 'انستجرام', icon: <Instagram className="w-5 h-5 text-[#1D327B]" />, action: () => showToast('فتح الحساب الرسمي على انستجرام 📸') },
    { label: 'تيك توك', icon: <span className="text-base font-black text-[#1D327B]">🎵</span>, action: () => showToast('فتح حساب ترولي على تيك توك 🎶') },
    { label: 'سناب شات', icon: <span className="text-base font-black text-[#1D327B]">👻</span>, action: () => showToast('فتح الحساب على سناب شات 👻') },
    { label: 'الواتساب', icon: <MessageCircle className="w-5 h-5 text-[#1D327B]" />, action: () => window.open('https://wa.me/967777777777') },
    { label: 'البريد الإلكتروني', icon: <Mail className="w-5 h-5 text-[#1D327B]" />, action: () => window.open('mailto:info.troolly@gmail.com') }
  ];

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('about_us')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-[#1F1F1F]">عن التطبيق</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        
        {/* App Info Hero Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs text-center space-y-3">
          <div className="flex items-center justify-between border-b pb-3 border-gray-100">
            <div className="text-right">
              <p className="text-xs font-black text-gray-700 max-w-xs leading-relaxed">
                متجر إلكتروني لبيع المنتجات بكافة انواعها بجودة عالية وتوصيلها الى المنازل
              </p>
            </div>

            <div className="text-left shrink-0 pl-2">
              <div className="text-2xl font-black text-[#1D327B] flex items-center gap-1">
                <span>ترولي</span>
                <span className="text-[#EC6A62] text-lg font-bold">Troolly</span>
              </div>
              <span className="text-[11px] font-bold text-gray-400 block dir-ltr">الإصدار 2.0.0.1</span>
            </div>
          </div>
        </div>

        {/* Contact Links */}
        <div className="space-y-2">
          <h2 className="text-xs font-black text-[#FF4441] pr-1">اتصل بنا على</h2>

          <div className="space-y-2">
            {contactLinks.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all shadow-2xs flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-50 rounded-xl">
                    {item.icon}
                  </div>
                  <span className="text-xs font-black text-[#1F1F1F]">{item.label}</span>
                </div>

                <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#1D327B] transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Troolly Actions */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-black text-[#FF4441] pr-1">ترولي</h2>

          <div className="space-y-2">
            <button
              onClick={() => setActiveDialog('share_app')}
              className="w-full bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all shadow-2xs flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 rounded-xl">
                  <Share2 className="w-5 h-5 text-[#1D327B]" />
                </div>
                <span className="text-xs font-black text-[#1F1F1F]">مشاركة التطبيق</span>
              </div>

              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#1D327B] transition-colors" />
            </button>

            <button
              onClick={() => setActiveDialog('rate_order')}
              className="w-full bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all shadow-2xs flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-amber-50 rounded-xl">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-xs font-black text-[#1F1F1F]">تقييم التطبيق</span>
              </div>

              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#1D327B] transition-colors" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
