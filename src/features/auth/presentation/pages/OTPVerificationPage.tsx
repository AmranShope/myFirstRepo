import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { RefreshCw, ArrowRight, Loader2, KeyRound, AlertCircle } from 'lucide-react';

export const OTPVerificationPage: React.FC = () => {
  const { setCurrentScreen, pendingPhone, setUser, setIsGuest, showToast, reloadUserCart } = useApp();
  const { verifyOtp, sendOtp, loading, error, setError } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(60);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    if (error) setError(null);

    const cleanChar = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);

    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (error) setError(null);
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('').trim();

    if (fullCode.length < 6) {
      setError('يرجى إدخال كود التحقق المكون من 6 أرقام كاملاً');
      return;
    }

    const res = await verifyOtp(fullCode, pendingPhone);

    if (res.success && res.data) {
      const userData = res.data as any;
      setIsGuest(false);
      setUser(userData);
      localStorage.setItem('troolly_user_session', JSON.stringify(userData));
      if (userData.id) {
        await reloadUserCart(userData.id);
      }
      setCurrentScreen('main');
      showToast('تم تسجيل الدخول وتأكيد الحساب بنجاح! 🛒🌟');
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) return;
    setResending(true);
    setError(null);
    const res = await sendOtp(pendingPhone);
    setResending(false);
    if (res.success) {
      setSeconds(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      showToast('تمت إعادة إرسال كود التحقق بنجاح');
    }
  };

  const fillTestOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    if (error) setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-between p-6 animate-in fade-in duration-300">
      
      {/* Top Navigation */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('login')}
          className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-2xs transition-colors"
          title="العودة لشاشة الدخول"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <span className="font-extrabold text-sm text-[#1D327B]">تأكيد كود التحقق</span>
      </div>

      {/* Main Content */}
      <form onSubmit={handleVerify} className="space-y-5 my-auto text-center px-1">
        
        <div className="w-14 h-14 bg-[#1D327B]/10 text-[#1D327B] rounded-2xl flex items-center justify-center mx-auto mb-1">
          <KeyRound className="w-7 h-7 text-[#1D327B]" />
        </div>

        <div className="space-y-1.5">
          <p className="text-base sm:text-lg font-black text-[#1F1F1F] leading-snug">
            أدخل كود التحقق (OTP)
          </p>
          <p className="text-xs font-semibold text-gray-500">
            تم إرسال رمز الأمان المكون من 6 أرقام إلى <span className="dir-ltr inline-block font-mono text-[#1D327B] font-bold">{pendingPhone}</span>
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-200 flex items-start gap-2 text-right animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* 6 OTP Input digit boxes */}
        <div className="flex items-center justify-center gap-2 dir-ltr py-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={el => { inputRefs.current[idx] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              disabled={loading}
              className={`w-11 h-13 sm:w-12 sm:h-14 bg-white border ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-300'} rounded-xl text-center font-black text-xl text-[#1D327B] focus:border-[#1D327B] focus:ring-2 focus:ring-[#1D327B]/20 outline-none shadow-xs transition-all`}
            />
          ))}
        </div>

        {/* Countdown & Resend */}
        <div className="text-xs font-bold text-gray-500 flex items-center justify-center gap-2">
          {seconds > 0 ? (
            <span>ينتهي الرمز خلال <strong className="text-[#1D327B] font-mono dir-ltr inline-block">{formatTime(seconds)}</strong></span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-[#1D327B] hover:text-[#2843a0] flex items-center gap-1.5 font-bold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>إعادة إرسال كود التحقق</span>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1D327B] hover:bg-[#2843a0] disabled:opacity-60 text-white py-3.5 px-4 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جارٍ التحقق وتأكيد الجلسة...</span>
            </>
          ) : (
            <span>تأكيد الحساب ومتابعة التسوق</span>
          )}
        </button>
      </form>

      {/* Helper test code hint */}
      <div className="pb-4 flex items-center justify-center gap-2 text-center text-[11px] text-gray-400 font-medium">
        <span>لرقم الاختبار (777777777) الكود هو <strong className="font-mono text-gray-600">123456</strong></span>
        <button
          type="button"
          onClick={fillTestOtp}
          className="text-[#1D327B] font-bold underline hover:text-[#2843a0]"
        >
          تعبئة الكود
        </button>
      </div>
    </div>
  );
};
