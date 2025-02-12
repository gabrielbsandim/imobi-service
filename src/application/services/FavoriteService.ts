import { injectable, inject } from 'tsyringe'

import { TToggleFavorite } from '@/domain/entities/FavoriteEntity'
import { KnexFavoriteRepository } from '@/infra/repositories/database/KnexFavoriteRepository'

@injectable()
export class FavoriteService {
  constructor(
    @inject('IFavoriteRepository')
    private readonly favoriteRepository: KnexFavoriteRepository,
  ) {}

  async toggleFavorite(props: TToggleFavorite) {
    const favorite = await this.favoriteRepository.findByBrokerAndListing(props)

    if (favorite) {
      return this.favoriteRepository.delete(props)
    }

    await this.favoriteRepository.create(props)
  }
}
