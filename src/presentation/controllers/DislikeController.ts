import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'

import { DislikeService } from '@/application/services/DislikeService'

@injectable()
export class DislikeController {
  constructor(
    @inject('DislikeService') private dislikeService: DislikeService,
  ) {}

  async toggleDislike(req: Request, res: Response, next: NextFunction) {
    try {
      await this.dislikeService.toggleDislike({
        listingId: req.params.listingId,
        brokerId: req.userId!,
      })

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
