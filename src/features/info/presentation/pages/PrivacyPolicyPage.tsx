import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { setCurrentScreen } = useApp();

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
          <h1 className="text-base font-black text-[#1F1F1F]">سياسة الخصوصية</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        
        {/* Banner Card */}
        <div className="bg-[#1D327B] text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-white">سياسة الخصوصية</h2>
            <p className="text-xs text-white/80 font-medium">خصوصيتك وأمان بياناتك هي أولوية ترولي الأولى</p>
          </div>

          <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-black text-[#FF4441]">سياسة الخصوصية وحماية البيانات</h3>

          <p className="text-xs font-semibold text-gray-700 leading-relaxed text-justify">
            لديك <strong className="text-[#1D327B]">7 أيام</strong> من تاريخ إستلامك أي سلعة لإرجاعها او إستبدالها ، وتكاليف الشحن تكون من قبل المشتري ، بشرط أن يكون المنتج سليم وكرتون المنتج أيضا وجميع ملحقاته سليمة وبعد التحقق من ذلك سيتم ارجاع المبلغ خلال <strong className="text-[#1D327B]">14 يوم</strong> عمل او استبدال المنتج او تعويضه بمنتج آخر حسب رغبة العميل.
          </p>
        </div>

      </div>

    </div>
  );
};
