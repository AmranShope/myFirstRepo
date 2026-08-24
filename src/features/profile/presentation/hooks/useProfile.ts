import { useState, useCallback } from 'react';
import { useApp } from '../../../../context/AppContext';
import { ProfileRepositoryImpl } from '../../data/repositories/profile.repository.impl';
import { UpdateProfileUseCase } from '../../domain/use-cases/update-profile.use-case';
import { UpdateProfileParams } from '../../domain/entities/profile.entity';

const profileRepo = new ProfileRepositoryImpl();
const updateProfileUseCase = new UpdateProfileUseCase(profileRepo);

export function useProfile() {
  const { user, setUser, updateUserProfile, showToast, setCurrentScreen } = useApp();
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = useCallback(async (params: UpdateProfileParams) => {
    if (!user) {
      showToast('يرجى تسجيل الدخول أولاً');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        name: params.name,
        phone: params.phone,
        email: params.email,
        city: params.city,
        avatar: params.avatar
      });
      showToast('تم تحديث بيانات الملف الشخصي بنجاح ✅');
      setCurrentScreen('main');
    } catch {
      showToast('حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSaving(false);
    }
  }, [user, updateUserProfile, showToast, setCurrentScreen]);

  return {
    user,
    isSaving,
    saveProfile
  };
}
