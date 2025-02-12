import { ReviewEntity, TCreateReview } from '@/domain/entities/ReviewEntity'
import { IReviewRepository } from '@/domain/interfaces/repositories/database/IReviewRepository'

export const mockCreateReview: jest.Mocked<TCreateReview> = {
  buyerId: 'buyer_id',
  rating: 5,
  brokerId: 'broker_789',
}

export const mockReview: jest.Mocked<ReviewEntity> = {
  ...mockCreateReview,
  id: '123',
}

export const mockAverageRating: jest.Mocked<number> = 5

export const mockReviewRepository: jest.Mocked<IReviewRepository> = {
  create: jest.fn().mockResolvedValue({
    id: mockReview.id,
  }),
  findReviewByBuyerAndBroker: jest.fn().mockResolvedValue(mockReview),
  getAverageRating: jest.fn().mockResolvedValue(mockAverageRating),
}
