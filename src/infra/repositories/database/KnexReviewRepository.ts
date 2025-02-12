import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

import {
  ReviewEntity,
  TCreateReview,
  TFindReviewByBuyerAndBroker,
} from '@/domain/entities/ReviewEntity'
import { IReviewRepository } from '@/domain/interfaces/repositories/database/IReviewRepository'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

@injectable()
export class KnexReviewRepository implements IReviewRepository {
  constructor(@inject('Knex') private readonly knex: Knex) {}

  async create(props: TCreateReview): Promise<ICreationResult> {
    const [reviewId] = await this.knex('reviews')
      .insert({
        buyer_id: props.buyerId,
        broker_id: props.brokerId,
        rating: props.rating,
      })
      .returning('id')

    return reviewId
  }

  async getAverageRating(brokerId: string): Promise<number> {
    const result = await this.knex('reviews')
      .where({ broker_id: brokerId })
      .avg('rating as average_rating')
      .first()

    return parseFloat(result?.average_rating || '0')
  }

  async findReviewByBuyerAndBroker({
    buyerId,
    brokerId,
  }: TFindReviewByBuyerAndBroker): Promise<ReviewEntity | null> {
    const review = await this.knex('reviews')
      .where({ buyer_id: buyerId, broker_id: brokerId })
      .first()

    return review ? this.toDomain(review) : null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(raw: any): ReviewEntity {
    return new ReviewEntity(raw.id, raw.buyer_id, raw.broker_id, raw.rating)
  }
}
