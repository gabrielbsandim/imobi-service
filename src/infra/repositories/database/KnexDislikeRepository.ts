import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

import { DislikeEntity, TToggleDislike } from '@/domain/entities/DislikeEntity'
import { IDislikeRepository } from '@/domain/interfaces/repositories/database/IDislikeRepository'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

@injectable()
export class KnexDislikeRepository implements IDislikeRepository {
  constructor(@inject('Knex') private readonly knex: Knex) {}

  async create({
    brokerId,
    listingId,
  }: TToggleDislike): Promise<ICreationResult> {
    const [dislikeId] = await this.knex('dislikes')
      .insert({
        broker_id: brokerId,
        listing_id: listingId,
      })
      .returning('id')

    return { id: dislikeId }
  }

  async delete({ brokerId, listingId }: TToggleDislike): Promise<void> {
    await this.knex('dislikes')
      .where({ broker_id: brokerId, listing_id: listingId })
      .del()
  }

  async findByBrokerAndListing({
    brokerId,
    listingId,
  }: TToggleDislike): Promise<DislikeEntity | null> {
    const dislike = await this.knex('dislikes')
      .where({ broker_id: brokerId, listing_id: listingId })
      .first()

    return dislike ? this.toDomain(dislike) : null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(raw: any): DislikeEntity {
    return new DislikeEntity(raw.id, raw.listing_id, raw.broker_id)
  }
}
