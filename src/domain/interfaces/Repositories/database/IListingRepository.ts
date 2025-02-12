import {
  ListingEntity,
  TCreateListing,
  TListListingFilter,
  TUpdateListing,
} from '@/domain/entities/ListingEntity'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'
import {
  IPaginationResponse,
  TPaginationRequest,
} from '@/domain/interfaces/shared/IPagination'

export interface IListingRepository {
  create(listing: TCreateListing): Promise<ICreationResult>
  findById(id: string): Promise<ListingEntity | null>
  update(id: string, updates: TUpdateListing): Promise<void>
  delete(id: string): Promise<void>
  list(
    filters: TListListingFilter,
    pagination: TPaginationRequest,
    userId: string,
  ): Promise<IPaginationResponse<ListingEntity>>
}
