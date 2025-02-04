import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

import { TCreateUserRequest, UserEntity } from '@/domain/entities/UserEntity'
import { IUserRepository } from '@/domain/interfaces/IUserRepository'

@injectable()
export class KnexUserRepository implements IUserRepository {
  constructor(@inject('Knex') private readonly knex: Knex) {}

  async create(user: TCreateUserRequest): Promise<void> {
    await this.knex('users').insert({
      name: user.name,
      email: user.email,
      password: user.password,
      phone_number: user.phoneNumber,
      user_type: user.userType,
    })
  }

  async findByPhoneNumber(phoneNumber: string) {
    const user = await this.knex('users').where({ phoneNumber }).first()

    if (!user) {
      return null
    }

    return this.toDomain(user)
  }

  async findByEmail(email: string) {
    const user = await this.knex('users').where({ email }).first()

    if (!user) {
      return null
    }

    return this.toDomain(user)
  }

  async findById(userId: string) {
    const user = this.knex('users').where({ id: userId }).first()

    if (!user) {
      return null
    }

    return this.toDomain(user)
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
