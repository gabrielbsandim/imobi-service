import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

import {
  FavoriteEntity,
  TToggleFavorite,
} from '@/domain/entities/FavoriteEntity'
import { IFavoriteRepository } from '@/domain/interfaces/repositories/database/IFavoriteRepository'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

@injectable()
export class KnexFavoriteRepository implements IFavoriteRepository {
  constructor(@inject('Knex') private readonly knex: Knex) {}

  async create({
    brokerId,
    listingId,
  }: TToggleFavorite): Promise<ICreationResult> {
    const [favoriteId] = await this.knex('favorites')
      .insert({
        broker_id: brokerId,
        listing_id: listingId,
      })
      .returning('id')

    return { id: favoriteId }
  }

  async delete({ brokerId, listingId }: TToggleFavorite): Promise<void> {
    await this.knex('favorites')
      .where({ broker_id: brokerId, listing_id: listingId })
      .del()
  }

  async findByBrokerAndListing({
    brokerId,
    listingId,
  }: TToggleFavorite): Promise<FavoriteEntity | null> {
    const favorite = await this.knex('favorites')
      .where({ broker_id: brokerId, listing_id: listingId })
      .first()

    return favorite ? this.toDomain(favorite) : null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(raw: any): FavoriteEntity {
    return new FavoriteEntity(raw.id, raw.listing_id, raw.broker_id)
  }
}
