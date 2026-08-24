import { AddressEntity, SaveAddressParams, YemenCityEntity } from '../entities/address.entity';

export interface IAddressRepository {
  getUserAddresses(userId: string): Promise<AddressEntity[]>;
  addAddress(userId: string, params: SaveAddressParams): Promise<AddressEntity>;
  updateAddress(userId: string, addressId: string, params: Partial<SaveAddressParams>): Promise<AddressEntity>;
  deleteAddress(userId: string, addressId: string): Promise<void>;
  setDefaultAddress(userId: string, addressId: string): Promise<AddressEntity[]>;
  getYemenCities(): YemenCityEntity[];
  getCurrentGeoLocation(): Promise<GeolocationPosition>;
}
