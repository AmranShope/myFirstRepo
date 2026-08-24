import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { UserProfileEntity, UpdateProfileParams } from '../../domain/entities/profile.entity';

export class ProfileRemoteDataSource {
  async getProfile(userId: string): Promise<UserProfileEntity | null> {
    if (!userId || userId === 'guest') return null;
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: userId,
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          city: data.city || 'صنعاء',
          avatar: data.avatar || '',
          loyaltyPoints: typeof data.loyaltyPoints === 'number' ? data.loyaltyPoints : 50,
          createdAt: data.createdAt || new Date().toISOString()
        };
      }
      return null;
    } catch (e) {
      console.warn('Error fetching profile:', e);
      return null;
    }
  }

  async updateProfile(userId: string, params: UpdateProfileParams): Promise<UserProfileEntity> {
    const payload = {
      ...params,
      updatedAt: new Date().toISOString()
    };

    if (userId && userId !== 'guest') {
      try {
        await setDoc(doc(db, 'users', userId), payload, { merge: true });
      } catch (e) {
        console.warn('Error updating profile in firestore:', e);
      }
    }

    const currentProfile = await this.getProfile(userId);
    return {
      id: userId,
      name: params.name ?? currentProfile?.name ?? '',
      phone: params.phone ?? currentProfile?.phone ?? '',
      email: params.email ?? currentProfile?.email ?? '',
      city: params.city ?? currentProfile?.city ?? 'صنعاء',
      avatar: params.avatar ?? currentProfile?.avatar ?? '',
      loyaltyPoints: currentProfile?.loyaltyPoints ?? 50,
      createdAt: currentProfile?.createdAt ?? new Date().toISOString()
    };
  }
}
