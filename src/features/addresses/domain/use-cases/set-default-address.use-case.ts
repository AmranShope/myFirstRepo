import { IAddressRepository } from '../repositories/address.repository';
import { AddressEntity } from '../entities/address.entity';

export class SetDefaultAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(userId: string, addressId: string): Promise<AddressEntity[]> {
    if (!userId || !addressId) return [];
    return this.addressRepository.setDefaultAddress(userId, addressId);
  }
}
