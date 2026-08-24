import { IAddressRepository } from '../repositories/address.repository';
import { YemenCityEntity } from '../entities/address.entity';

export class GetYemenCitiesUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  execute(): YemenCityEntity[] {
    return this.addressRepository.getYemenCities();
  }
}
