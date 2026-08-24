import { db, cleanForFirestore } from '../../../../lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  writeBatch 
} from 'firebase/firestore';
import { AddressEntity, SaveAddressParams } from '../../domain/entities/address.entity';
import { AddressModel } from '../models/address.model';

export class AddressRemoteDataSource {
  async fetchAddresses(userId: string): Promise<AddressEntity[]> {
    if (!userId) return [];
    try {
      const addressesRef = collection(db, 'users', userId, 'addresses');
      const q = query(addressesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return [];

      return snapshot.docs.map(docSnap => 
        AddressModel.fromFirestore(docSnap.id, docSnap.data())
      );
    } catch (err) {
      console.warn('Firestore fetchAddresses warning:', err);
      return [];
    }
  }

  async saveAddress(userId: string, params: SaveAddressParams): Promise<AddressEntity> {
    const addressId = params.id || `addr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const addressDocRef = doc(db, 'users', userId, 'addresses', addressId);

    const addressEntity: AddressEntity = {
      id: addressId,
      title: params.title,
      city: params.city,
      area: params.area,
      street: params.street,
      building: params.building,
      details: params.details || '',
      isDefault: params.isDefault ?? false,
      coordinates: params.coordinates,
      phone: params.phone,
      addressType: params.addressType || 'منزل',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const firestoreData = AddressModel.toFirestore(addressEntity);
    await setDoc(addressDocRef, firestoreData, { merge: true });

    return addressEntity;
  }

  async updateAddress(userId: string, addressId: string, params: Partial<SaveAddressParams>): Promise<AddressEntity> {
    const addressDocRef = doc(db, 'users', userId, 'addresses', addressId);
    const rawUpdateData: Record<string, any> = {
      ...params,
      updatedAt: new Date().toISOString()
    };
    if (rawUpdateData.coordinates === undefined) {
      delete rawUpdateData.coordinates;
    }
    const updateData = cleanForFirestore(rawUpdateData);
    await updateDoc(addressDocRef, updateData);

    return {
      id: addressId,
      title: params.title || '',
      city: params.city || '',
      area: params.area || '',
      street: params.street || '',
      building: params.building || '',
      details: params.details,
      isDefault: !!params.isDefault,
      coordinates: params.coordinates,
      phone: params.phone,
      addressType: params.addressType,
      updatedAt: updateData.updatedAt
    } as AddressEntity;
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const addressDocRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(addressDocRef);
  }

  async setDefaultAddress(userId: string, addressId: string, currentAddresses: AddressEntity[]): Promise<AddressEntity[]> {
    const batch = writeBatch(db);
    const updated = currentAddresses.map(addr => {
      const isTarget = addr.id === addressId;
      const docRef = doc(db, 'users', userId, 'addresses', addr.id);
      batch.update(docRef, { isDefault: isTarget, updatedAt: new Date().toISOString() });
      return { ...addr, isDefault: isTarget };
    });

    await batch.commit().catch(e => console.warn('Batch set default address note:', e));
    return updated;
  }
}
