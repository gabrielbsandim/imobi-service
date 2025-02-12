import { inject, injectable } from 'tsyringe'

import {
  ListingEntity,
  TCreateListing,
  TListListingFilter,
  TUpdateListing,
} from '@/domain/entities/ListingEntity'
import {
  IPaginationResponse,
  TPaginationRequest,
} from '@/domain/interfaces/shared/IPagination'
import { NotFoundError } from '@/errors/HttpErrors'
import { KnexListingRepository } from '@/infra/repositories/database/KnexListingRepository'

@injectable()
export class ListingService {
  constructor(
    @inject('IListingRepository')
    private readonly listingRepository: KnexListingRepository,
  ) {}

  async create(data: TCreateListing) {
    return this.listingRepository.create(data)
  }

  async findById(id: string) {
    const listing = await this.listingRepository.findById(id)

    if (!listing) {
      throw new NotFoundError('Anúncio não encontrado')
    }

    return listing
  }

  async update(id: string, updates: TUpdateListing): Promise<void> {
    await this.listingRepository.update(id, updates)
  }

  async delete(id: string): Promise<void> {
    await this.listingRepository.delete(id)
  }

  async list(
    filters: TListListingFilter,
    pagination: TPaginationRequest,
    userId: string,
  ): Promise<IPaginationResponse<ListingEntity>> {
    return this.listingRepository.list(filters, pagination, userId)
  }
}
