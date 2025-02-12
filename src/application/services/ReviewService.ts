import { injectable, inject } from 'tsyringe'

import { TCreateReview } from '@/domain/entities/ReviewEntity'
import { BadRequestError } from '@/errors/HttpErrors'
import { KnexReviewRepository } from '@/infra/repositories/database/KnexReviewRepository'

@injectable()
export class ReviewService {
  constructor(
    @inject('IReviewRepository')
    private readonly reviewRepository: KnexReviewRepository,
  ) {}

  async create(props: TCreateReview) {
    const existingReview =
      await this.reviewRepository.findReviewByBuyerAndBroker({
        brokerId: props.brokerId,
        buyerId: props.buyerId,
      })

    if (existingReview) {
      throw new BadRequestError('Você já avaliou este vendedor.')
    }

    return this.reviewRepository.create(props)
  }

  async getAverageRating(brokerId: string) {
    const averageRating = await this.reviewRepository.getAverageRating(brokerId)

    return { averageRating }
  }
}
