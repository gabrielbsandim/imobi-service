import { Knex } from 'knex'
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
import { IListingRepository } from '@/domain/interfaces/IListingRepository'
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'

@injectable()
export class KnexListingRepository implements IListingRepository {
  constructor(@inject('Knex') private readonly knex: Knex) {}

  async create(listing: TCreateListingRequest): Promise<ListingEntity> {
    const [createdListing] = await this.knex('listings')
      .insert({
        buyer_id: listing.buyerId,
        transaction_type: listing.transactionType,
        property_type: listing.propertyType,
        city: listing.city,
        description: listing.description,
        neighborhood: listing.neighborhood,
        max_price: listing.maxPrice,
        min_price: listing.minPrice,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        min_size_m2: listing.minSizeM2,
        max_size_m2: listing.maxSizeM2,
        parking_spaces: listing.parkingSpaces,
        min_floor: listing.minFloor,
      })
      .returning('*')
    return createdListing
  }

  async findById(id: string): Promise<ListingEntity | null> {
    const listing = await this.knex('listings').where({ id }).first()

    if (!listing) {
      return null
    }

    return this.toDomain(listing)
  }

  async update(id: string, updates: TUpdateListingRequest): Promise<void> {
    const filteredUpdates = removeUndefinedProps({
      transaction_type: updates.transactionType,
      property_type: updates.propertyType,
      city: updates.city,
      description: updates.description,
      neighborhood: updates.neighborhood,
      max_price: updates.maxPrice,
      min_price: updates.minPrice,
      bedrooms: updates.bedrooms,
      bathrooms: updates.bathrooms,
      min_size_m2: updates.minSizeM2,
      max_size_m2: updates.maxSizeM2,
      parking_spaces: updates.parkingSpaces,
      min_floor: updates.minFloor,
      updatedAt: this.knex.fn.now(),
    })

    await this.knex('listings').where({ id }).update(filteredUpdates)
  }

  async delete(id: string): Promise<void> {
    await this.knex('listings').where({ id }).del()
  }

  async list(
    filters: TListListingFilterRequest,
    pagination: TPaginationRequest,
  ): Promise<IPaginationResponse<ListingEntity>> {
    const { offset = 0, limit = 10 } = pagination || {}

    const query = this.knex('listings').select('*')

    if (filters.transactionType) {
      query.where('transaction_type', filters.transactionType)
    }
    if (filters.propertyType) {
      query.where('property_type', filters.propertyType)
    }
    if (filters.bedrooms !== undefined) {
      query.where('bedrooms', filters.bedrooms)
    }
    if (filters.bathrooms !== undefined) {
      query.where('bathrooms', filters.bathrooms)
    }
    if (filters.parkingSpaces !== undefined) {
      query.where('parking_spaces', filters.parkingSpaces)
    }
    if (filters.minFloor !== undefined) {
      query.where('min_floor', '>=', filters.minFloor)
    }
    if (filters.minSizeM2 !== undefined) {
      query.where('min_size_m2', '>=', filters.minSizeM2)
    }
    if (filters.maxSizeM2 !== undefined) {
      query.where('max_size_m2', '<=', filters.maxSizeM2)
    }
    if (filters.city) {
      query.where('city', 'ilike', `%${filters.city}%`)
    }
    if (filters.neighborhood) {
      query.where('neighborhood', 'ilike', `%${filters.neighborhood}%`)
    }
    if (filters.minPrice !== undefined) {
      query.where('min_price', '>=', filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      query.where('max_price', '<=', filters.maxPrice)
    }
    if (filters.description) {
      query.where('description', 'ilike', `%${filters.description}%`)
    }

    const totalResult = await query
      .clone()
      .count<{ count: string }>('id as count')
    const total = parseInt(totalResult.count, 10)

    const listings = await query.limit(limit).offset(offset)

    return {
      items: listings.map(this.toDomain),
      pagination: {
        total,
        offset,
        limit,
      },
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(raw: any): ListingEntity {
    return new ListingEntity(
      raw.id,
      raw.buyer_id,
      raw.transaction_type,
      raw.property_type,
      raw.city,
      raw.description,
      raw.neighborhood,
      raw.max_price,
      raw.min_price,
      raw.bedrooms,
      raw.bathrooms,
      raw.min_size_m2,
      raw.max_size_m2,
      raw.parking_spaces,
      raw.min_floor,
    )
  }
}
