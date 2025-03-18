import { TTokenPayload } from '@/domain/entities/UserEntity'

export interface IAuthRepository {
  hashPassword(password: string): Promise<string>
  comparePassword(password: string, hashedPassword: string): Promise<boolean>
  generateAccessToken(payload: TTokenPayload): string
  generateRefreshToken(payload: TTokenPayload): string
  verifyToken(token: string): Promise<TTokenPayload | null>
  verifyRefreshToken(token: string): Promise<TTokenPayload | null>
}
