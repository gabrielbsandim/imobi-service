import { Router } from 'express'
import { container } from 'tsyringe'

import { AuthController } from '@/presentation/controllers/AuthController'
import { authenticate } from '@/presentation/middlewares/authenticate'

const router = Router()
const authController = container.resolve(AuthController)

router.post('/login', authController.login.bind(authController))
router.post('/register', authController.register.bind(authController))
router.post('/refresh-token', authController.refreshToken.bind(authController))
router.post('/logout', authenticate, authController.logout.bind(authController))

router.post('/verify-email', authController.verifyEmail.bind(authController))
router.post(
  '/resend-verification',
  authController.resendVerificationCode.bind(authController),
)

router.post(
  '/request-password-reset',
  authController.requestPasswordReset.bind(authController),
)
router.post(
  '/reset-password',
  authController.resetPassword.bind(authController),
)

export default router
