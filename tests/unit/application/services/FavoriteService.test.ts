import { container } from 'tsyringe'

import { FavoriteService } from '@/application/services/FavoriteService'
import { ListingService } from '@/application/services/ListingService'
import {
  mockFavorite,
  mockFavoriteRepository,
  mockToggleFavorite,
} from '@/tests/unit/mocks/FavoriteMock'
import {
  mockListing,
  mockListingRepository,
} from '@/tests/unit/mocks/ListingMock'

container.register('IFavoriteRepository', { useValue: mockFavoriteRepository })
container.register('IListingRepository', { useValue: mockListingRepository })

const mockListingService: jest.Mocked<Pick<ListingService, 'findById'>> = {
  findById: jest.fn().mockResolvedValue(mockListing),
}

container.register('ListingService', { useValue: mockListingService })

describe('FavoriteService', () => {
  let favoriteService: FavoriteService

  beforeEach(() => {
    container.resolve(ListingService)
    favoriteService = container.resolve(FavoriteService)
    jest.clearAllMocks()
  })

  describe('ToggleFavorite', () => {
    it('should toggle and create favorite', async () => {
      mockFavoriteRepository.findByBrokerAndListing.mockResolvedValueOnce(null)

      const response = await favoriteService.toggleFavorite(mockToggleFavorite)

      expect(mockListingService.findById).toHaveBeenCalledWith(
        mockToggleFavorite.listingId,
      )

      expect(mockFavoriteRepository.create).toHaveBeenCalledWith(
        mockToggleFavorite,
      )

      expect(response).toStrictEqual({ id: mockFavorite.id })
    })

    it('should toggle and remove favorite', async () => {
      await favoriteService.toggleFavorite(mockToggleFavorite)

      expect(mockListingService.findById).toHaveBeenCalledWith(
        mockToggleFavorite.listingId,
      )

      expect(mockFavoriteRepository.delete).toHaveBeenCalledWith(
        mockToggleFavorite,
      )
    })
  })
})
