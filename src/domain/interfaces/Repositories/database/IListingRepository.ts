import {
  ListingEntity,
  TCreateListingRequest,
  TListListingFilterRequest,
  TUpdateListingRequest,
} from '@/domain/entities/ListingEntity'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'
import {
  IPaginationResponse,
  TPaginationRequest,
} from '@/domain/interfaces/shared/IPagination'

export interface IListingRepository {
  create(listing: TCreateListingRequest): Promise<ICreationResult>
  findById(id: string): Promise<ListingEntity | null>
  update(id: string, updates: TUpdateListingRequest): Promise<void>
  delete(id: string): Promise<void>
  list(
    filters: TListListingFilterRequest,
    pagination?: TPaginationRequest,
  ): Promise<IPaginationResponse<ListingEntity>>
}
