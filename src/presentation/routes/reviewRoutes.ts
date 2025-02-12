import { Router } from 'express'
import { container } from 'tsyringe'

import { ReviewController } from '@/presentation/controllers/ReviewController'
import { authenticate } from '@/presentation/middlewares/authenticate'

const router = Router()
const reviewController = container.resolve(ReviewController)

router.post(
  'broker/:brokerId/review',
  authenticate,
  reviewController.create.bind(reviewController),
)

router.get(
  'broker/:brokerId/review/average',
  authenticate,
  reviewController.getAverageRating.bind(reviewController),
)

export default router
