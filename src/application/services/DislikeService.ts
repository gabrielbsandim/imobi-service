import { injectable, inject } from 'tsyringe'

import { ListingService } from '@/application/services/ListingService'
import { TToggleDislike } from '@/domain/entities/DislikeEntity'
import { KnexDislikeRepository } from '@/infra/repositories/database/KnexDislikeRepository'

@injectable()
export class DislikeService {
  constructor(
    @inject('IDislikeRepository')
    private readonly dislikeRepository: KnexDislikeRepository,
    @inject('ListingService') private readonly listingService: ListingService,
  ) {}

  async toggleDislike(props: TToggleDislike) {
    await this.listingService.findById(props.listingId)

    const dislike = await this.dislikeRepository.findByBrokerAndListing(props)

    if (dislike) {
      return this.dislikeRepository.delete(props)
    }

    return this.dislikeRepository.create(props)
  }
}
