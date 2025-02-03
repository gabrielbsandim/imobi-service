import { container } from 'tsyringe'

import { ListingService } from '@/application/services/ListingService'
import {
  mockCreateListingRequest,
  mockListing,
  mockListingFilterRequest,
  mockListingRepository,
  mockListListing,
  mockUpdateListingRequest,
} from '@/tests/unit/mocks/Listing.mock'

container.register('IListingRepository', { useValue: mockListingRepository })

describe('ListingService', () => {
  let listingService: ListingService

  beforeEach(() => {
    listingService = container.resolve(ListingService)
    jest.clearAllMocks()
  })

  it('should create listing', async () => {
    const listing = await listingService.create(mockCreateListingRequest)

    expect(listing).toHaveProperty('id', mockListing.id)

    expect(mockListingRepository.create).toHaveBeenCalledWith(
      mockCreateListingRequest,
    )
  })

  it('should update listing', async () => {
    await listingService.update(mockListing.id, mockUpdateListingRequest)

    expect(mockListingRepository.update).toHaveBeenCalledWith(
      mockListing.id,
      mockUpdateListingRequest,
    )
  })

  it('should delete listing', async () => {
    await listingService.delete(mockListing.id)

    expect(mockListingRepository.delete).toHaveBeenCalledWith(mockListing.id)
  })

  it('should findById listing', async () => {
    const listening = await listingService.findById(mockListing.id)

    expect(mockListingRepository.findById).toHaveBeenCalledWith(mockListing.id)

    expect(listening).toEqual(mockListing)
  })

  it('should list listings with filter', async () => {
    const response = await listingService.list(mockListingFilterRequest, {
      limit: 10,
      offset: 0,
    })

    expect(mockListingRepository.list).toHaveBeenCalledWith(
      mockListingFilterRequest,
      {
        limit: 10,
        offset: 0,
      },
    )

    expect(response).toEqual(mockListListing)
  })
})
