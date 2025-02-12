import {
  FavoriteEntity,
  TToggleFavorite,
} from '@/domain/entities/FavoriteEntity'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

export interface IFavoriteRepository {
  create: (props: TToggleFavorite) => Promise<ICreationResult>
  delete: (props: TToggleFavorite) => Promise<void>
  findByBrokerAndListing: (
    props: TToggleFavorite,
  ) => Promise<FavoriteEntity | null>
}
