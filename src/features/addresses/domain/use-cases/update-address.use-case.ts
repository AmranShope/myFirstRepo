import { IAddressRepository } from '../repositories/address.repository';
import { AddressEntity, SaveAddressParams } from '../entities/address.entity';

export class UpdateAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(userId: string, addressId: string, params: Partial<SaveAddressParams>): Promise<AddressEntity> {
    if (!addressId) {
      throw new Error('معرف العنوان مطلوب للتعديل.');
    }
    return this.addressRepository.updateAddress(userId, addressId, params);
  }
}
