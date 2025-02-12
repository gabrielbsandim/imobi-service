import { Router } from 'express'
import { container } from 'tsyringe'

import { DislikeController } from '@/presentation/controllers/DislikeController'
import { authenticate } from '@/presentation/middlewares/authenticate'

const router = Router()
const dislikeController = container.resolve(DislikeController)

router.post(
  'listings/:listingId/dislikes/toggle',
  authenticate,
  dislikeController.toggleDislike.bind(dislikeController),
)

export default router
