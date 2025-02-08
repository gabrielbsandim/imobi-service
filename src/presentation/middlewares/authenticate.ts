import { Request, Response, NextFunction } from 'express'
import { container } from 'tsyringe'

import { AuthService } from '@/application/services/AuthService'
import { UserService } from '@/application/services/UserService'
import { UnauthorizedError } from '@/errors/HttpErrors'

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization

  const authService = container.resolve(AuthService)
  const userService = container.resolve(UserService)

  try {
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Token inválido'))
    }

    const token = authHeader.split(' ')[1]

    const decodedToken = await authService.verifyToken(token)

    const user = await userService.findById(decodedToken.uid)

    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)

    next(new UnauthorizedError('Token inválido ou expirado'))
  }
}
