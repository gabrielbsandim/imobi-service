import {
  ReviewEntity,
  TCreateReview,
  TFindReviewByBuyerAndBroker,
} from '@/domain/entities/ReviewEntity'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

export interface IReviewRepository {
  create: (props: TCreateReview) => Promise<ICreationResult>
  getAverageRating: (brokerId: string) => Promise<number>
  findReviewByBuyerAndBroker: (
    props: TFindReviewByBuyerAndBroker,
  ) => Promise<ReviewEntity | null>
}
