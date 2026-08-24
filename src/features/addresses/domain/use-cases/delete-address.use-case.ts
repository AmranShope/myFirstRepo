import { IAddressRepository } from '../repositories/address.repository';

export class DeleteAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(userId: string, addressId: string): Promise<void> {
    if (!userId || !addressId) return;
    return this.addressRepository.deleteAddress(userId, addressId);
  }
}
