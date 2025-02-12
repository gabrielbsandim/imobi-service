import { Router } from 'express'
import { container } from 'tsyringe'

import { UserController } from '@/presentation/controllers/UserController'

const router = Router()
const userController = container.resolve(UserController)

router.post('/register', userController.register.bind(userController))
router.get('/users/:userId', userController.findById.bind(userController))

export default router
