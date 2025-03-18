import { randomBytes } from 'crypto'

import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

import { TCreateUser, UserEntity } from '@/domain/entities/UserEntity'
import { IUserRepository } from '@/domain/interfaces/repositories/database/IUserRepository'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'
import { NotFoundError } from '@/errors/HttpErrors'

@injectable()
export class KnexUserRepository implements IUserRepository {
  constructor(@inject('Knex') private readonly knex: Knex) {}

  async create(user: TCreateUser): Promise<ICreationResult> {
    const [userId] = await this.knex('users')
      .insert({
        name: user.name,
        email: user.email,
        password: user.password,
        user_type: user.userType,
        email_verified: false,
      })
      .returning('id')

    // Gera um código de verificação e envia por e-mail (enviado pelo AuthService)
    await this.generateVerificationCode(userId.id)

    return userId
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.knex('users').where({ email }).first()

    return user ? this.toDomain(user) : null
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const user = await this.knex('users').where({ id: userId }).first()

    return user ? this.toDomain(user) : null
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.knex('users').where({ id: userId }).update({
      refresh_token: refreshToken,
      updated_at: this.knex.fn.now(),
    })
  }

  async generateVerificationCode(userId: string): Promise<string> {
    // Verifica se o usuário existe
    const user = await this.findById(userId)
    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    // Gera um código de 6 dígitos
    const code = this.generateRandomCode(6)

    // Define data de expiração (24 horas)
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 24)

    // Atualiza o usuário com o código
    await this.knex('users').where({ id: userId }).update({
      verification_code: code,
      verification_code_expiry: expiryDate,
      updated_at: this.knex.fn.now(),
    })

    return code
  }

  async verifyEmail(userId: string, code: string): Promise<boolean> {
    // Verifica se o usuário existe
    const user = await this.findById(userId)
    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    // Verifica se o código é válido e não expirou
    if (!user.verificationCode || user.verificationCode !== code) {
      return false
    }

    if (
      !user.verificationCodeExpiry ||
      new Date() > user.verificationCodeExpiry
    ) {
      return false
    }

    // Marca o e-mail como verificado e limpa o código
    await this.markEmailAsVerified(userId)

    return true
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.knex('users').where({ id: userId }).update({
      email_verified: true,
      verification_code: null,
      verification_code_expiry: null,
      updated_at: this.knex.fn.now(),
    })
  }

  async generatePasswordResetCode(userId: string): Promise<string> {
    // Verifica se o usuário existe
    const user = await this.findById(userId)
    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    // Gera um código de 6 dígitos
    const code = this.generateRandomCode(6)

    // Define data de expiração (1 hora)
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1)

    // Atualiza o usuário com o código
    await this.knex('users').where({ id: userId }).update({
      reset_password_code: code,
      reset_password_code_expiry: expiryDate,
      updated_at: this.knex.fn.now(),
    })

    return code
  }

  async verifyPasswordResetCode(
    userId: string,
    code: string,
  ): Promise<boolean> {
    // Verifica se o usuário existe
    const user = await this.findById(userId)
    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    // Verifica se o código é válido e não expirou
    if (!user.resetPasswordCode || user.resetPasswordCode !== code) {
      return false
    }

    if (
      !user.resetPasswordCodeExpiry ||
      new Date() > user.resetPasswordCodeExpiry
    ) {
      return false
    }

    return true
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    // Verifica se o usuário existe
    const user = await this.findById(userId)
    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    await this.knex('users').where({ id: userId }).update({
      password: newPassword,
      reset_password_code: null,
      reset_password_code_expiry: null,
      updated_at: this.knex.fn.now(),
    })
  }

  private generateRandomCode(length: number): string {
    // Gera um código numérico aleatório com o comprimento especificado
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
      .toUpperCase()
      .replace(/[^0-9]/g, '0') // Substitui caracteres não numéricos por 0
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(raw: any): UserEntity {
    return new UserEntity(
      raw.id,
      raw.name,
      raw.user_type,
      raw.email,
      raw.password,
      raw.refresh_token,
      raw.email_verified,
      raw.verification_code,
      raw.verification_code_expiry,
      raw.reset_password_code,
      raw.reset_password_code_expiry,
      raw.created_at,
      raw.updated_at,
    )
  }
}
