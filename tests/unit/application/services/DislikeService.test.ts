import { container } from 'tsyringe'

import { DislikeService } from '@/application/services/DislikeService'
import { ListingService } from '@/application/services/ListingService'
import {
  mockDislike,
  mockDislikeRepository,
  mockToggleDislike,
} from '@/tests/unit/mocks/DislikeMock'
import {
  mockListing,
  mockListingRepository,
} from '@/tests/unit/mocks/ListingMock'

container.register('IDislikeRepository', { useValue: mockDislikeRepository })
container.register('IListingRepository', { useValue: mockListingRepository })

const mockListingService: jest.Mocked<Pick<ListingService, 'findById'>> = {
  findById: jest.fn().mockResolvedValue(mockListing),
}

container.register('ListingService', { useValue: mockListingService })

describe('DislikeService', () => {
  let dislikeService: DislikeService

  beforeEach(() => {
    container.resolve(ListingService)
    dislikeService = container.resolve(DislikeService)
    jest.clearAllMocks()
  })

  describe('ToggleDislike', () => {
    it('should toggle and create dislike', async () => {
      mockDislikeRepository.findByBrokerAndListing.mockResolvedValueOnce(null)

      const response = await dislikeService.toggleDislike(mockToggleDislike)

      expect(mockListingService.findById).toHaveBeenCalledWith(
        mockToggleDislike.listingId,
      )

      expect(mockDislikeRepository.create).toHaveBeenCalledWith(
        mockToggleDislike,
      )

      expect(response).toStrictEqual({ id: mockDislike.id })
    })

    it('should toggle and remove dislike', async () => {
      await dislikeService.toggleDislike(mockToggleDislike)

      expect(mockListingService.findById).toHaveBeenCalledWith(
        mockToggleDislike.listingId,
      )

      expect(mockDislikeRepository.delete).toHaveBeenCalledWith(
        mockToggleDislike,
      )
    })
  })
})
