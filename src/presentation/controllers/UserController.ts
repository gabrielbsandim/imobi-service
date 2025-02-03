import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'

import { UserService } from '@/application/services/UserService'
import { UnauthorizedError } from '@/errors/HttpErrors'
import { loginSchema, registerSchema } from '@/presentation/schemas/userSchema'

@injectable()
export class UserController {
  constructor(
    @inject('UserService') private readonly userService: UserService,
  ) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = await registerSchema.validate(req.body, {
        abortEarly: false,
      })

      await this.userService.register(validatedData)

      res.status(201).json({ message: 'Usuário registrado com sucesso!' })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = await loginSchema.validate(req.body, {
        abortEarly: false,
      })

      const token = await this.userService.login(email, password)

      if (!token) {
        throw new UnauthorizedError('Credenciais inválidas')
      }

      res.status(200).json({ token })
    } catch (error) {
      next(error)
    }
  }
}
