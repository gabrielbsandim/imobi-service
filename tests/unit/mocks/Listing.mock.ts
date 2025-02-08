import { IPaginationResponse } from '@/domain/application/pagination.types'
import {
  EBathroom,
  ListingEntity,
  TCreateListingRequest,
  TListListingFilterRequest,
  TUpdateListingRequest,
} from '@/domain/entities/ListingEntity'
import { IListingRepository } from '@/domain/interfaces/Repositories/database/IListingRepository'

export const mockCreateListingRequest: jest.Mocked<TCreateListingRequest> = {
  buyerId: '123',
  buyerPhoneNumber: '+5511999999999',
  transactionType: 'buy',
  propertyType: 'apartment',
  city: 'São Paulo',
  description: 'Teste',
  bathrooms: EBathroom.TWO,
}

export const mockUpdateListingRequest: jest.Mocked<TUpdateListingRequest> = {
  transactionType: 'buy',
  propertyType: 'apartment',
  city: 'São Paulo',
  description: 'Teste Update',
  bathrooms: EBathroom.TWO,
}

export const mockListingFilterRequest: jest.Mocked<TListListingFilterRequest> =
  {
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
  create: jest.fn().mockResolvedValue(mockListing),
  list: jest.fn().mockResolvedValue(mockListListing),
  findById: jest.fn().mockResolvedValue(mockListing),
  delete: jest.fn(),
  update: jest.fn(),
}
