import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'

import { FavoriteService } from '@/application/services/FavoriteService'

@injectable()
export class FavoriteController {
  constructor(
    @inject('FavoriteService') private favoriteService: FavoriteService,
  ) {}

  async toggleFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      await this.favoriteService.toggleFavorite({
        listingId: req.params.listingId,
        brokerId: req.user!.userId!,
      })

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
