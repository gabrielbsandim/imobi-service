import { IPaginationResponse } from '@/domain/application/pagination.types'
import {
  ListingEntity,
  TCreateListingRequest,
  TListListingFilterRequest,
  TUpdateListingRequest,
} from '@/domain/entities/ListingEntity'

export const mockCreateListingRequest: jest.Mocked<TCreateListingRequest> = {
  buyerId: '123',
  transactionType: 'buy',
  propertyType: 'apartment',
  city: 'São Paulo',
  description: 'Teste',
  bathrooms: 2,
}

export const mockUpdateListingRequest: jest.Mocked<TUpdateListingRequest> = {
  transactionType: 'buy',
  propertyType: 'apartment',
  city: 'São Paulo',
  description: 'Teste Update',
  bathrooms: 2,
}

export const mockListingFilterRequest: jest.Mocked<TListListingFilterRequest> =
  {
    propertyType: 'apartment',
    city: 'São Paulo',
    bathrooms: 2,
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
