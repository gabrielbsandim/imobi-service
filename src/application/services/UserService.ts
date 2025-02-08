import { injectable, inject } from 'tsyringe'

import { TCreateUserRequest } from '@/domain/entities/UserEntity'
import { IUserRepository } from '@/domain/interfaces/Repositories/database/IUserRepository'
import { NotFoundError } from '@/errors/HttpErrors'

@injectable()
export class UserService {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    return user
  }

  async create(user: TCreateUserRequest) {
    return this.userRepository.create(user)
  }
}
