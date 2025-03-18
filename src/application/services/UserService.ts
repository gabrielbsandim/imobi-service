import { injectable, inject } from 'tsyringe'

import { TCreateUser, UserEntity } from '@/domain/entities/UserEntity'
import { IUserRepository } from '@/domain/interfaces/repositories/database/IUserRepository'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'
import { NotFoundError, UnauthorizedError } from '@/errors/HttpErrors'

@injectable()
export class UserService {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    return user
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas')
    }

    return user
  }

  async create(user: TCreateUser): Promise<ICreationResult> {
    return this.userRepository.create(user)
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const user = await this.findById(userId)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    await this.userRepository.updateRefreshToken(userId, refreshToken)
  }

  async generateVerificationCode(userId: string): Promise<string> {
    return this.userRepository.generateVerificationCode(userId)
  }

  async verifyEmail(userId: string, code: string): Promise<boolean> {
    return this.userRepository.verifyEmail(userId, code)
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.userRepository.markEmailAsVerified(userId)
  }

  async generatePasswordResetCode(userId: string): Promise<string> {
    return this.userRepository.generatePasswordResetCode(userId)
  }

  async verifyPasswordResetCode(
    userId: string,
    code: string,
  ): Promise<boolean> {
    return this.userRepository.verifyPasswordResetCode(userId, code)
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.userRepository.updatePassword(userId, newPassword)
  }
}
