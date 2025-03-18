import { UserEntity, TCreateUser } from '@/domain/entities/UserEntity'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

export interface IUserRepository {
  create(user: TCreateUser): Promise<ICreationResult>
  findByEmail(email: string): Promise<UserEntity | null>
  findById(id: string): Promise<UserEntity | null>
  updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>

  // Email verification methods
  generateVerificationCode(userId: string): Promise<string>
  verifyEmail(userId: string, code: string): Promise<boolean>
  markEmailAsVerified(userId: string): Promise<void>

  // Password reset methods
  generatePasswordResetCode(userId: string): Promise<string>
  verifyPasswordResetCode(userId: string, code: string): Promise<boolean>
  updatePassword(userId: string, newPassword: string): Promise<void>
}
