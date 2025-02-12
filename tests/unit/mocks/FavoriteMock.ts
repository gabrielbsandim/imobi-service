import {
  FavoriteEntity,
  TToggleFavorite,
} from '@/domain/entities/FavoriteEntity'
import { IFavoriteRepository } from '@/domain/interfaces/repositories/database/IFavoriteRepository'

export const mockToggleFavorite: jest.Mocked<TToggleFavorite> = {
  brokerId: 'broker_id',
  listingId: 'listing_id',
}

export const mockFavorite: jest.Mocked<FavoriteEntity> = {
  ...mockToggleFavorite,
  id: 'favorite_id',
}

export const mockFavoriteRepository: jest.Mocked<IFavoriteRepository> = {
  create: jest.fn().mockResolvedValue({ id: mockFavorite.id }),
  delete: jest.fn(),
  findByBrokerAndListing: jest.fn().mockResolvedValue(mockFavorite),
}
