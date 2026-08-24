import { AddressEntity, YemenCityEntity } from '../../domain/entities/address.entity';
import { YEMEN_CITIES } from '../../../../data/mockData';

const ADDRESSES_STORAGE_KEY = 'troolly_user_addresses';

export class AddressLocalDataSource {
  private getStorageKey(userId?: string): string {
    if (!userId || userId === 'guest') return 'troolly_user_addresses_guest';
    return `troolly_user_addresses_${userId}`;
  }

  getCachedAddresses(userId?: string): AddressEntity[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(userId));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveCachedAddresses(addresses: AddressEntity[], userId?: string): void {
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(addresses));
    } catch (e) {
      console.warn('Error writing addresses to localStorage:', e);
    }
  }

  getYemenCities(): YemenCityEntity[] {
    return YEMEN_CITIES.map(c => ({
      name: c.name,
      areas: [...c.areas]
    }));
  }
}
