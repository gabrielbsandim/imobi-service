import { Router } from 'express'
import { container } from 'tsyringe'

import { UserController } from '@/presentation/controllers/UserController'
import { authenticate } from '@/presentation/middlewares/authenticate'

const router = Router()
const userController = container.resolve(UserController)

// Busca de usuário por ID (requer autenticação)
router.get(
  '/:userId',
  authenticate,
  userController.findById.bind(userController),
)

export default router
