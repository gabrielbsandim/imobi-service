import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

import { TCreateUser, UserEntity } from '@/domain/entities/UserEntity'
import { IUserRepository } from '@/domain/interfaces/repositories/database/IUserRepository'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

@injectable()
export class KnexUserRepository implements IUserRepository {
  constructor(@inject('Knex') private readonly knex: Knex) {}

  async create(user: TCreateUser): Promise<ICreationResult> {
    const [userId] = await this.knex('users')
      .insert({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        user_type: user.userType,
      })
      .returning('id')

    return userId
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.knex('users').where({ email }).first()

    return user ? this.toDomain(user) : null
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const user = this.knex('users').where({ id: userId }).first()

    return user ? this.toDomain(user) : null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(raw: any): UserEntity {
    return new UserEntity(
      raw.id,
      raw.name,
      raw.phone_number,
      raw.user_type,
      raw.email,
      raw.password,
    )
  }
}
