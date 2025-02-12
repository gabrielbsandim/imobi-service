import { injectable, inject } from 'tsyringe'

import { ListingService } from '@/application/services/ListingService'
import { TToggleFavorite } from '@/domain/entities/FavoriteEntity'
import { KnexFavoriteRepository } from '@/infra/repositories/database/KnexFavoriteRepository'

@injectable()
export class FavoriteService {
  constructor(
    @inject('IFavoriteRepository')
    private readonly favoriteRepository: KnexFavoriteRepository,
    @inject('ListingService') private readonly listingService: ListingService,
  ) {}

  async toggleFavorite(props: TToggleFavorite) {
    await this.listingService.findById(props.listingId)

    const favorite = await this.favoriteRepository.findByBrokerAndListing(props)

    if (favorite) {
      return this.favoriteRepository.delete(props)
    }

    return this.favoriteRepository.create(props)
  }
}
