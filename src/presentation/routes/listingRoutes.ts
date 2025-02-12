import { Router } from 'express'
import { container } from 'tsyringe'

import { ListingController } from '@/presentation/controllers/ListingController'
import { authenticate } from '@/presentation/middlewares/authenticate'

const router = Router()
const listingController = container.resolve(ListingController)

router.post(
  '/listing',
  authenticate,
  listingController.create.bind(listingController),
)
router.get(
  '/listing/:id',
  authenticate,
  listingController.findById.bind(listingController),
)
router.patch(
  '/listing/:id',
  authenticate,
  listingController.update.bind(listingController),
)
router.delete(
  '/listing/:id',
  authenticate,
  listingController.delete.bind(listingController),
)
router.get(
  '/listings',
  authenticate,
  listingController.list.bind(listingController),
)

export default router
