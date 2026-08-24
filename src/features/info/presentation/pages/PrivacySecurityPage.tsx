import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { ArrowRight, ShieldCheck, Trash2, Mail } from 'lucide-react';

export const PrivacySecurityPage: React.FC = () => {
  const { setCurrentScreen } = useApp();

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
          <h1 className="text-base font-black text-[#1F1F1F]">الخصوصية والأمان</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        
        {/* Delete Data Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4441]" />
            <h2 className="text-sm font-black text-[#FF4441]">. حذف البيانات .</h2>
          </div>

          <div className="space-y-3 text-xs font-semibold text-gray-700 leading-relaxed">
            <p>
              لطلب حذف بياناتك نهائياً من تطبيق ترولي <span className="font-extrabold text-[#1D327B]">Troolly</span> فضلاً قم بإرسال بريد إلكتروني من بريدك الإلكتروني المسجل في التطبيق بالطلب إلى بريدنا:
            </p>

            <a
              href="mailto:info@yemendirectory.net"
              className="block bg-blue-50 text-[#1D327B] font-mono text-center p-3 rounded-xl border border-blue-100 font-extrabold text-xs dir-ltr hover:bg-blue-100 transition-colors"
            >
              info@yemendirectory.net
            </a>

            <p className="text-gray-500 pt-1 font-medium">
              وبعد التحقق من صحة البيانات سيتم حذف بياناتك خلال <strong className="text-gray-800">24 ساعة</strong>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
