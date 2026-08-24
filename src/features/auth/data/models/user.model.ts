import { UserEntity, UserRole } from '../../domain/entities/user.entity';

export interface UserFirestoreDoc {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  avatar?: string;
  loyaltyPoints?: number;
  role?: UserRole;
  isActive?: boolean;
  isBanned?: boolean;
  isPhoneVerified?: boolean;
  walletBalance?: number;
  defaultAddressId?: string;
  defaultAddressSummary?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class UserModel {
  static fromFirestore(uid: string, data: UserFirestoreDoc): UserEntity {
    return {
      id: uid,
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      city: data.city || 'صنعاء',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      loyaltyPoints: typeof data.loyaltyPoints === 'number' ? data.loyaltyPoints : 50,
      role: data.role || 'customer',
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      isBanned: data.isBanned !== undefined ? Boolean(data.isBanned) : false,
      isPhoneVerified: data.isPhoneVerified !== undefined ? Boolean(data.isPhoneVerified) : true,
      walletBalance: typeof data.walletBalance === 'number' ? data.walletBalance : 0,
      defaultAddressId: data.defaultAddressId,
      defaultAddressSummary: data.defaultAddressSummary,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
  }

  static toFirestore(entity: Partial<UserEntity>): UserFirestoreDoc {
    const doc: UserFirestoreDoc = {};
    if (entity.name !== undefined) doc.name = entity.name;
    if (entity.phone !== undefined) doc.phone = entity.phone;
    if (entity.email !== undefined) doc.email = entity.email;
    if (entity.city !== undefined) doc.city = entity.city;
    if (entity.avatar !== undefined) doc.avatar = entity.avatar;
    if (entity.loyaltyPoints !== undefined) doc.loyaltyPoints = entity.loyaltyPoints;
    if (entity.role !== undefined) doc.role = entity.role;
    if (entity.isActive !== undefined) doc.isActive = entity.isActive;
    if (entity.isBanned !== undefined) doc.isBanned = entity.isBanned;
    if (entity.isPhoneVerified !== undefined) doc.isPhoneVerified = entity.isPhoneVerified;
    if (entity.walletBalance !== undefined) doc.walletBalance = entity.walletBalance;
    if (entity.defaultAddressId !== undefined) doc.defaultAddressId = entity.defaultAddressId;
    if (entity.defaultAddressSummary !== undefined) doc.defaultAddressSummary = entity.defaultAddressSummary;
    if (entity.createdAt !== undefined) doc.createdAt = entity.createdAt;
    doc.updatedAt = new Date().toISOString();
    return doc;
  }
}
