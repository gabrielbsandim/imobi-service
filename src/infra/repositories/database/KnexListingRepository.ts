import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

import {
  ListingEntity,
  TCreateListing,
  TListListingFilter,
  TUpdateListing,
} from '@/domain/entities/ListingEntity'
import { IListingRepository } from '@/domain/interfaces/repositories/database/IListingRepository'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'
import {
  IPaginationResponse,
  TPaginationRequest,
} from '@/domain/interfaces/shared/IPagination'
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'

@injectable()
export class KnexListingRepository implements IListingRepository {
  constructor(@inject('Knex') private readonly knex: Knex) {}

  async create(listing: TCreateListing): Promise<ICreationResult> {
    const [id] = await this.knex('listings')
      .insert({
        buyer_id: listing.buyerId,
        transaction_type: listing.transactionType,
        property_type: listing.propertyType,
        city: listing.city,
        description: listing.description,
        size: listing.size,
        price: listing.price,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        parking_spaces: listing.parkingSpaces,
      })
      .returning('id')

    return id
  }

  async findById(id: string): Promise<ListingEntity | null> {
    const listing = await this.knex('listings').where({ id }).first()

    if (!listing) {
      return null
    }

    return this.toDomain(listing)
  }

  async update(id: string, updates: TUpdateListing): Promise<void> {
    const filteredUpdates = removeUndefinedProps({
      transaction_type: updates.transactionType,
      property_type: updates.propertyType,
      city: updates.city,
      description: updates.description,
      size: updates.size,
      price: updates.price,
      bedrooms: updates.bedrooms,
      bathrooms: updates.bathrooms,
      parking_spaces: updates.parkingSpaces,
      updatedAt: this.knex.fn.now(),
    })

    await this.knex('listings').where({ id }).update(filteredUpdates)
  }

  async delete(id: string): Promise<void> {
    await this.knex('listings').where({ id }).del()
  }

  async list(
    filters: TListListingFilter,
    pagination: TPaginationRequest,
    userId: string,
  ): Promise<IPaginationResponse<ListingEntity>> {
    const { offset = 0, limit = 10 } = pagination

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
    if (filters.size !== undefined) {
      query.where('size', filters.size)
    }
    if (filters.city) {
      query.where('city', 'ilike', `%${filters.city}%`)
    }
    if (filters.price !== undefined) {
      query.where('price', filters.price)
    }
    if (filters.description) {
      query.where('description', 'ilike', `%${filters.description}%`)
    }

    if (filters.excludeDisliked) {
      query.whereNotIn('id', function () {
        this.select('listing_id').from('dislikes').where('seller_id', userId)
      })
    }

    if (filters.onlyFavorites) {
      query.whereIn('id', function () {
        this.select('listing_id').from('favorites').where('seller_id', userId)
      })
    }

    if (filters.onlyDisliked) {
      query.whereIn('id', function () {
        this.select('listing_id').from('dislikes').where('seller_id', userId)
      })
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
      raw.buyer_phone_number,
      raw.transaction_type,
      raw.property_type,
      raw.city,
      raw.description,
      raw.price,
      raw.bedrooms,
      raw.bathrooms,
      raw.size,
      raw.parking_spaces,
    )
  }
}
