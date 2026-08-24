export interface LocationCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export type AddressType = 'منزل' | 'شقة' | 'مكتب' | 'أخرى';

export interface AddressEntity {
  id: string;
  title: string;
  city: string;
  area: string;
  street: string;
  building: string;
  details?: string;
  isDefault: boolean;
  coordinates?: LocationCoordinates;
  phone?: string;
  addressType?: AddressType;
  createdAt?: string;
  updatedAt?: string;
}

export interface YemenCityEntity {
  name: string;
  areas: string[];
}

export interface SaveAddressParams {
  id?: string;
  title: string;
  city: string;
  area: string;
  street: string;
  building: string;
  details?: string;
  isDefault?: boolean;
  coordinates?: LocationCoordinates;
  phone?: string;
  addressType?: AddressType;
}
