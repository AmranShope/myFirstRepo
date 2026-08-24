export type UserRole = 'customer' | 'admin' | 'delivery_driver';

export interface AddressEntity {
  id: string;
  title: string;
  city: string;
  area: string;
  street: string;
  building: string;
  details?: string;
  isDefault: boolean;
}

export interface UserEntity {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  avatar: string;
  loyaltyPoints: number;
  role: UserRole;
  isActive: boolean;
  isBanned: boolean;
  isPhoneVerified: boolean;
  walletBalance?: number;
  defaultAddressId?: string;
  defaultAddressSummary?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResult<T = UserEntity> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PhoneValidationResult {
  isValid: boolean;
  formattedInternational?: string; // e.g. +967777777777
  cleanLocal?: string; // e.g. 777777777
  errorMessage?: string;
}
