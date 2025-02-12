import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'

import { AuthService } from '@/application/services/AuthService'
import { UserService } from '@/application/services/UserService'
import { schemaValidator } from '@/presentation/schemas/schemaValidator'
import {
  registerSchema,
  TRegisterSchema,
} from '@/presentation/schemas/userSchema'

@injectable()
export class UserController {
  constructor(
    @inject('UserService') private readonly userService: UserService,
    @inject('AuthService') private readonly authService: AuthService,
  ) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = await schemaValidator<TRegisterSchema>(
        registerSchema,
        req.body,
      )

      const auth = await this.authService.register({
        displayName: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      })

      const created = await this.userService.create({
        ...validatedData,
        id: auth.uid,
      })

      res.status(201).json(created)
    } catch (error) {
      next(error)
    }
  }

  async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params

      const user = await this.userService.findById(userId)

      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}
