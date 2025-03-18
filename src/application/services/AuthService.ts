import { inject, injectable } from 'tsyringe'

import { EmailService } from '@/application/services/EmailService'
import { UserService } from '@/application/services/UserService'
import {
  TAuthResult,
  TTokenPayload,
  TUserCredentials,
  TCreateUser,
  TVerifyEmailRequest,
  TRequestResetPasswordRequest,
  TResetPasswordRequest,
} from '@/domain/entities/UserEntity'
import { IAuthRepository } from '@/domain/interfaces/repositories/database/IAuthRepository'
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from '@/errors/HttpErrors'

@injectable()
export class AuthService {
  constructor(
    @inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    @inject('UserService')
    private readonly userService: UserService,
    @inject('EmailService')
    private readonly emailService: EmailService,
  ) {}

  async login(credentials: TUserCredentials): Promise<TAuthResult> {
    const user = await this.userService.findByEmail(credentials.email)

    const passwordMatches = await this.authRepository.comparePassword(
      credentials.password,
      user.password,
    )

    if (!passwordMatches) {
      throw new UnauthorizedError('Credenciais inválidas')
    }

    const payload: TTokenPayload = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
    }

    const accessToken = this.authRepository.generateAccessToken(payload)
    const refreshToken = this.authRepository.generateRefreshToken(payload)

    await this.userService.updateRefreshToken(user.id, refreshToken)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified,
      },
    }
  }

  async refreshToken(token: string): Promise<TAuthResult> {
    const decoded = await this.authRepository.verifyRefreshToken(token)

    if (!decoded) {
      throw new UnauthorizedError('Refresh token inválido ou expirado')
    }

    const user = await this.userService.findById(decoded.userId)

    if (!user.refreshToken || user.refreshToken !== token) {
      throw new UnauthorizedError('Refresh token inválido')
    }

    const payload: TTokenPayload = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
    }

    const accessToken = this.authRepository.generateAccessToken(payload)
    const refreshToken = this.authRepository.generateRefreshToken(payload)

    await this.userService.updateRefreshToken(user.id, refreshToken)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified,
      },
    }
  }

  async register(user: TCreateUser): Promise<TAuthResult> {
    const hashedPassword = await this.authRepository.hashPassword(user.password)

    const createdUser = await this.userService.create({
      ...user,
      password: hashedPassword,
    })

    // Obtém o usuário completo após a criação
    const fullUser = await this.userService.findById(createdUser.id)

    // Gera e envia o código de verificação de email
    const verificationCode = await this.userService.generateVerificationCode(
      fullUser.id,
    )

    // Envia o email de boas-vindas com o código de verificação
    await this.emailService.sendWelcomeEmail(
      fullUser.email,
      fullUser.name,
      fullUser.userType,
      verificationCode,
    )

    // Faz login automaticamente após o registro
    return this.login({
      email: user.email,
      password: user.password,
    })
  }

  async verifyToken(token: string): Promise<TTokenPayload> {
    const decoded = await this.authRepository.verifyToken(token)

    if (!decoded) {
      throw new UnauthorizedError('Token inválido ou expirado')
    }

    return decoded
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null)
  }

  async verifyEmail(request: TVerifyEmailRequest): Promise<boolean> {
    const user = await this.userService.findByEmail(request.email)

    // Verifica o código através do repositório
    const isVerified = await this.userService.verifyEmail(user.id, request.code)

    if (!isVerified) {
      throw new UnauthorizedError('Código de verificação inválido ou expirado')
    }

    return true
  }

  async resendVerificationCode(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email)

    if (user.emailVerified) {
      throw new BadRequestError('E-mail já foi verificado')
    }

    // Gera um novo código de verificação
    const verificationCode = await this.userService.generateVerificationCode(
      user.id,
    )

    // Envia o email com o novo código
    await this.emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationCode,
    )
  }

  async requestPasswordReset(
    request: TRequestResetPasswordRequest,
  ): Promise<void> {
    const user = await this.userService.findByEmail(request.email)

    // Gera um código de reset de senha
    const resetCode = await this.userService.generatePasswordResetCode(user.id)

    // Envia o email com o código de reset
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetCode,
    )
  }

  async resetPassword(request: TResetPasswordRequest): Promise<void> {
    const user = await this.userService.findByEmail(request.email)

    // Verifica se o código de reset é válido
    const isValidCode = await this.userService.verifyPasswordResetCode(
      user.id,
      request.code,
    )

    if (!isValidCode) {
      throw new UnauthorizedError(
        'Código de redefinição de senha inválido ou expirado',
      )
    }

    // Hash a nova senha
    const hashedPassword = await this.authRepository.hashPassword(
      request.newPassword,
    )

    // Atualiza a senha do usuário
    await this.userService.updatePassword(user.id, hashedPassword)
  }
}
