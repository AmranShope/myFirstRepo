import { useState, useMemo, useCallback } from 'react';
import { AuthRepositoryImpl } from '../../data/repositories/auth.repository.impl';
import { SendOtpUseCase } from '../../domain/use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from '../../domain/use-cases/verify-otp.use-case';
import { SignOutUseCase } from '../../domain/use-cases/sign-out.use-case';
import { ValidateYemeniPhoneUseCase } from '../../domain/use-cases/validate-phone.use-case';
import { UserEntity, AuthResult, PhoneValidationResult } from '../../domain/entities/user.entity';

// Single shared repository instance for presentation layer
const authRepository = new AuthRepositoryImpl();
const sendOtpUseCase = new SendOtpUseCase(authRepository);
const verifyOtpUseCase = new VerifyOtpUseCase(authRepository);
const signOutUseCase = new SignOutUseCase(authRepository);
const validatePhoneUseCase = new ValidateYemeniPhoneUseCase();

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePhone = useCallback((phone: string): PhoneValidationResult => {
    return validatePhoneUseCase.execute(phone);
  }, []);

  const sendOtp = useCallback(async (phone: string): Promise<AuthResult<string>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await sendOtpUseCase.execute(phone);
      if (!result.success && result.message) {
        setError(result.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (code: string, pendingPhone: string): Promise<AuthResult<UserEntity>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await verifyOtpUseCase.execute(code, pendingPhone);
      if (!result.success && result.message) {
        setError(result.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await signOutUseCase.execute();
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    setError,
    validatePhone,
    sendOtp,
    verifyOtp,
    signOut,
    authRepository
  };
}
