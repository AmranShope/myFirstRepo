export interface PhoneValidationResult {
  isValid: boolean;
  formattedInternational?: string; // e.g. +967777777777
  cleanLocal?: string; // e.g. 777777777
  errorMessage?: string;
}

/**
 * Validates Yemeni phone numbers according to national telecom numbering plan:
 * - 9 digits total
 * - Valid mobile prefixes: 70 (Y), 71 (Sabafon), 73 (YOU), 77 (Yemen Mobile), 78 (Yemen Mobile)
 */
export function validateYemeniPhoneNumber(input: string): PhoneValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      errorMessage: 'يرجى إدخال رقم الهاتف'
    };
  }

  // Remove spaces, hyphens, and parentheses
  let cleaned = input.trim().replace(/[\s\-\(\)]/g, '');
  
  // Extract only digits
  let digits = cleaned.replace(/\D/g, '');

  // Handle +967 / 00967 / 967 prefix if user typed it inside the input
  if (digits.startsWith('00967')) {
    digits = digits.substring(5);
  } else if (digits.startsWith('967')) {
    digits = digits.substring(3);
  }

  // Remove leading 0 (e.g., 0777777777 -> 777777777)
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  if (digits.length === 0) {
    return {
      isValid: false,
      errorMessage: 'يرجى إدخال أرقام صالحة'
    };
  }

  // Check if starts with 7 (all Yemeni mobile networks)
  if (!digits.startsWith('7')) {
    return {
      isValid: false,
      errorMessage: 'رقم الهاتف غير صحيح. يجب أن يكون رقماً يمنياً يبدأ بـ 7 (مثل 77 أو 73 أو 71 أو 70 أو 78)'
    };
  }

  // Check length
  if (digits.length < 9) {
    return {
      isValid: false,
      errorMessage: `رقم الهاتف غير مكتمل (${digits.length} أرقام من أصل 9 أرقام مطلوبة)`
    };
  }

  if (digits.length > 9) {
    return {
      isValid: false,
      errorMessage: `رقم الهاتف يحتوي على أرقام زائدة (${digits.length} أرقام - المطلوب 9 أرقام فقط)`
    };
  }

  // Validate exact company prefixes
  const validPrefixes = ['70', '71', '73', '77', '78'];
  const prefix = digits.substring(0, 2);
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      errorMessage: `مفتاح شبكة الهاتف (${prefix}) غير معروف في اليمن. المفاتيح الصالحة هي: 77, 73, 71, 70, 78`
    };
  }

  return {
    isValid: true,
    cleanLocal: digits,
    formattedInternational: `+967${digits}`
  };
}

/**
 * Translates Firebase Auth error codes to user-friendly Arabic messages
 */
export function getFirebaseAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  const message = error?.message || '';

  switch (code) {
    case 'auth/invalid-phone-number':
      return 'رقم الهاتف غير صالح في نظام المصادقة. يرجى التأكد من صحة الرقم ومفتاح الدولة.';
    case 'auth/missing-phone-number':
      return 'يرجى إدخال رقم هاتف صحيح.';
    case 'auth/quota-exceeded':
      return 'تم استنفاد الحصة المخصصة لرسائل SMS على Firebase. للاختبار استخدم رقم الاختبار 777777777.';
    case 'auth/too-many-requests':
      return 'تم حظر الطلبات مؤقتاً بسبب محاولات متكررة غير ناجحة. يرجى الانتظار بضع دقائق والمحاولة مجدداً.';
    case 'auth/captcha-check-failed':
      return 'فشل التحقق الأمني (reCAPTCHA). يرجى تحديث الصفحة والمحاولة مرة أخرى.';
    case 'auth/invalid-app-credential':
      return 'خدمة التحقق عبر الهاتف غير مهيأة بشكل كامل في Firebase Console أو تم رفض مفتاح التحقق.';
    case 'auth/app-not-authorized':
      return 'نطاق الموقع غير مصرح به في Firebase Console. أضف النطاق في Authorized Domains.';
    case 'auth/network-request-failed':
      return 'تعذر الاتصال بالخادم. يرجى التأكد من اتصالك بالإنترنت.';
    case 'auth/invalid-verification-code':
      return 'كود التحقق (OTP) غير صحيح. يرجى التأكد من الأرقام وإعادة المحاولة.';
    case 'auth/code-expired':
      return 'انتهت صلاحية كود التحقق. يرجى طلب كود جديد.';
    case 'auth/session-expired':
      return 'انتهت صلاحية جلسة التحقق. يرجى العودة لشاشة تسجيل الدخول وطلب كود جديد.';
    case 'auth/user-disabled':
      return 'تم تعطيل هذا الحساب من قِبل إدارة المتجر.';
    default:
      if (message && message.includes('reCAPTCHA')) {
        return 'فشل اختبار reCAPTCHA الأمني. يرجى التأكد من اتصال الإنترنت وتحديث الصفحة.';
      }
      return error?.message || 'حدث خطأ أثناء الاتصال بخدمة المصادقة. يرجى المحاولة لاحقاً.';
  }
}
