export interface UserProfileEntity {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  avatar?: string;
  loyaltyPoints: number;
  createdAt?: string;
}

export interface UpdateProfileParams {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  avatar?: string;
}
