import { container } from 'tsyringe'

import { ReviewService } from '@/application/services/ReviewService'
import { BadRequestError } from '@/errors/HttpErrors'
import {
  mockAverageRating,
  mockCreateReview,
  mockReview,
  mockReviewRepository,
} from '@/tests/unit/mocks/ReviewMock'

container.register('IReviewRepository', { useValue: mockReviewRepository })

describe('ReviewService', () => {
  let reviewService: ReviewService

  beforeEach(() => {
    reviewService = container.resolve(ReviewService)
    jest.clearAllMocks()
  })

  describe('Create', () => {
    it('should create review', async () => {
      mockReviewRepository.findReviewByBuyerAndBroker.mockResolvedValueOnce(
        null,
      )

      const created = await reviewService.create(mockCreateReview)

      expect(created).toStrictEqual({
        id: mockReview.id,
      })

      expect(mockReviewRepository.create).toHaveBeenCalledWith(mockCreateReview)
    })

    it('should not create review when a review already exists', async () => {
      await expect(reviewService.create(mockCreateReview)).rejects.toThrow(
        BadRequestError,
      )

      await expect(reviewService.create(mockCreateReview)).rejects.toThrow(
        'Você já avaliou este vendedor.',
      )
    })
  })

  describe('GetAverageRating', () => {
    it('should get average rating', async () => {
      const brokerId = 'broker_id'

      const response = await reviewService.getAverageRating(brokerId)

      expect(mockReviewRepository.getAverageRating).toHaveBeenCalledWith(
        brokerId,
      )

      expect(response).toStrictEqual({ averageRating: mockAverageRating })
    })
  })
})
