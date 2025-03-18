import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'

import { AuthService } from '@/application/services/AuthService'
import { UnauthorizedError } from '@/errors/HttpErrors'

@injectable()
export class AuthMiddleware {
  constructor(
    @inject('AuthService') private readonly authService: AuthService,
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedError('Token não fornecido')
    }

    const [bearer, token] = authHeader.split(' ')

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedError('Token mal formatado')
    }

    try {
      const decoded = await this.authService.verifyToken(token)

      req.userId = decoded.userId
      req.userEmail = decoded.email
      req.userType = decoded.userType

      return next()
    } catch {
      throw new UnauthorizedError('Token inválido ou expirado')
    }
  }
}
