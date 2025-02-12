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
    if (props.rating < 1 || props.rating > 5) {
      throw new BadRequestError('A nota deve estar entre 1 e 5.')
    }

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
