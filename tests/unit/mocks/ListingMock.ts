import {
  EBathroom,
  ListingEntity,
  TCreateListing,
  TListListingFilter,
  TUpdateListing,
} from '@/domain/entities/ListingEntity'
import { IListingRepository } from '@/domain/interfaces/repositories/database/IListingRepository'
import { IPaginationResponse } from '@/domain/interfaces/shared/IPagination'

export const mockCreateListingRequest: jest.Mocked<TCreateListing> = {
  buyerId: '123',
  buyerPhoneNumber: '+5511999999999',
  transactionType: 'buy',
  propertyType: 'apartment',
  city: 'São Paulo',
  description: 'Teste',
  bathrooms: EBathroom.TWO,
}

export const mockUpdateListingRequest: jest.Mocked<TUpdateListing> = {
  transactionType: 'buy',
  propertyType: 'apartment',
  city: 'São Paulo',
  description: 'Teste Update',
  bathrooms: EBathroom.TWO,
}

export const mockListingFilterRequest: jest.Mocked<TListListingFilter> = {
  propertyType: 'apartment',
  city: 'São Paulo',
  bathrooms: EBathroom.TWO,
}

export const mockListing: jest.Mocked<ListingEntity> = {
  ...mockCreateListingRequest,
  id: '456',
}

export const mockListListing: jest.Mocked<IPaginationResponse<ListingEntity>> =
  {
    items: [mockListing],
    pagination: {
      limit: 10,
      offset: 0,
      total: 1,
    },
  }

export const mockListingRepository: jest.Mocked<IListingRepository> = {
  create: jest.fn().mockResolvedValue({
    id: mockListing.id,
  }),
  list: jest.fn().mockResolvedValue(mockListListing),
  findById: jest.fn().mockResolvedValue(mockListing),
  delete: jest.fn(),
  update: jest.fn(),
}
