import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Knex } from 'knex'
import { injectable, inject } from 'tsyringe'

import { TTokenPayload } from '@/domain/entities/UserEntity'
import { IAuthRepository } from '@/domain/interfaces/repositories/database/IAuthRepository'

@injectable()
export class KnexAuthRepository implements IAuthRepository {
  private readonly JWT_SECRET: string
  private readonly JWT_EXPIRES_IN: string
  private readonly JWT_REFRESH_SECRET: string
  private readonly JWT_REFRESH_EXPIRES_IN: string
  private readonly SALT_ROUNDS: number

  constructor(@inject('Knex') private readonly knex: Knex) {
    this.JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
    this.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret'
    this.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    this.SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  generateAccessToken(payload: TTokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    })
  }

  generateRefreshToken(payload: TTokenPayload): string {
    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    })
  }

  async verifyToken(token: string): Promise<TTokenPayload | null> {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TTokenPayload
    } catch {
      return null
    }
  }

  async verifyRefreshToken(token: string): Promise<TTokenPayload | null> {
    try {
      return jwt.verify(token, this.JWT_REFRESH_SECRET) as TTokenPayload
    } catch {
      return null
    }
  }
}
