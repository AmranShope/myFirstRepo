import { IAddressRepository } from '../repositories/address.repository';
import { AddressEntity } from '../entities/address.entity';

export class GetUserAddressesUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(userId: string): Promise<AddressEntity[]> {
    if (!userId) return [];
    return this.addressRepository.getUserAddresses(userId);
  }
}
