import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { RecaptchaContainer } from '../components/RecaptchaContainer';
import { Smartphone, Loader2, Info, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setCurrentScreen, setIsGuest, setPendingPhone } = useApp();
  const { sendOtp, loading, error, setError, validatePhone } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('777777777');

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    if (error) setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validate Phone via pure domain use case
    const validation = validatePhone(phoneNumber);
    if (!validation.isValid) {
      setError(validation.errorMessage || 'يرجى إدخال رقم هاتف يمني صحيح');
      return;
    }

    // 2. Execute Send OTP Use Case
    const res = await sendOtp(phoneNumber);

    if (res.success && validation.formattedInternational) {
      setPendingPhone(validation.formattedInternational);
      localStorage.setItem('troolly_pending_phone', validation.formattedInternational);
      setCurrentScreen('otp');
    }
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    setCurrentScreen('main');
  };

  const fillTestNumber = () => {
    setPhoneNumber('777777777');
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-between p-6 animate-in fade-in duration-300">
      
      {/* Top Brand Banner */}
      <div className="pt-8 text-center space-y-3">
        <div className="inline-block relative">
          <div className="text-4xl sm:text-5xl font-black tracking-tighter text-[#1D327B] flex items-center justify-center gap-1.5">
            <span>ترولي</span>
            <span className="text-[#EC6A62] text-3xl font-bold">Troolly</span>
            <span className="text-xs font-bold text-gray-400 self-start">TM</span>
          </div>
        </div>

        <div className="space-y-1 pt-4">
          <h1 className="text-2xl font-black text-[#1F1F1F]">أهلاً بك !</h1>
          <p className="text-xs font-semibold text-gray-500">سجل رقم هاتفك اليمني للتحقق والمتابعة</p>
        </div>
      </div>

      {/* reCAPTCHA Container Component */}
      <RecaptchaContainer />

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit} className="space-y-4 my-auto">
        
        {/* Test Number Notification Badge */}
        <div className="bg-amber-50/90 border border-amber-200/80 p-3 rounded-2xl flex items-start justify-between gap-2.5 text-right">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] font-medium text-amber-900 leading-relaxed">
              <span className="font-extrabold text-amber-950 block mb-0.5">رقم هاتف تجريبي للاختبار:</span>
              رقم الهاتف: <strong className="font-mono text-xs font-bold">777777777</strong> | كود التحقق: <strong className="font-mono text-xs font-bold">123456</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={fillTestNumber}
            className="text-[11px] font-bold text-[#1D327B] hover:underline bg-white px-2 py-1 rounded-lg border border-amber-200 shrink-0"
          >
            تعبئة الرقم
          </button>
        </div>

        {/* Error message alert */}
        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-200 flex items-start gap-2.5 animate-in fade-in duration-200 text-right">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Phone Input Box with +967 prefix */}
        <div className="space-y-1">
          <label className="block text-xs font-extrabold text-gray-600 text-right px-1">
            رقم الهاتف اليمني (9 أرقام تبدأ بـ 7)
          </label>
          <div className={`bg-white p-2.5 rounded-2xl border ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} shadow-xs flex flex-row-reverse items-center gap-2 dir-ltr transition-all`}>
            <div className="bg-gray-100 text-gray-700 font-extrabold text-sm px-3 py-2 rounded-xl shrink-0 dir-ltr select-none">
              +967
            </div>

            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneInputChange}
              placeholder="مثال: 771234567"
              required
              disabled={loading}
              className="w-full text-base font-black text-[#1F1F1F] placeholder:text-gray-400 bg-transparent outline-none dir-ltr text-left"
            />

            <Smartphone className="w-5 h-5 text-gray-400 shrink-0 mr-1" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1D327B] hover:bg-[#2843a0] disabled:opacity-60 text-white py-3.5 px-4 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all text-center flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جارٍ إرسال كود التحقق...</span>
            </>
          ) : (
            <span>إرسال كود التحقق (OTP)</span>
          )}
        </button>

        {/* Divider */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <span className="relative bg-[#F1F3F6] px-4 text-xs font-bold text-gray-500">أو</span>
        </div>

        {/* Guest Login */}
        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full bg-white hover:bg-gray-50 text-[#1D327B] py-3.5 px-4 rounded-xl font-extrabold text-sm border border-gray-300 shadow-2xs transition-all text-center"
        >
          الدخول كزائر
        </button>
      </form>

      {/* Footer Trust Note */}
      <div className="text-center text-[11px] text-gray-400 pb-4 font-medium">
        يتم إرسال كود التحقق بأمان مشفر عبر خوادم Google Firebase
      </div>
    </div>
  );
};
