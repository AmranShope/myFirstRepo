import { useState, useEffect, useMemo, useCallback } from 'react';
import { AddressEntity, SaveAddressParams, YemenCityEntity } from '../../domain/entities/address.entity';
import { AddressRemoteDataSource } from '../../data/datasources/address-remote.datasource';
import { AddressLocalDataSource } from '../../data/datasources/address-local.datasource';
import { AddressRepositoryImpl } from '../../data/repositories/address.repository.impl';
import { GetUserAddressesUseCase } from '../../domain/use-cases/get-user-addresses.use-case';
import { AddAddressUseCase } from '../../domain/use-cases/add-address.use-case';
import { UpdateAddressUseCase } from '../../domain/use-cases/update-address.use-case';
import { DeleteAddressUseCase } from '../../domain/use-cases/delete-address.use-case';
import { SetDefaultAddressUseCase } from '../../domain/use-cases/set-default-address.use-case';
import { GetYemenCitiesUseCase } from '../../domain/use-cases/get-yemen-cities.use-case';
import { useApp } from '../../../../context/AppContext';

export function useAddresses() {
  const { user, showToast } = useApp();
  const [addresses, setAddresses] = useState<AddressEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => {
    const remoteDS = new AddressRemoteDataSource();
    const localDS = new AddressLocalDataSource();
    return new AddressRepositoryImpl(remoteDS, localDS);
  }, []);

  const getUserAddressesUC = useMemo(() => new GetUserAddressesUseCase(repository), [repository]);
  const addAddressUC = useMemo(() => new AddAddressUseCase(repository), [repository]);
  const updateAddressUC = useMemo(() => new UpdateAddressUseCase(repository), [repository]);
  const deleteAddressUC = useMemo(() => new DeleteAddressUseCase(repository), [repository]);
  const setDefaultAddressUC = useMemo(() => new SetDefaultAddressUseCase(repository), [repository]);
  const getYemenCitiesUC = useMemo(() => new GetYemenCitiesUseCase(repository), [repository]);

  const yemenCities: YemenCityEntity[] = useMemo(() => getYemenCitiesUC.execute(), [getYemenCitiesUC]);

  const loadAddresses = useCallback(async () => {
    if (!user?.id) {
      setAddresses([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const list = await getUserAddressesUC.execute(user.id);
      setAddresses(list || []);
    } catch (e: any) {
      setError(e?.message || 'فشل في تحميل العناوين');
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getUserAddressesUC]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleAddAddress = async (params: SaveAddressParams): Promise<AddressEntity | null> => {
    const userId = user?.id || '';
    try {
      const isFirst = addresses.length === 0;
      const finalParams = {
        ...params,
        isDefault: isFirst || !!params.isDefault
      };
      const added = await addAddressUC.execute(userId, finalParams);
      setAddresses(prev => {
        if (finalParams.isDefault) {
          return [added, ...prev.map(a => ({ ...a, isDefault: false }))];
        }
        return [...prev, added];
      });
      showToast('تمت إضافة العنوان بنجاح 📍');
      return added;
    } catch (e: any) {
      const msg = e?.message || 'تعذر إضافة العنوان';
      showToast(msg);
      setError(msg);
      return null;
    }
  };

  const handleUpdateAddress = async (addressId: string, params: Partial<SaveAddressParams>): Promise<boolean> => {
    const userId = user?.id || '';
    try {
      await updateAddressUC.execute(userId, addressId, params);
      setAddresses(prev => prev.map(a => a.id === addressId ? { ...a, ...params } : a));
      showToast('تم تحديث بيانات العنوان بنجاح');
      return true;
    } catch (e: any) {
      const msg = e?.message || 'تعذر تعديل العنوان';
      showToast(msg);
      return false;
    }
  };

  const handleDeleteAddress = async (addressId: string): Promise<boolean> => {
    const userId = user?.id || '';
    try {
      await deleteAddressUC.execute(userId, addressId);
      setAddresses(prev => prev.filter(a => a.id !== addressId));
      showToast('تم حذف العنوان بنجاح');
      return true;
    } catch (e: any) {
      showToast('تعذر حذف العنوان');
      return false;
    }
  };

  const handleSetDefaultAddress = async (addressId: string): Promise<void> => {
    const userId = user?.id || '';
    try {
      const updated = await setDefaultAddressUC.execute(userId, addressId);
      const sorted = [...updated].sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
      });
      setAddresses(sorted);
      showToast('تم تعيين العنوان الافتراضي ورفعه لأول القائمة 📍');
    } catch {
      setAddresses(prev => {
        const target = prev.find(a => a.id === addressId);
        if (!target) return prev;
        const rest = prev.filter(a => a.id !== addressId).map(a => ({ ...a, isDefault: false }));
        return [{ ...target, isDefault: true }, ...rest];
      });
      showToast('تم تعيين العنوان الافتراضي ورفعه لأول القائمة 📍');
    }
  };

  const defaultAddress = useMemo(() => {
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  }, [addresses]);

  return {
    addresses,
    defaultAddress,
    yemenCities,
    isLoading,
    error,
    addAddress: handleAddAddress,
    updateAddress: handleUpdateAddress,
    deleteAddress: handleDeleteAddress,
    setDefaultAddress: handleSetDefaultAddress,
    refreshAddresses: loadAddresses
  };
}
