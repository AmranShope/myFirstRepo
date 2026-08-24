import { AddressEntity } from '../../domain/entities/address.entity';

export class AddressModel {
  static toFirestore(address: AddressEntity): Record<string, any> {
    return {
      title: address.title,
      city: address.city,
      area: address.area,
      street: address.street || '',
      building: address.building || '',
      details: address.details || '',
      isDefault: address.isDefault || false,
      coordinates: address.coordinates || null,
      phone: address.phone || '',
      addressType: address.addressType || 'منزل',
      createdAt: address.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static fromFirestore(id: string, data: any): AddressEntity {
    return {
      id,
      title: data.title || 'عنواني',
      city: data.city || 'صنعاء',
      area: data.area || 'حدة',
      street: data.street || '',
      building: data.building || '',
      details: data.details || '',
      isDefault: !!data.isDefault,
      coordinates: data.coordinates || undefined,
      phone: data.phone || '',
      addressType: data.addressType || 'منزل',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
}
