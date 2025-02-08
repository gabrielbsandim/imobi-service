import { inject, injectable } from 'tsyringe'

import {
  IPaginationResponse,
  TPaginationRequest,
} from '@/domain/application/pagination.types'
import {
  ListingEntity,
  TCreateListingRequest,
  TListListingFilterRequest,
  TUpdateListingRequest,
} from '@/domain/entities/ListingEntity'
import { KnexListingRepository } from '@/infra/repositories/database/KnexListingRepository'

@injectable()
export class ListingService {
  constructor(
    @inject('IListingRepository')
    private readonly listingRepository: KnexListingRepository,
  ) {}

  async create(data: TCreateListingRequest): Promise<ListingEntity> {
    return this.listingRepository.create(data)
  }

  async findById(id: string): Promise<ListingEntity | null> {
    return this.listingRepository.findById(id)
  }

  async update(id: string, updates: TUpdateListingRequest): Promise<void> {
    await this.listingRepository.update(id, updates)
  }

  async delete(id: string): Promise<void> {
    await this.listingRepository.delete(id)
  }

  async list(
    filters: TListListingFilterRequest,
    pagination: TPaginationRequest,
  ): Promise<IPaginationResponse<ListingEntity>> {
    return await this.listingRepository.list(filters, pagination)
  }

  isValidListing(data: Partial<ListingEntity>): data is TCreateListingRequest {
    const requiredFields: Array<keyof TCreateListingRequest> = [
      'buyerId',
      'buyerPhoneNumber',
      'transactionType',
      'propertyType',
      'city',
      'description',
    ]

    const hasAllRequiredFields = requiredFields.every(
      field => data[field] !== undefined,
    )

    const basicTypeChecks =
      typeof data.transactionType === 'string' &&
      typeof data.propertyType === 'string' &&
      typeof data.city === 'string' &&
      typeof data.description === 'string'

    return hasAllRequiredFields && basicTypeChecks
  }
}
