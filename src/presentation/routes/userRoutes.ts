import { Router } from 'express'
import { container } from 'tsyringe'

import { UserController } from '@/presentation/controllers/UserController'

const router = Router()
const userController = container.resolve(UserController)

router.post('/register', userController.register.bind(userController))
router.post('/login', userController.login.bind(userController))

export default router
