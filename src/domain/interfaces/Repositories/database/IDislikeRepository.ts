import { DislikeEntity, TToggleDislike } from '@/domain/entities/DislikeEntity'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

export interface IDislikeRepository {
  create: (props: TToggleDislike) => Promise<ICreationResult>
  delete: (props: TToggleDislike) => Promise<void>
  findByBrokerAndListing: (
    props: TToggleDislike,
  ) => Promise<DislikeEntity | null>
}
