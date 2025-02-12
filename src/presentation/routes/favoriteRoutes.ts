import { Router } from 'express'
import { container } from 'tsyringe'

import { FavoriteController } from '@/presentation/controllers/FavoriteController'
import { authenticate } from '@/presentation/middlewares/authenticate'

const router = Router()
const favoriteController = container.resolve(FavoriteController)

router.post(
  'listings/:listingId/favorites/toggle',
  authenticate,
  favoriteController.toggleFavorite.bind(favoriteController),
)

export default router
