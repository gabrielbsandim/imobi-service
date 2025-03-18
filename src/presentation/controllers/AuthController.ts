import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'

import { AuthService } from '@/application/services/AuthService'
import {
  TCreateUser,
  TUserCredentials,
  TVerifyEmailRequest,
  TRequestResetPasswordRequest,
  TResetPasswordRequest,
} from '@/domain/entities/UserEntity'
import { schemaValidator } from '@/presentation/schemas/schemaValidator'
import {
  loginSchema,
  registerSchema,
  verifyEmailSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from '@/presentation/schemas/userSchema'

@injectable()
export class AuthController {
  constructor(
    @inject('AuthService') private readonly authService: AuthService,
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = await schemaValidator<TUserCredentials>(
        loginSchema,
        req.body,
      )

      const authResult = await this.authService.login(validatedData)

      res.status(200).json(authResult)
    } catch (error) {
      next(error)
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = await schemaValidator<TCreateUser>(
        registerSchema,
        req.body,
      )

      const authResult = await this.authService.register(validatedData)

      res.status(201).json(authResult)
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { refreshToken } = await schemaValidator(
        refreshTokenSchema,
        req.body,
      )

      const authResult = await this.authService.refreshToken(refreshToken)

      res.status(200).json(authResult)
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req

      await this.authService.logout(userId!)

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = await schemaValidator<TVerifyEmailRequest>(
        verifyEmailSchema,
        req.body,
      )

      await this.authService.verifyEmail(validatedData)

      res.status(200).json({ message: 'E-mail verificado com sucesso' })
    } catch (error) {
      next(error)
    }
  }

  async resendVerificationCode(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body

      await this.authService.resendVerificationCode(email)

      res
        .status(200)
        .json({ message: 'Código de verificação reenviado com sucesso' })
    } catch (error) {
      next(error)
    }
  }

  async requestPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = await schemaValidator<TRequestResetPasswordRequest>(
        requestPasswordResetSchema,
        req.body,
      )

      await this.authService.requestPasswordReset(validatedData)

      res.status(200).json({
        message: 'Código de redefinição de senha enviado para seu e-mail',
      })
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = await schemaValidator<TResetPasswordRequest>(
        resetPasswordSchema,
        req.body,
      )

      await this.authService.resetPassword(validatedData)

      res.status(200).json({ message: 'Senha redefinida com sucesso' })
    } catch (error) {
      next(error)
    }
  }
}
