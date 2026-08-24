import { IAddressRepository } from '../../domain/repositories/address.repository';
import { AddressEntity, SaveAddressParams, YemenCityEntity } from '../../domain/entities/address.entity';
import { AddressRemoteDataSource } from '../datasources/address-remote.datasource';
import { AddressLocalDataSource } from '../datasources/address-local.datasource';

export class AddressRepositoryImpl implements IAddressRepository {
  constructor(
    private remoteDataSource: AddressRemoteDataSource,
    private localDataSource: AddressLocalDataSource
  ) {}

  async getUserAddresses(userId: string): Promise<AddressEntity[]> {
    if (!userId || userId === 'guest') {
      return this.localDataSource.getCachedAddresses('guest');
    }

    try {
      const remoteAddresses = await this.remoteDataSource.fetchAddresses(userId);
      if (remoteAddresses && remoteAddresses.length > 0) {
        this.localDataSource.saveCachedAddresses(remoteAddresses, userId);
        return remoteAddresses;
      }
      return this.localDataSource.getCachedAddresses(userId);
    } catch {
      return this.localDataSource.getCachedAddresses(userId);
    }
  }

  async addAddress(userId: string, params: SaveAddressParams): Promise<AddressEntity> {
    let newAddress: AddressEntity;

    if (userId && userId !== 'guest') {
      newAddress = await this.remoteDataSource.saveAddress(userId, params);
    } else {
      newAddress = {
        id: `addr_${Date.now()}`,
        title: params.title,
        city: params.city,
        area: params.area,
        street: params.street,
        building: params.building,
        details: params.details,
        isDefault: params.isDefault ?? false,
        coordinates: params.coordinates,
        phone: params.phone,
        addressType: params.addressType || 'منزل',
        createdAt: new Date().toISOString()
      };
    }

    const currentCached = this.localDataSource.getCachedAddresses(userId);
    const updated = newAddress.isDefault
      ? currentCached.map(a => ({ ...a, isDefault: false })).concat(newAddress)
      : [...currentCached, newAddress];

    this.localDataSource.saveCachedAddresses(updated, userId);
    return newAddress;
  }

  async updateAddress(userId: string, addressId: string, params: Partial<SaveAddressParams>): Promise<AddressEntity> {
    let updatedAddress: AddressEntity;

    if (userId && userId !== 'guest') {
      updatedAddress = await this.remoteDataSource.updateAddress(userId, addressId, params);
    } else {
      const currentCached = this.localDataSource.getCachedAddresses(userId);
      const existing = currentCached.find(a => a.id === addressId);
      if (!existing) throw new Error('العنوان غير موجود');
      updatedAddress = { ...existing, ...params };
    }

    const currentCached = this.localDataSource.getCachedAddresses(userId);
    const updatedList = currentCached.map(a => a.id === addressId ? { ...a, ...params } : a);
    this.localDataSource.saveCachedAddresses(updatedList, userId);

    return updatedAddress;
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    if (userId && userId !== 'guest') {
      await this.remoteDataSource.deleteAddress(userId, addressId).catch(() => {});
    }

    const currentCached = this.localDataSource.getCachedAddresses(userId);
    const updatedList = currentCached.filter(a => a.id !== addressId);
    this.localDataSource.saveCachedAddresses(updatedList, userId);
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<AddressEntity[]> {
    const currentCached = this.localDataSource.getCachedAddresses(userId);
    const updatedList = currentCached.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));

    if (userId && userId !== 'guest') {
      await this.remoteDataSource.setDefaultAddress(userId, addressId, currentCached).catch(() => {});
    }

    this.localDataSource.saveCachedAddresses(updatedList, userId);
    return updatedList;
  }

  getYemenCities(): YemenCityEntity[] {
    return this.localDataSource.getYemenCities();
  }

  async getCurrentGeoLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }
}
