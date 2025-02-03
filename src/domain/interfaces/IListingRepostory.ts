import {
  IPaginationResponse,
  TPaginationRequest,
} from '@/domain/application/pagination.types'
import {
  ListingEntity,
  TCreateListingRequest,
  TListListingFilterRequest,
  TUpdateListingRequest,
} from '@/domain/entities/ListingEntity'

export interface IListingRepository {
  create(listing: TCreateListingRequest): Promise<ListingEntity>
  findById(id: string): Promise<ListingEntity | null>
  update(id: string, updates: TUpdateListingRequest): Promise<void>
  delete(id: string): Promise<void>
  list(
    filters: TListListingFilterRequest,
    pagination?: TPaginationRequest,
  ): Promise<IPaginationResponse<ListingEntity>>
}
