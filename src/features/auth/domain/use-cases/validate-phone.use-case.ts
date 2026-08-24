import { PhoneValidationResult } from '../entities/user.entity';

/**
 * Pure Domain Use Case: Validates Yemeni mobile numbers
 * - Must be 9 digits total
 * - Must start with valid telecom operator prefixes: 70, 71, 73, 77, 78
 */
export class ValidateYemeniPhoneUseCase {
  execute(input: string): PhoneValidationResult {
    if (!input || !input.trim()) {
      return {
        isValid: false,
        errorMessage: 'يرجى إدخال رقم الهاتف'
      };
    }

    // Clean formatting characters
    let cleaned = input.trim().replace(/[\s\-\(\)]/g, '');
    let digits = cleaned.replace(/\D/g, '');

    // Strip +967 or 00967 or 967 if included inside the input
    if (digits.startsWith('00967')) {
      digits = digits.substring(5);
    } else if (digits.startsWith('967')) {
      digits = digits.substring(3);
    }

    // Strip leading 0 (e.g. 0777777777 -> 777777777)
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }

    if (digits.length === 0) {
      return {
        isValid: false,
        errorMessage: 'يرجى إدخال أرقام صالحة'
      };
    }

    if (!digits.startsWith('7')) {
      return {
        isValid: false,
        errorMessage: 'رقم الهاتف غير صحيح. يجب أن يكون رقماً يمنياً يبدأ بـ 7 (مثل 77 أو 73 أو 71 أو 70 أو 78)'
      };
    }

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
}
