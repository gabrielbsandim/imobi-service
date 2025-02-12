import { injectable, inject } from 'tsyringe'

import { TToggleDislike } from '@/domain/entities/DislikeEntity'
import { KnexDislikeRepository } from '@/infra/repositories/database/KnexDislikeRepository'

@injectable()
export class DislikeService {
  constructor(
    @inject('IDislikeRepository')
    private readonly dislikeRepository: KnexDislikeRepository,
  ) {}

  async toggleDislike(props: TToggleDislike) {
    const dislike = await this.dislikeRepository.findByBrokerAndListing(props)

    if (dislike) {
      return this.dislikeRepository.delete(props)
    }

    await this.dislikeRepository.create(props)
  }
}
