import { Router } from 'express'
import { container } from 'tsyringe'

import { ListingController } from '@/presentation/controllers/ListingController'

const router = Router()
const listingController = container.resolve(ListingController)

router.post('/listing', listingController.create.bind(listingController))
router.get('/listing/:id', listingController.findById.bind(listingController))
router.put('/listing/:id', listingController.update.bind(listingController))
router.delete('/listing/:id', listingController.delete.bind(listingController))
router.get('/listings', listingController.list.bind(listingController))

export default router
