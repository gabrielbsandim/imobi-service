import { DislikeEntity, TToggleDislike } from '@/domain/entities/DislikeEntity'
import { IDislikeRepository } from '@/domain/interfaces/repositories/database/IDislikeRepository'

export const mockToggleDislike: jest.Mocked<TToggleDislike> = {
  brokerId: 'broker_id',
  listingId: 'listing_id',
}

export const mockDislike: jest.Mocked<DislikeEntity> = {
  ...mockToggleDislike,
  id: 'dislike_id',
}

export const mockDislikeRepository: jest.Mocked<IDislikeRepository> = {
  create: jest.fn().mockResolvedValue({ id: mockDislike.id }),
  delete: jest.fn(),
  findByBrokerAndListing: jest.fn().mockResolvedValue(mockDislike),
}
