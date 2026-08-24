import { IAddressRepository } from '../repositories/address.repository';
import { AddressEntity, SaveAddressParams } from '../entities/address.entity';

export class AddAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(userId: string, params: SaveAddressParams): Promise<AddressEntity> {
    if (!params.city || !params.area) {
      throw new Error('يرجى اختيار المحافظة والمنطقة.');
    }
    if (!params.title) {
      throw new Error('يرجى تحديد اسم العنوان.');
    }
    return this.addressRepository.addAddress(userId, params);
  }
}
